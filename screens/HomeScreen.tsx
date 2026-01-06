import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';

const HomeScreen: React.FC = () => {
    const navigate = useNavigate();

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            navigate('/processing', { state: { file } });
        }
    };

    const handleDropZoneClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark">
            <TopNav />
            <div className="flex-1 overflow-y-auto">
                <div className="layout-container flex h-full grow flex-col items-center">
                    <div className="layout-content-container flex flex-col max-w-[960px] w-full flex-1 px-6 py-8 md:px-10 md:py-12">
                        <div className="flex flex-col gap-6 mb-10 text-center items-center">
                            <div className="flex flex-col gap-3 max-w-2xl">
                                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em] bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400">
                                    Analiza tus datos con IA
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg font-normal leading-relaxed">
                                    Transforma tus hojas de cálculo en dashboards interactivos en segundos.
                                    Simplemente arrastra tu archivo y comienza.
                                </p>
                            </div>
                        </div>
                        <div className="w-full mb-12">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileSelect}
                            />
                            <div
                                onClick={handleDropZoneClick}
                                className="group relative flex flex-col items-center justify-center gap-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-surface-light dark:bg-surface-dark px-6 py-16 transition-all hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-primary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                <div className="z-10 flex size-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-primary text-5xl">cloud_upload</span>
                                </div>
                                <div className="z-10 flex max-w-[480px] flex-col items-center gap-2 text-center">
                                    <p className="text-xl font-bold leading-tight text-slate-900 dark:text-white">Arrastra y suelta tu archivo aquí</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Soporta archivos .xlsx y .csv hasta 50MB</p>
                                </div>
                                <div className="z-10 flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-blue-600 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined mr-2 text-lg">folder_open</span>
                                    <span className="truncate">Explorar archivos</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex items-center justify-between pb-2">
                                <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-900 dark:text-white">Archivos Recientes</h3>
                                <a className="text-sm font-medium text-primary hover:text-blue-400 transition-colors" href="#">Ver todos</a>
                            </div>
                            <div className="grid gap-3">
                                <div
                                    onClick={() => navigate('/dashboard')}
                                    className="group flex items-center gap-4 rounded-xl bg-surface-light dark:bg-surface-dark p-4 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-md cursor-pointer"
                                >
                                    <div className="flex items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20 shrink-0 size-12 text-green-600 dark:text-green-400">
                                        <span className="material-symbols-outlined">table_view</span>
                                    </div>
                                    <div className="flex flex-col justify-center grow">
                                        <p className="text-base font-medium leading-normal line-clamp-1 group-hover:text-primary transition-colors text-slate-900 dark:text-white">Ventas_Q3_2023.xlsx</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">Procesado</span>
                                            <span className="text-slate-400 dark:text-slate-500 text-xs">• hace 2 horas</span>
                                        </div>
                                    </div>
                                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                                        <span className="material-symbols-outlined text-slate-400">arrow_forward_ios</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;