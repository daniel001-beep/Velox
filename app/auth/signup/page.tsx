'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setIsLoading(false);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-blue-500/30 rounded-3xl p-12 text-center space-y-6 max-w-md w-full shadow-[0_0_50px_rgba(37,99,235,0.2)]">
          <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-blue-500 animate-bounce" />
          </div>
          <h2 className="text-3xl font-black text-white italic">WELCOME TO VELOX</h2>
          <p className="text-slate-400 font-medium leading-relaxed">
            Your executive account has been provisioned. <br />
            Redirecting to secure login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col md:flex-row items-center justify-center p-6 md:p-24 selection:bg-blue-500/30">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* Left Section: Branding */}
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-3xl font-black text-white italic">V</span>
            </div>
            <h1 className="text-5xl font-black text-white/20 tracking-tighter italic">VELOX</h1>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-100 leading-[1.1] mb-6">
            Join the Next Era of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Institutional Treasury.</span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-lg leading-relaxed mb-10">
            Create an account in seconds and gain access to the world's most resilient financial infrastructure.
          </p>

          <div className="hidden md:flex flex-col gap-4 text-sm text-slate-500 font-black uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Self-Sovereign Identity</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Zero-Trust Architecture</span>
            </div>
          </div>
        </div>

        {/* Right Section: Sign Up Card */}
        <div className="w-full max-w-md mx-auto md:ml-auto">
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] text-center">
            <div className="mb-10">
              <h3 className="text-3xl font-bold text-white mb-2">Create Account</h3>
              <p className="text-slate-400 font-medium">Provision your founder credentials</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-bold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Full Name</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-4 px-4 text-center text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium text-lg"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Corporate Email</label>
                <div className="relative group">
                  <input 
                    type="email" 
                    required
                    placeholder="founder@velox.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-4 px-4 text-center text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium text-lg"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block">Security Token (Password)</label>
                <div className="relative group">
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 rounded-2xl py-4 px-4 text-center text-slate-100 placeholder-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all font-medium text-lg"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading || !email || !password}
                  className="w-full h-16 flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg uppercase tracking-wider rounded-2xl shadow-lg shadow-blue-600/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Create Executive Account <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-sm text-slate-500 font-medium">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-blue-500 hover:text-blue-400 font-bold transition-colors">
                  Login here
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-slate-700 text-[10px] uppercase tracking-[0.3em] mt-10 font-black">
            Hardened by Velox Sentinel v2.4
          </p>
        </div>
      </div>
    </div>
  );
}
