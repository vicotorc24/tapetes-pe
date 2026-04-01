"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LucideUser, LucideLoader, LucideEye, LucideEyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, resetPassword } = useAuth();
  const router = useRouter();
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoggingIn(true);

    const result = await login(email, password);

    if (result.success) {
      router.push('/admin');
    } else {
      setError('Credenciales incorrectas. Intenta de nuevo.');
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico primero.');
      return;
    }
    setError('');
    setSuccess('');
    const result = await resetPassword(email);
    if (result.success) {
      setSuccess('Se ha enviado un correo para restablecer tu contraseña. Revisa tu reserva.');
    } else {
      setError('No pudimos enviar el correo. Verifica que la dirección sea correcta.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-in fade-in bg-stone-50">
      <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl border border-stone-100 relative overflow-hidden">
        {/* Decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-stone-100 text-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3 shadow-sm border border-stone-200/50">
            <LucideUser size={32} />
          </div>
          <h2 className="text-3xl font-serif font-black text-stone-900 tracking-tighter">Acceso Tapetes<span className="text-terracotta-600">.</span>pe</h2>
          <p className="text-stone-400 text-[11px] uppercase tracking-[0.3em] font-bold mt-2">Portal de Administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1 mb-2 block">Correo Electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-terracotta-200 transition-all font-medium text-stone-900"
              placeholder="admin@tapetes.pe"
            />
          </div>
          <div className="relative">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1 mb-2 block">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-terracotta-200 transition-all font-medium text-stone-900 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 transition-colors"
              >
                {showPassword ? <LucideEyeOff size={20} /> : <LucideEye size={20} />}
              </button>
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[10px] font-bold text-terracotta-600 hover:underline tracking-widest uppercase"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-[11px] text-center font-bold bg-red-50 py-3 rounded-xl border border-red-100">{error}</p>}
          {success && <p className="text-green-600 text-[11px] text-center font-bold bg-green-50 py-3 rounded-xl border border-green-100">{success}</p>}

          <button
            disabled={isLoggingIn}
            className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-terracotta-600 transition-all flex justify-center items-center gap-3 shadow-xl transform active:scale-95 disabled:opacity-50"
          >
            {isLoggingIn ? <><LucideLoader className="animate-spin" size={20} /> Ingresando...</> : 'Entrar al Panel'}
          </button>

          <div className="text-center text-xs text-stone-400 mt-8 border-t border-stone-100 pt-6">
            <p className="mb-4 uppercase tracking-[0.2em] font-bold text-[9px] text-stone-400">Cuentas de Acceso Rápido</p>
            <div className="flex justify-center gap-6">
              <button
                type="button"
                onClick={() => { setEmail('admin@tapetes.pe'); setPassword('TapetesAdmin2026'); }}
                className="text-stone-900 font-bold hover:text-terracotta-600 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => { setEmail('victoria.plasencia@tapetes.pe'); setPassword('123456'); }}
                className="text-stone-900 font-bold hover:text-terracotta-600 transition-colors"
              >
                Artesana
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
