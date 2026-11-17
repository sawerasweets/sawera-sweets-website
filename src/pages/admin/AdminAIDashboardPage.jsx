import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  Calendar, 
  Image as ImageIcon, 
  Share2, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Play, 
  Pause, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  MessageSquare, 
  Sliders, 
  Check, 
  X, 
  Eye, 
  Download, 
  Video,
  Layers,
  Zap,
  Globe,
  Radio
} from 'lucide-react';
import aiBrain from '../../services/aiBrain';
import db from '../../services/db';

export default function AdminAIDashboardPage() {
  const [activeTab, setActiveTab] = useState('command_center');
  const [telemetry, setTelemetry] = useState(aiBrain.getDashboardTelemetry());
  const [rules, setRules] = useState(aiBrain.rules);
  const [contentList, setContentList] = useState(aiBrain.loadContentStudio());
  
  // Interactive Chat State
  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: 'Salam Akash Bhai! Main **SAWERA AI Business Manager** hoon. Main aap ke Sawera Sweets & Bakers ke rozana ke marketing content, social media posts, WhatsApp customer support aur sales analysis ko autonomously manage karne ke liye hazir hoon.\n\nSystem **100% Free Mode (Rs. 0)** par active hai. Aap mujhe koi bhi instruction de sakte hain!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputCommand, setInputCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatBottomRef = useRef(null);

  // Upgrade key state
  const [openAiKey, setOpenAiKey] = useState(rules.apiKey || '');
  const [keySavedToast, setKeySavedToast] = useState(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const refreshAll = () => {
    setTelemetry(aiBrain.getDashboardTelemetry());
    setRules(aiBrain.loadRules());
    setContentList(aiBrain.loadContentStudio());
  };

  // Toggle Emergency Stop
  const handleToggleEmergencyStop = () => {
    const newState = !rules.emergencyStop;
    const res = aiBrain.setEmergencyStop(newState);
    setRules({ ...rules, emergencyStop: newState });
    setTelemetry(aiBrain.getDashboardTelemetry());
    
    setMessages(prev => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        sender: 'ai',
        text: res.message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Handle Command Submission
  const handleSendCommand = async (customText = null) => {
    const prompt = (customText || inputCommand).trim();
    if (!prompt || isProcessing) return;

    const userMsg = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputCommand('');
    setIsProcessing(true);

    try {
      const response = await aiBrain.processCommand(prompt);
      
      const aiReply = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        post: response.post || null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiReply]);
      refreshAll();
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          sender: 'ai',
          text: `⚠️ Maazrat, command process karte waqt error aaya: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick Action Buttons
  const quickActions = [
    { label: '✨ Create Today\'s Marketing Post', cmd: 'Create today\'s marketing content with fresh mithai images' },
    { label: '📊 Check Today\'s Sales & Orders', cmd: 'Show today\'s sales and orders telemetry' },
    { label: '📅 Plan Tomorrow\'s Routine', cmd: 'Prepare tomorrow\'s marketing plan' },
    { label: '💬 WhatsApp Support Status', cmd: 'Customer support inquiry sweep' }
  ];

  // Save Settings
  const handleSaveApiKey = () => {
    const updated = {
      ...rules,
      apiKey: openAiKey.trim(),
      engineMode: openAiKey.trim() ? 'pro' : 'free'
    };
    aiBrain.saveRules(updated);
    setRules(updated);
    setTelemetry(aiBrain.getDashboardTelemetry());
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#070B11] text-white -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* 1. TOP HEADER & TELEMETRY BAR */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#111827] to-[#1E1B4B] border border-amber-500/20 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-yellow-600 text-black flex items-center gap-1.5 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                SAWERA AI CORE v1.0
              </span>
              
              {rules.emergencyStop ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  EMERGENCY STOPPED
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  AUTONOMOUS AGENT ACTIVE (24/7)
                </span>
              )}

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-400" />
                {rules.engineMode === 'free' ? '100% FREE MODE (Rs. 0 / Mo)' : 'PRO MODE (OpenAI)'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Sawera AI Business Manager
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Autonomous Social Marketing, Multi-Platform Content Studio, AI Product Photography & Real-Time Store Intelligence for Sawera Sweets & Bakers.
            </p>
          </div>

          {/* Action & Kill Switch Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleToggleEmergencyStop}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg ${
                rules.emergencyStop
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'
              }`}
            >
              {rules.emergencyStop ? (
                <>
                  <Play className="w-4 h-4" />
                  Resume Automations
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  Emergency Stop
                </>
              )}
            </button>

            <button
              onClick={() => handleSendCommand('Create today\'s marketing content with fresh mithai images')}
              disabled={isProcessing || rules.emergencyStop}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-yellow-600 text-black hover:opacity-95 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generate Daily Post
            </button>
          </div>
        </div>

        {/* Real-time Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800">
          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
            <div className="text-xs text-slate-400">Content Studio</div>
            <div className="text-xl font-bold text-amber-400 mt-1">{contentList.length} Posts</div>
            <div className="text-[11px] text-slate-500">Flux HD Visuals</div>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
            <div className="text-xs text-slate-400">Scheduled Queue</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {contentList.filter(c => c.status === 'approved' || c.status === 'scheduled').length} Ready
            </div>
            <div className="text-[11px] text-slate-500">FB, IG & WhatsApp</div>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
            <div className="text-xs text-slate-400">Monthly AI Cost</div>
            <div className="text-xl font-bold text-blue-400 mt-1">Rs. 0.00</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 100% Free Tier
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
            <div className="text-xs text-slate-400">Store Integration</div>
            <div className="text-xl font-bold text-purple-400 mt-1">100% Live</div>
            <div className="text-[11px] text-slate-500">Supabase Cloud Sync</div>
          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'command_center', label: 'AI Command Center', icon: Bot },
          { id: 'content_studio', label: `Content Studio (${contentList.length})`, icon: ImageIcon },
          { id: 'daily_routine', label: 'Autonomous Schedule', icon: Calendar },
          { id: 'social_channels', label: 'Connected Channels', icon: Share2 },
          { id: 'engine_settings', label: 'AI Engine & Upgrade', icon: Sliders }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: AI COMMAND CENTER (INTERACTIVE CHAT) */}
      {activeTab === 'command_center' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Stream */}
          <div className="lg:col-span-2 bg-[#0C121E] border border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-2xl">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-black font-black text-sm shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    Sawera AI Autonomous Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Gojra Road DHQ Jhang Store Knowledge Loaded
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setMessages([messages[0]])}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                title="Clear chat history"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Clear
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 space-y-2 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-black font-medium shadow-md'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-800 shadow-xl'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    {/* Rich Post Card preview inside chat */}
                    {msg.post && (
                      <div className="mt-3 p-3 bg-black/40 border border-amber-500/20 rounded-xl space-y-2">
                        <img
                          src={msg.post.mediaUrl}
                          alt="Generated Post"
                          className="w-full h-48 object-cover rounded-lg border border-slate-800"
                          loading="lazy"
                        />
                        <div className="text-xs font-bold text-amber-300">{msg.post.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-3">{msg.post.captionUrdu}</div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-500">
                          <span>Status: Approved</span>
                          <span className="text-emerald-400 font-semibold">{msg.post.estimatedCost}</span>
                        </div>
                      </div>
                    )}

                    <div className={`text-[10px] ${msg.sender === 'user' ? 'text-black/60 text-right' : 'text-slate-500'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isProcessing && (
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800 w-fit animate-pulse">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  SAWERA AI is processing instructions and generating visual assets...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Action Pills */}
            <div className="p-3 border-t border-slate-800/60 bg-slate-900/20 flex gap-2 overflow-x-auto">
              {quickActions.map((qa, i) => (
                <button
                  key={i}
                  disabled={isProcessing || rules.emergencyStop}
                  onClick={() => handleSendCommand(qa.cmd)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-500/20 hover:border-amber-500/40 border border-slate-700/60 text-xs text-slate-300 hover:text-amber-300 whitespace-nowrap transition-all disabled:opacity-40"
                >
                  {qa.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/60">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendCommand();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputCommand}
                  onChange={e => setInputCommand(e.target.value)}
                  disabled={isProcessing || rules.emergencyStop}
                  placeholder={
                    rules.emergencyStop
                      ? 'Automations paused. Type "resume" to reactivate...'
                      : 'Type instruction (e.g. "Create today\'s marketing post", "Show sales", "Plan tomorrow")...'
                  }
                  className="flex-1 bg-black/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputCommand.trim() || isProcessing || rules.emergencyStop}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-sm hover:opacity-95 transition-all disabled:opacity-30 flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Rail: Business Memory & Guidelines */}
          <div className="space-y-6">
            <div className="bg-[#0C121E] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Autonomous Business Rules
              </h3>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Fixed Delivery Fee:</span> Rs. 180 standard shipping nationwide.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Free Delivery Threshold:</span> Free shipping automatically on orders $\ge$ Rs. 3,000.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Zero Fake Claims:</span> AI is strictly prohibited from inventing discounts, false ingredients or fake delivery timelines.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">POS Locked:</span> Physical store POS & Turso cloud remain 100% untouched and independent.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Live Preview */}
            <div className="bg-[#0C121E] border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                Next Scheduled Autonomous Action
              </h3>
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-500/20 space-y-1">
                <div className="text-xs font-bold text-white">12:00 PM — Social Media Dispatch</div>
                <div className="text-[11px] text-slate-400">
                  Target: Facebook Page & Instagram Feed
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold pt-1">
                  Status: Queue Active (Ready)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: CONTENT STUDIO (GENERATED IMAGES & COPY) */}
      {activeTab === 'content_studio' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                AI Content Studio & Campaign Gallery
              </h2>
              <p className="text-xs text-slate-400">
                Photorealistic AI images generated via Pollinations Flux.1 (100% Free) with royal Urdu/English captions.
              </p>
            </div>

            <button
              onClick={() => handleSendCommand('Create today\'s marketing content with fresh mithai images')}
              disabled={isProcessing || rules.emergencyStop}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-xs hover:opacity-95 transition-all disabled:opacity-40 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              Generate Fresh Campaign
            </button>
          </div>

          {contentList.length === 0 ? (
            <div className="p-12 text-center bg-[#0C121E] border border-slate-800 rounded-2xl space-y-3">
              <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-300">No campaigns generated yet</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click "Generate Fresh Campaign" to create your first autonomous social media post with free HD visuals.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentList.map(post => (
                <div
                  key={post.id}
                  className="bg-[#0C121E] border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3 p-4">
                    <div className="relative group rounded-xl overflow-hidden border border-slate-800">
                      <img
                        src={post.mediaUrl}
                        alt={post.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/70 text-amber-400 backdrop-blur-md border border-amber-500/20">
                        Flux HD (Free)
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs font-bold text-amber-300 line-clamp-1">{post.title}</div>
                      <div className="text-[11px] text-slate-300 line-clamp-4 whitespace-pre-wrap font-urdu leading-relaxed">
                        {post.captionUrdu}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {post.hashtags?.slice(0, 4).map((tag, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </span>
                    <a
                      href={post.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 flex items-center gap-1 font-medium transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Save Image
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: AUTONOMOUS ROUTINE TIMELINE */}
      {activeTab === 'daily_routine' && (
        <div className="bg-[#0C121E] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Autonomous Daily Routine (Pakistan Standard Time - Asia/Karachi)
            </h2>
            <p className="text-xs text-slate-400">
              The AI Agent executes these tasks continuously even when your computer or browser is closed.
            </p>
          </div>

          <div className="space-y-3">
            {rules.schedules.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 text-center font-mono text-sm font-bold text-amber-400 bg-black/40 py-1.5 px-2 rounded-lg border border-slate-800">
                    {item.time}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{item.task}</div>
                    <div className="text-[11px] text-slate-500">Autonomous Background Execution</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'}`}>
                    {item.enabled ? 'Active Routine' : 'Paused'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TAB 4: CONNECTED SOCIAL CHANNELS */}
      {activeTab === 'social_channels' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-amber-400" />
              Connected Social Media Channels
            </h2>
            <p className="text-xs text-slate-400">
              Platform connections configured for automatic scheduled publishing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEFAULT_SOCIAL_ACCOUNTS.map((acc, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#0C121E] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{acc.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {acc.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-amber-400 font-mono">{acc.handle}</div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-800">
                  <span>Audience Reach</span>
                  <span className="text-slate-300 font-semibold">{acc.followers}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB 5: AI ENGINE & FUTURE UPGRADE TOGGLE */}
      {activeTab === 'engine_settings' && (
        <div className="bg-[#0C121E] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              AI Engine & Cost Controls
            </h2>
            <p className="text-xs text-slate-400">
              Your system is currently running on **100% Free Mode ($0 / Rs. 0)**. You can optionally connect an OpenAI API key in the future if you ever want Hollywood-grade video generation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Current Active Engine: FREE TIER (Rs. 0 / Month)
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Pollinations.ai Flux.1 (HD Images) + Smart Heuristic Confectionery NLP Engine. No monthly subscription or credit card required.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-300">
              Optional: OpenAI API Key (For Future Upgrade)
            </label>
            <input
              type="password"
              value={openAiKey}
              onChange={e => setOpenAiKey(e.target.value)}
              placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxx (Khali rehne dein for 100% Free Mode)"
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
            />
            <p className="text-[11px] text-slate-500">
              Jab tak aap yahan koi key nahi daalte, system 100% free mode par chalega. Key daalne par GPT-4o / DALL-E 3 activate ho jayega.
            </p>

            <button
              onClick={handleSaveApiKey}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold text-xs hover:opacity-95 transition-all shadow-md"
            >
              Save Configuration
            </button>

            {keySavedToast && (
              <span className="text-xs text-emerald-400 ml-3 font-semibold animate-pulse">
                Configuration updated successfully!
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
