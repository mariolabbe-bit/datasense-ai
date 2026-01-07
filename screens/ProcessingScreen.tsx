import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { parseFile, DataResult, cleanMissingValues, removeConstantColumns } from '../services/dataService';
import { useAuth } from '../services/AuthContext';

const ProcessingScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuth();
    const file = location.state?.file as File;

    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Iniciando...');
    const [processedData, setProcessedData] = useState<DataResult | null>(null);
    const [showHealthReport, setShowHealthReport] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);

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
                setProcessedData(result);

                setProgress(60);
                setStatus('Analizando estructura...');

                // Fetch chart recommendations from backend
                const PRODUCTION_BACKEND_URL = 'https://datasense-ai-l07q.onrender.com';
                const backendUrl = import.meta.env['VITE_API_URL'] || PRODUCTION_BACKEND_URL;

                try {
                    const analysisResponse = await fetch(`${backendUrl}/api/analyze-structure`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            columns: result.columns,
                            sampleData: result.rows.slice(0, 3)
                        })
                    });

                    if (analysisResponse.ok) {
                        const recs = await analysisResponse.json();
                        setRecommendations(recs);
                    }
                } catch (err) {
                    console.error("AI Analysis failed:", err);
                }

                setProgress(100);
                setStatus('Análisis completado');
                setShowHealthReport(true);
            } catch (error) {
                console.error("Processing error:", error);
                navigate('/', { state: { error: 'Error al procesar el archivo' } });
            }
        };

        handleProcessing();
    }, [file, navigate]);

    const handleFixMissing = () => {
        if (processedData) {
            setProcessedData(cleanMissingValues(processedData));
        }
    };

    const handleFixConstant = () => {
        if (processedData) {
            setProcessedData(removeConstantColumns(processedData));
        }
    };

    const handleContinue = () => {
        if (processedData) {
            navigate('/dashboard', { state: { data: processedData, recommendations } });
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col overflow-hidden">
            <TopNav title="DataSense AI" />
            <main className="flex-1 flex flex-col items-center justify-center p-6 relative">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

                {!showHealthReport ? (
                    <div className="w-full max-w-[600px] flex flex-col items-center z-10 animate-fade-in">
                        <div className="mb-8 relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-subtle-pulse"></div>
                            <div className="relative bg-background-light dark:bg-slate-800 p-6 rounded-full border border-slate-200 dark:border-slate-700 shadow-xl">
                                <span className="material-symbols-outlined text-6xl text-primary animate-spin-slow">auto_mode</span>
                            </div>
                        </div>
                        <h1 className="text-slate-900 dark:text-white text-[32px] font-bold leading-tight text-center mb-2">{status}</h1>
                        <div className="w-full bg-white dark:bg-[#1e252d] rounded-xl p-6 border border-slate-200 dark:border-[#283039] shadow-sm mb-6 mt-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-slate-700 dark:text-white text-sm font-medium">Progreso</span>
                                <span className="text-slate-500 dark:text-slate-400 text-sm font-mono">{progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-[#3b4754] rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-[800px] bg-white dark:bg-[#1a2027] rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8 z-10 animate-scale-in">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Reporte de Salud de Datos</h2>
                                <p className="text-sm text-slate-500">Analizamos la consistencia de tu archivo "{file.name}"</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Score de Salud</p>
                                <p className={`text-4xl font-black ${getScoreColor(processedData?.health?.score || 0)}`}>
                                    {processedData?.health?.score}%
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Problemas Detectados</h3>
                                <div className="space-y-3">
                                    {processedData?.health?.issues.length ? processedData.health.issues.map((issue, idx) => (
                                        <div key={idx} className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 group">
                                            <span className={`material-symbols-outlined text-xl ${issue.severity === 'high' ? 'text-red-500' : (issue.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500')}`}>
                                                {issue.severity === 'high' ? 'error' : 'warning'}
                                            </span>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-slate-900 dark:text-white">{issue.column}</p>
                                                <p className="text-[11px] text-slate-500 leading-tight">{issue.message}</p>
                                            </div>
                                            {(issue.type === 'missing' || issue.type === 'constant') && (
                                                <button
                                                    onClick={() => issue.type === 'missing' ? handleFixMissing() : handleFixConstant()}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-md hover:bg-primary hover:text-white"
                                                >
                                                    Arreglar
                                                </button>
                                            )}
                                        </div>
                                    )) : (
                                        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500">
                                            <span className="material-symbols-outlined">check_circle</span>
                                            <p className="text-sm font-bold">¡Excelente consistencia detectada!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest mb-4">Sugerencias del Experto</h3>
                                <div className="space-y-4">
                                    {processedData?.health?.suggestions.map((suggestion, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black mt-0.5">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{suggestion}</p>
                                        </div>
                                    ))}
                                    {processedData?.health?.score < 100 && (
                                        <div className="p-4 rounded-xl bg-primary/10 border-2 border-dashed border-primary/20 mt-6">
                                            <p className="text-xs text-primary font-black uppercase tracking-wider mb-2">💡 Auto-Limpieza Experta</p>
                                            <p className="text-xs text-slate-500 leading-relaxed mb-3">DataSense puede corregir automáticamente los problemas de nulos y columnas constantes por ti.</p>
                                            <div className="flex flex-wrap gap-2">
                                                <button onClick={handleFixMissing} className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all">Limpiar Nulos</button>
                                                <button onClick={handleFixConstant} className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all">Quitar Constantes</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <button onClick={() => navigate('/')} className="flex-1 h-12 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent">
                                Volver y corregir
                            </button>
                            <button onClick={handleContinue} className="flex-2 px-10 h-12 rounded-xl bg-primary text-white text-sm font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                Ignorar y generar dashboard
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProcessingScreen;