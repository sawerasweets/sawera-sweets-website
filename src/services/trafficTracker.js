import { supabase, isSupabaseConfigured } from './supabase';

class TrafficTracker {
  constructor() {
    this.visitorId = null;
    this.isNewVisitor = false;
    this.initVisitor();
  }

  initVisitor() {
    if (typeof window === 'undefined') return;
    try {
      let vid = localStorage.getItem('sawera_vid');
      if (!vid) {
        vid = 'v_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        localStorage.setItem('sawera_vid', vid);
        this.isNewVisitor = true;
      }
      this.visitorId = vid;
    } catch (e) {
      this.visitorId = 'v_' + Math.random().toString(36).substring(2, 9);
    }
  }

  async recordPageView(pathname) {
    if (typeof window === 'undefined') return;
    if (!pathname || pathname.startsWith('/admin')) return; // Never track Admin browsing as customer traffic

    const now = Date.now();
    // Debounce rapid re-renders
    if (this.lastPath === pathname && now - (this.lastTime || 0) < 2000) {
      return;
    }
    this.lastPath = pathname;
    this.lastTime = now;

    const isMobile = window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const device = isMobile ? 'mobile' : 'desktop';
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    const sessionKey = `sawera_view_${pathname}`;
    const isNewPageInSession = !sessionStorage.getItem(sessionKey);
    try {
      sessionStorage.setItem(sessionKey, '1');
    } catch (e) {}

    // 1. Update Local Cache
    let localData = null;
    try {
      const raw = localStorage.getItem('sawera_site_analytics');
      localData = raw ? JSON.parse(raw) : null;
    } catch (e) {}

    if (!localData || typeof localData !== 'object') {
      localData = {
        totalViews: 0,
        uniqueVisitors: 0,
        visitorIds: [],
        daily: {},
        devices: { mobile: 0, desktop: 0 },
        pages: {}
      };
    }

    localData.totalViews = (localData.totalViews || 0) + 1;
    localData.devices = localData.devices || { mobile: 0, desktop: 0 };
    localData.devices[device] = (localData.devices[device] || 0) + 1;
    localData.pages = localData.pages || {};
    localData.pages[pathname] = (localData.pages[pathname] || 0) + 1;

    localData.visitorIds = localData.visitorIds || [];
    if (!localData.visitorIds.includes(this.visitorId)) {
      localData.uniqueVisitors = (localData.uniqueVisitors || 0) + 1;
      if (localData.visitorIds.length < 5000) {
        localData.visitorIds.push(this.visitorId);
      }
    }

    localData.daily = localData.daily || {};
    if (!localData.daily[today]) {
      localData.daily[today] = { views: 0, uniques: 0, mobile: 0, desktop: 0 };
    }
    localData.daily[today].views = (localData.daily[today].views || 0) + 1;
    localData.daily[today][device] = (localData.daily[today][device] || 0) + 1;
    if (isNewPageInSession) {
      localData.daily[today].uniques = (localData.daily[today].uniques || 0) + 1;
    }

    try {
      localStorage.setItem('sawera_site_analytics', JSON.stringify(localData));
    } catch (e) {}

    // 2. Cloud Persistence via Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: cloudRow } = await supabase
          .from('sawera_settings')
          .select('data')
          .eq('id', 'site_analytics')
          .maybeSingle();

        const cloudData = cloudRow?.data || {
          totalViews: 0,
          uniqueVisitors: 0,
          visitorIds: [],
          daily: {},
          devices: { mobile: 0, desktop: 0 },
          pages: {}
        };

        cloudData.totalViews = (cloudData.totalViews || 0) + 1;
        cloudData.devices = cloudData.devices || { mobile: 0, desktop: 0 };
        cloudData.devices[device] = (cloudData.devices[device] || 0) + 1;
        cloudData.pages = cloudData.pages || {};
        cloudData.pages[pathname] = (cloudData.pages[pathname] || 0) + 1;

        cloudData.visitorIds = cloudData.visitorIds || [];
        if (!cloudData.visitorIds.includes(this.visitorId)) {
          cloudData.uniqueVisitors = (cloudData.uniqueVisitors || 0) + 1;
          if (cloudData.visitorIds.length < 5000) {
            cloudData.visitorIds.push(this.visitorId);
          }
        }

        cloudData.daily = cloudData.daily || {};
        if (!cloudData.daily[today]) {
          cloudData.daily[today] = { views: 0, uniques: 0, mobile: 0, desktop: 0 };
        }
        cloudData.daily[today].views = (cloudData.daily[today].views || 0) + 1;
        cloudData.daily[today][device] = (cloudData.daily[today][device] || 0) + 1;
        if (isNewPageInSession) {
          cloudData.daily[today].uniques = (cloudData.daily[today].uniques || 0) + 1;
        }

        await supabase.from('sawera_settings').upsert({
          id: 'site_analytics',
          data: cloudData,
          updated_at: new Date().toISOString()
        });

        localStorage.setItem('sawera_site_analytics', JSON.stringify(cloudData));
      } catch (err) {
        // Quiet fail - local cache remains intact
      }
    }
  }

  async getAnalytics() {
    let cloudData = null;
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase
          .from('sawera_settings')
          .select('data')
          .eq('id', 'site_analytics')
          .maybeSingle();
        if (data?.data) cloudData = data.data;
      } catch (e) {}
    }

    if (cloudData) {
      try {
        localStorage.setItem('sawera_site_analytics', JSON.stringify(cloudData));
      } catch (e) {}
      return cloudData;
    }

    try {
      const raw = localStorage.getItem('sawera_site_analytics');
      return raw ? JSON.parse(raw) : {
        totalViews: 0,
        uniqueVisitors: 0,
        devices: { mobile: 0, desktop: 0 },
        daily: {},
        pages: {}
      };
    } catch (e) {
      return { totalViews: 0, uniqueVisitors: 0, devices: { mobile: 0, desktop: 0 }, daily: {}, pages: {} };
    }
  }
}

export const trafficTracker = new TrafficTracker();
export default trafficTracker;
