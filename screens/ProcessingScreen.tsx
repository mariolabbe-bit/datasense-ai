import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { parseFile, DataResult } from '../services/dataService';

const ProcessingScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const file = location.state?.file as File;
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Iniciando...');

    useEffect(() => {
        if (!file) {
            navigate('/');
            return;
        }

        const handleProcessing = async () => {
            try {
                setStatus('Leyendo archivo...');
                setProgress(20);

                const result = await parseFile(file);

                setProgress(60);
                setStatus('Analizando estructura...');

                // Fetch chart recommendations from backend
                const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                let recommendations = [];
                try {
                    const analysisResponse = await fetch(`${backendUrl}/api/analyze-structure`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            columns: result.columns,
                            sampleData: result.rows.slice(0, 3)
                        })
                    });

                    if (analysisResponse.ok) {
                        recommendations = await analysisResponse.json();
                    }
                } catch (err) {
                    console.error("AI Analysis failed, using empty recommendations:", err);
                }

                setProgress(90);
                setStatus('Preparando dashboard...');

                await new Promise(resolve => setTimeout(resolve, 800));

                setProgress(100);
                navigate('/dashboard', { state: { data: result, recommendations } });
            } catch (error) {
                console.error("Processing error:", error);
                navigate('/', { state: { error: 'Error al procesar el archivo' } });
            }
        };

        handleProcessing();
    }, [file, navigate]);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col overflow-hidden">
            <TopNav title="DataSense AI" />
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="w-full max-w-[600px] flex flex-col items-center z-10 animate-fade-in">
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-subtle-pulse"></div>
                        <div className="relative bg-background-light dark:bg-slate-800 p-6 rounded-full border border-slate-200 dark:border-slate-700 shadow-xl">
                            <span className="material-symbols-outlined text-6xl text-primary animate-spin-slow">auto_mode</span>
                        </div>
                        <div className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-background-light dark:border-background-dark shadow-sm">AI</div>
                    </div>
                    <h1 className="text-slate-900 dark:text-white text-[32px] font-bold leading-tight text-center mb-2">{status}</h1>
                    <p className="text-slate-500 dark:text-[#9dabb9] text-base text-center mb-10 max-w-md">La IA está infiriendo el esquema y limpiando los valores nulos automáticamente.</p>
                    <div className="w-full bg-white dark:bg-[#1e252d] rounded-xl p-6 border border-slate-200 dark:border-[#283039] shadow-sm mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-lg animate-spin">sync</span>
                                <span className="text-slate-700 dark:text-white text-sm font-medium">{status === 'Preparando dashboard...' ? 'Finalizando' : 'Procesando'}</span>
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 text-sm font-mono">{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-[#3b4754] rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full shimmer-bar transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between mt-3 text-xs text-slate-400 dark:text-[#9dabb9]">
                            <span>Tiempo estimado: &lt; 5s</span>
                            <span>{progress < 100 ? 'Trabajando...' : 'Completado'}</span>
                        </div>
                    </div>
                    <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors px-6 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Cancelar proceso</button>
                </div>
            </main>
        </div>
    );
};

export default ProcessingScreen;