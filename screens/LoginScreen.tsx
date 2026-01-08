import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { getBackendUrl } from '../services/apiConfig';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const backendUrl = getBackendUrl();
            const response = await fetch(`${backendUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token, data.user);
                navigate('/');
            } else {
                const data = await response.json();
                setError(data.error || 'Credenciales inválidas');
            }
        } catch (err) {
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0e14] p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-6 shadow-xl shadow-primary/5">
                        <span className="material-symbols-outlined text-[32px]">analytics</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Bienvenido de nuevo</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Inicia sesión para acceder a tus dashboards</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-[#111418] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-[#1a2027] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Contraseña</label>
                            <input
                                type="password"
                                required
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-[#1a2027] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-primary text-white rounded-2xl font-black text-lg mt-10 hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin">sync</span>
                        ) : (
                            <span>Entrar</span>
                        )}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-500 dark:text-slate-400 font-medium">
                    ¿No tienes cuenta?{' '}
                    <Link to="/signup" className="text-primary font-black hover:underline underline-offset-4 Decoration-2">
                        Regístrate gratis
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
