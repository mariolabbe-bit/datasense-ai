import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_USER } from '../types';

const RelationshipsScreen: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-screen flex flex-col overflow-hidden">
           <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#283039] bg-surface-light dark:bg-[#111418] px-6 py-3 shrink-0 z-20 relative">
                <div className="flex items-center gap-4 text-slate-900 dark:text-white">
                    <Link to="/" className="size-8 text-primary flex items-center justify-center no-underline">
                        <span className="material-symbols-outlined text-3xl">insights</span>
                    </Link>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">DataSense AI</h2>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                        <div className="size-6 rounded-full border border-current flex items-center justify-center text-xs font-medium">1</div>
                        <span className="text-sm font-medium">Carga</span>
                    </div>
                    <div className="w-8 h-[1px] bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-2 text-primary">
                        <div className="size-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium">2</div>
                        <span className="text-sm font-medium">Relaciones</span>
                    </div>
                    <div className="w-8 h-[1px] bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                        <div className="size-6 rounded-full border border-current flex items-center justify-center text-xs font-medium">3</div>
                        <span className="text-sm font-medium">Dashboard</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-slate-200 dark:border-slate-700" style={{backgroundImage: `url("${MOCK_USER.avatarUrl}")`}}></div>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden relative">
                <aside className="w-80 bg-surface-light dark:bg-[#111418] border-r border-slate-200 dark:border-[#283039] flex flex-col z-10 shadow-lg shrink-0">
                     <div className="p-5 border-b border-slate-200 dark:border-[#283039]">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Archivos de Origen</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">2 archivos cargados exitosamente</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                        <div className="group flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#1c252e] border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer">
                            <div className="size-10 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">table_view</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Ventas_2024.xlsx</p>
                                    <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">15.4 MB • 45k filas</p>
                            </div>
                        </div>
                        <div className="group flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#1c252e] border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer">
                            <div className="size-10 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">contacts</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">Clientes_Master.csv</p>
                                    <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">2.1 MB • 3.2k filas</p>
                            </div>
                        </div>
                    </div>
                </aside>
                <main className="flex-1 relative bg-background-light dark:bg-background-dark overflow-hidden flex flex-col">
                     <div className="absolute inset-0 bg-dot-pattern opacity-50"></div>
                     <div className="relative w-full h-full flex items-center justify-center overflow-auto p-20">
                        <div className="relative w-[800px] h-[500px]">
                             <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                                <defs>
                                    <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                                        <stop offset="0%" style={{stopColor: '#94a3b8', stopOpacity: 1}}></stop>
                                        <stop offset="50%" style={{stopColor: '#137fec', stopOpacity: 1}}></stop>
                                        <stop offset="100%" style={{stopColor: '#137fec', stopOpacity: 1}}></stop>
                                    </linearGradient>
                                </defs>
                                <path className="animate-pulse" d="M 320 150 C 400 150, 400 150, 480 150" fill="none" stroke="url(#lineGradient)" strokeDasharray="8,4" strokeWidth="3"></path>
                                <circle className="drop-shadow-[0_0_8px_rgba(19,127,236,0.6)]" cx="400" cy="150" fill="#137fec" r="6"></circle>
                            </svg>
                            {/* Left Card */}
                            <div className="absolute left-0 top-20 w-80 bg-surface-light dark:bg-[#1c252e] rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col z-10 overflow-hidden ring-2 ring-transparent hover:ring-primary/50 transition-all">
                                <div className="bg-slate-50 dark:bg-[#283039] p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-500">table_view</span>
                                        <span className="font-bold text-slate-900 dark:text-white">Ventas_2024</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Fact Table</span>
                                </div>
                                <div className="p-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
                                     <div className="flex items-center justify-between px-2 py-1.5 rounded bg-blue-50 dark:bg-primary/20 text-sm text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-primary/30 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">key</span>
                                            <span>ID_Cliente</span>
                                        </div>
                                        <span className="text-[10px] opacity-70">FK</span>
                                    </div>
                                </div>
                            </div>
                            {/* Right Card */}
                            <div className="absolute right-0 top-20 w-80 bg-surface-light dark:bg-[#1c252e] rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col z-10 overflow-hidden ring-2 ring-transparent hover:ring-primary/50 transition-all">
                                <div className="bg-slate-50 dark:bg-[#283039] p-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-500">contacts</span>
                                        <span className="font-bold text-slate-900 dark:text-white">Clientes_Master</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dimension</span>
                                </div>
                                 <div className="p-2 flex flex-col gap-1 max-h-60 overflow-y-auto">
                                    <div className="flex items-center justify-between px-2 py-1.5 rounded bg-blue-50 dark:bg-primary/20 text-sm text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-primary/30 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                                            <span>ID_Cliente</span>
                                        </div>
                                        <span className="text-[10px] opacity-70">PK</span>
                                    </div>
                                </div>
                            </div>
                            {/* Match Dialog */}
                            <div className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 w-[340px] bg-surface-light dark:bg-[#1c252e] rounded-xl shadow-2xl border border-primary/40 z-20 overflow-hidden animate-in fade-in zoom-in duration-300">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                                        <span className="text-sm font-bold">Relación Detectada</span>
                                    </div>
                                    <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold text-white">98% Match</span>
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                                        Hemos detectado un vínculo fuerte entre <span className="font-bold text-slate-900 dark:text-white">Ventas</span> y <span className="font-bold text-slate-900 dark:text-white">Clientes</span> a través de la columna <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-primary">ID_Cliente</code>.
                                    </p>
                                    <div className="flex gap-2">
                                        <button onClick={() => navigate('/review')} className="flex-1 bg-primary hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">check</span>
                                            Confirmar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                </main>
            </div>
        </div>
    );
};

export default RelationshipsScreen;