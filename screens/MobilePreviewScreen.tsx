import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MobilePreviewScreen: React.FC = () => {
     const navigate = useNavigate();
     return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white antialiased overflow-hidden h-screen flex flex-col">
            <header className="h-16 border-b border-surface-dark-highlight bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10 sticky top-0">
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                     <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
                     <span className="material-symbols-outlined text-base">chevron_right</span>
                     <span className="text-white font-medium">Vista Móvil</span>
                </div>
                <button onClick={() => navigate('/share')} className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-medium transition-colors shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-[18px]">share</span>
                    <span>Compartir</span>
                </button>
            </header>
            <div className="flex-1 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed relative flex flex-col items-center justify-center py-8">
                <div className="relative w-[375px] h-[812px] bg-black rounded-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] border-[8px] border-[#2a3036] overflow-hidden shrink-0 ring-1 ring-white/10 z-10">
                    <div className="absolute top-0 inset-x-0 h-7 bg-[#2a3036] rounded-b-2xl z-20 w-32 mx-auto"></div>
                    <div className="w-full h-full bg-[#0f172a] overflow-y-auto hide-scrollbar relative flex flex-col text-slate-200 font-display p-4 pt-12">
                        <h1 className="text-white text-xl font-bold mb-4">Ventas Q3</h1>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5">
                                <p className="text-slate-400 text-[10px] uppercase">Ingresos</p>
                                <span className="text-2xl font-bold text-white">$42.5k</span>
                            </div>
                             <div className="bg-[#1e293b] p-4 rounded-2xl border border-white/5">
                                <p className="text-slate-400 text-[10px] uppercase">Pedidos</p>
                                <span className="text-2xl font-bold text-white">1,204</span>
                            </div>
                        </div>
                        <div className="bg-[#1e293b] rounded-2xl border border-white/5 p-5 mb-4 h-40 flex items-center justify-center">
                            <span className="text-xs text-slate-500">Gráfico Móvil</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
};

export default MobilePreviewScreen;