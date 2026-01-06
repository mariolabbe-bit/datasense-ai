import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReviewScreen: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display min-h-screen flex flex-col overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <div className="flex flex-1 justify-center py-5 px-4 md:px-8 lg:px-40">
                     <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full gap-8">
                        <div className="flex flex-wrap items-end justify-between gap-4 p-4 border-b border-slate-200 dark:border-border-dark pb-6">
                            <div className="flex min-w-72 flex-col gap-3">
                                <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Revisión de Datos</h1>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => navigate('/')} className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent border border-slate-200 dark:border-border-dark text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors">Cancelar</button>
                                <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                                    <span className="material-symbols-outlined mr-2 text-[20px]">rocket_launch</span>
                                    <span className="truncate">Confirmar y Generar</span>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                             <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-500">
                                        <span className="material-symbols-outlined">table_rows</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium">Total de Filas</p>
                                </div>
                                <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight pl-[52px]">12,450</p>
                            </div>
                            <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500">
                                        <span className="material-symbols-outlined">health_and_safety</span>
                                    </div>
                                    <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium">Calidad de Datos</p>
                                </div>
                                <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight pl-[52px]">98%</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                 <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight">Columnas Detectadas</h3>
                                 <div className="rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-[#151c24] border-b border-slate-200 dark:border-border-dark">
                                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-[#9dabb9] uppercase tracking-wider w-1/4">Nombre Columna</th>
                                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-[#9dabb9] uppercase tracking-wider w-1/4">Muestra</th>
                                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-[#9dabb9] uppercase tracking-wider w-1/4">Tipo Detectado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-border-dark">
                                                <tr className="hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors group">
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">fecha_pedido</td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-[#9dabb9] font-mono">2023-10-25</td>
                                                    <td className="px-6 py-4"><span className="flex items-center gap-2 text-xs font-medium text-emerald-500"><span className="material-symbols-outlined text-[16px]">calendar_today</span> Fecha (100%)</span></td>
                                                </tr>
                                                 <tr className="hover:bg-slate-50 dark:hover:bg-background-dark/50 transition-colors group">
                                                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">total_venta</td>
                                                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-[#9dabb9] font-mono">$1,250.00</td>
                                                    <td className="px-6 py-4"><span className="flex items-center gap-2 text-xs font-medium text-emerald-500"><span className="material-symbols-outlined text-[16px]">attach_money</span> Moneda (100%)</span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                 </div>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10 p-5 shadow-sm">
                                    <h4 className="text-blue-900 dark:text-blue-100 font-bold mb-2 flex items-center gap-2">
                                        <span className="material-symbols-outlined">psychology</span> Análisis de la IA
                                    </h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200/80"><span className="material-symbols-outlined text-[16px] mt-0.5">check</span> 3 columnas de moneda detectadas.</li>
                                        <li className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200/80"><span className="material-symbols-outlined text-[16px] mt-0.5">check</span> Fechas estandarizadas a ISO 8601.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewScreen;