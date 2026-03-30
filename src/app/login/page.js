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
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-orange-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <LucideUser size={24} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Acceso Tapetes.pe</h2>
          <p className="text-stone-500 text-sm mt-1">Solo personal autorizado</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase">Correo</label>
            <input 
              type="email" 
              required
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="admin@tapetes.pe"
            />
          </div>
          <div className="relative">
            <label className="text-xs font-bold text-stone-500 uppercase">Contraseña</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={e => setPassword(e.target.value)} 
                className="w-full p-3 pr-10 border rounded-lg outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-orange-700 transition-colors"
              >
                {showPassword ? <LucideEyeOff size={18} /> : <LucideEye size={18} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-[10px] font-bold text-andeansky-700 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-xs text-center font-medium bg-red-50 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-green-600 text-xs text-center font-medium bg-green-50 py-2 rounded-lg">{success}</p>}

          <button 
            disabled={isLoggingIn}
            className="w-full bg-orange-700 text-white py-3 rounded-lg font-bold hover:bg-orange-800 transition flex justify-center items-center gap-2"
          >
            {isLoggingIn ? <><LucideLoader className="animate-spin" size={18}/> Ingresando...</> : 'Ingresar'}
          </button>

          <div className="text-center text-xs text-stone-400 mt-6 border-t pt-4">
            <p className="mb-3 uppercase tracking-widest font-bold text-[10px]">Cuentas de Acceso Rápido</p>
            <div className="flex justify-center gap-4">
              <button 
                type="button" 
                onClick={() => { setEmail('admin@tapetes.pe'); setPassword('123456'); }} 
                className="text-andeansky-700 font-bold hover:underline"
              >
                Super Admin
              </button>
              <button 
                type="button" 
                onClick={() => { setEmail('victoria@tapetes.pe'); setPassword('123456'); }} 
                className="text-andeansky-700 font-bold hover:underline"
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
