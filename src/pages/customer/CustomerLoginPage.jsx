import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CustomerLoginPage() {
  const { login, register, verifyOtp, user } = useAuth();
  const { isUrdu } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || '/';

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState(null);
  const [tempUser, setTempUser] = useState(null);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      if (user.role === 'owner_admin' || user.role === 'staff') {
        navigate('/admin');
      } else if (user.role === 'rider') {
        navigate('/rider');
      } else {
        navigate(redirectPath);
      }
    }
  }, [user, navigate, redirectPath]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const result = login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if (!name || !email || !password || !phone) {
      setError('Please fill in all required registration fields.');
      return;
    }
    // Advance to OTP simulation
    setTempUser({ name, email, phone, password });
    setMode('otp');
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    const res = verifyOtp(otpCode);
    if (res.success && tempUser) {
      const regRes = register(tempUser);
      if (!regRes.success) {
        setError(regRes.message);
      }
    } else {
      setError('Invalid OTP code. Please enter 4 digits (e.g. 1234).');
    }
  };

  return (
    <div className="min-h-[80vh] py-12 px-4 flex items-center justify-center bg-[#FDFBF7]">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header Banner */}
        <div className="bg-[#07643D] text-white p-6 text-center relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37] mx-auto shadow-md mb-2">
            <img 
              src="/images/logo/logo.jpg" 
              alt="Sawera" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/src/assets/logo.jpg";
              }}
            />
          </div>
          <h2 className="text-xl font-bold font-serif">Sawera Sweets &amp; Bakers</h2>
          <p className="text-xs text-[#F4D375] font-semibold urdu-text">سویرا سویٹس اینڈ بیکرز - ہر خوشی کیساتھ</p>
        </div>

        {/* Tabs for Login / Register */}
        {mode !== 'otp' && (
          <div className="flex border-b text-xs font-bold">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                mode === 'login'
                  ? 'border-[#07643D] text-[#07643D] bg-emerald-50/40'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {isUrdu ? 'لاگ ان' : 'Sign In'}
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                mode === 'register'
                  ? 'border-[#07643D] text-[#07643D] bg-emerald-50/40'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {isUrdu ? 'نیا اکاؤنٹ بنائیں' : 'Create Account'}
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. customer@sawerasweets.pk"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#07643D] focus:ring-1 focus:ring-[#07643D] outline-none text-xs"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 focus:border-[#07643D] focus:ring-1 focus:ring-[#07643D] outline-none text-xs"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#07643D] text-white font-bold hover:bg-[#043E26] shadow-md transition-all text-xs flex items-center justify-center gap-2"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Muhammad Usman"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:border-[#07643D] outline-none text-xs"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usman@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:border-[#07643D] outline-none text-xs"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Mobile / WhatsApp Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0312 9876543"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:border-[#07643D] outline-none text-xs font-mono"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 focus:border-[#07643D] outline-none text-xs"
                  />
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#07643D] text-white font-bold hover:bg-[#043E26] shadow-md transition-all text-xs flex items-center justify-center gap-2 mt-2"
              >
                <span>Proceed to Phone Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {mode === 'otp' && (
            <form onSubmit={handleOtpVerify} className="space-y-4 text-xs text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#07643D] mx-auto flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-[#07643D]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Verify Your Phone Number</h3>
                <p className="text-gray-500 mt-1">
                  We sent a 4-digit code to <span className="font-mono font-bold text-gray-800">{tempUser?.phone}</span>
                </p>
                <p className="text-[10px] text-amber-700 font-semibold mt-0.5">
                  (Demo: enter any 4 digits, e.g. 1234)
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="1 2 3 4"
                  className="w-40 mx-auto text-center tracking-widest text-lg font-mono py-2 rounded-xl border border-gray-300 focus:border-[#07643D] outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#07643D] text-white font-bold hover:bg-[#043E26]"
                >
                  Confirm &amp; Register
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
