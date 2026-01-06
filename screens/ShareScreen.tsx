import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ShareScreen: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased overflow-hidden h-screen flex">
            <main className="flex-1 flex flex-col h-full relative overflow-hidden">
                <header className="h-16 border-b border-surface-dark-highlight bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-text-secondary text-sm">
                            <Link to="/dashboard" className="hover:text-white">Dashboards</Link>
                            <span className="material-symbols-outlined text-base">chevron_right</span>
                            <span className="text-white font-medium">Compartir</span>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-surface-dark-highlight hover:bg-[#323c47] text-white text-sm font-medium transition-colors">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                            <span>Ver Dashboard</span>
                        </button>
                    </div>
                </header>
                 <div className="flex-1 overflow-y-auto bg-background-dark relative p-8">
                     <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Compartir Dashboard</h1>
                            <p className="text-text-secondary">Configura los permisos de seguridad y genera un enlace.</p>
                        </div>
                        <div className="bg-surface-dark border border-surface-dark-highlight rounded-xl p-6 shadow-xl mb-6">
                             <div className="flex gap-2">
                                <div className="relative flex-1 group">
                                    <input className="w-full bg-background-dark border border-surface-dark-highlight rounded-lg px-4 py-2.5 text-sm text-text-secondary font-mono" readOnly type="text" value="https://app.databoard.ai/s/v2/x8s9d-sales-q3"/>
                                </div>
                                <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">content_copy</span> Copiar
                                </button>
                            </div>
                        </div>
                        <div className="bg-surface-dark border border-surface-dark-highlight rounded-xl p-6 shadow-xl flex flex-col gap-4">
                             <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-dark-highlight/30">
                                <div className="flex items-center gap-4">
                                    <div className="text-primary bg-primary/10 p-2 rounded-lg"><span className="material-symbols-outlined">lock</span></div>
                                    <div><p className="text-white text-sm font-medium">Proteger con contraseña</p></div>
                                </div>
                                 <input defaultChecked type="checkbox" className="accent-primary w-5 h-5"/>
                            </div>
                        </div>
                     </div>
                 </div>
            </main>
        </div>
    );
};

export default ShareScreen;