import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DataResult } from '../services/dataService';
import { useAuth } from '../services/AuthContext';
import { getBackendUrl } from '../services/apiConfig';

const COLORS = ['#137fec', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#6366f1'];

interface ChartRecommendation {
    id?: string;
    title: string;
    type: 'area' | 'bar' | 'pie' | 'line';
    xAxis: string;
    yAxis: string;
    reason?: string;
}

const DashboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, logout } = useAuth();
    const data = location.state?.data as DataResult;
    const initialRecommendations = location.state?.recommendations as ChartRecommendation[] || [];

    const [userCharts, setUserCharts] = useState<ChartRecommendation[]>([]);
    const [showBuilder, setShowBuilder] = useState(false);
    const [narrative, setNarrative] = useState<string>('');
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<{ column: string; value: any } | null>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);

    const handleExportPDF = async () => {
        if (!dashboardRef.current || isExporting) return;
        setIsExporting(true);
        try {
            const canvas = await html2canvas(dashboardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#f8fafc' // Slightly off-white for better PDF feel
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`DataSense_Report_${data?.fileName || 'export'}.pdf`);
        } catch (err) {
            console.error("Export failed:", err);
            alert("Error al exportar PDF. Intenta de nuevo.");
        } finally {
            setIsExporting(false);
        }
    };

    const [newChart, setNewChart] = useState<ChartRecommendation>({
        title: 'Nuevo Gráfico',
        type: 'bar',
        xAxis: data?.columns[0] || '',
        yAxis: data?.columns[data?.columns.length > 1 ? 1 : 0] || data?.columns[0] || '',
    });

    useEffect(() => {
        const fetchNarrative = async () => {
            if (!data || !token) return;
            const backendUrl = getBackendUrl();
            try {
                const response = await fetch(`${backendUrl}/api/generate-narrative`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        columns: data.columns,
                        summary: { ...data.summary, fileName: data.fileName },
                        health: data.health
                    })
                });
                if (response.ok) {
                    const res = await response.json();
                    setNarrative(res.narrative);
                }
            } catch (err) {
                console.error("Narrative fetch failed:", err);
            }
        };
        fetchNarrative();
    }, [data, token]);

    const handleSave = async () => {
        if (!data || isSaving || !token) return;
        setIsSaving(true);
        const backendUrl = getBackendUrl();
        try {
            const response = await fetch(`${backendUrl}/api/save-analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: `Análisis de ${data.fileName}`,
                    data: { data, recommendations: initialRecommendations, userCharts },
                    insights: narrative
                })
            });
            if (response.ok) {
                alert('¡Dashboard guardado con éxito!');
            } else {
                alert('Error al guardar el dashboard.');
            }
        } catch (err) {
            console.error("Save failed:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredRows = useMemo(() => {
        if (!data || !globalFilter) return data?.rows || [];
        return data.rows.filter(row => String(row[globalFilter.column]) === String(globalFilter.value));
    }, [data, globalFilter]);

    const allCharts = useMemo(() => [
        ...initialRecommendations,
        ...userCharts
    ], [initialRecommendations, userCharts]);

    const fileName = data?.fileName || 'Reporte de Datos';
    const totalRows = filteredRows.length;

    const handleAddChart = () => {
        setUserCharts(prev => [...prev, { ...newChart, id: Date.now().toString() }]);
        setShowBuilder(false);
    };

    const renderChart = (rec: ChartRecommendation) => {
        const chartData = filteredRows.slice(0, 50);

        const handleChartClick = (state: any) => {
            if (state && state.activePayload && state.activePayload.length > 0) {
                const clickedValue = state.activePayload[0].payload[rec.xAxis];
                setGlobalFilter({ column: rec.xAxis, value: clickedValue });
            }
        };

        const handlePieClick = (data: any) => {
            if (data && data.name) {
                setGlobalFilter({ column: rec.xAxis, value: data.name });
            }
        };

        switch (rec.type) {
            case 'area':
                return (
                    <AreaChart data={chartData} onClick={handleChartClick}>
                        <defs>
                            <linearGradient id={`color-${rec.xAxis}-${rec.yAxis}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#137fec" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#137fec" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey={rec.xAxis} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Area type="monotone" dataKey={rec.yAxis} stroke="#137fec" fillOpacity={1} fill={`url(#color-${rec.xAxis}-${rec.yAxis})`} strokeWidth={2} />
                    </AreaChart>
                );
            case 'bar':
                return (
                    <BarChart data={chartData} onClick={handleChartClick}>
                        <XAxis dataKey={rec.xAxis} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey={rec.yAxis} fill="#137fec" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
            case 'line':
                return (
                    <LineChart data={chartData} onClick={handleChartClick}>
                        <XAxis dataKey={rec.xAxis} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Line type="monotone" dataKey={rec.yAxis} stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    </LineChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={chartData.slice(0, 6)}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey={rec.yAxis}
                            nameKey={rec.xAxis}
                            onClick={handlePieClick}
                        >
                            {chartData.slice(0, 6).map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    </PieChart>
                );
            default:
                return null;
        }
    };

    const handleFieldClick = (col: string) => {
        setNewChart(prev => ({
            ...prev,
            xAxis: col,
            title: `Análisis de ${col}`
        }));
        setShowBuilder(true);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased overflow-hidden flex flex-col h-screen">
            <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-border-dark px-6 py-3 bg-white dark:bg-[#111418] z-20">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center justify-center size-8 rounded bg-primary/10 text-primary no-underline">
                        <span className="material-symbols-outlined text-[20px]">analytics</span>
                    </Link>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">DataFlow AI</h2>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
                    <nav className="flex gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <span className="text-slate-900 dark:text-white cursor-default">Dashboards</span>
                        <Link to="/analysis" state={{ data }} className="hover:text-primary transition-colors">Conversación IA</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">{user?.name || user?.email}</p>
                        <button
                            onClick={logout}
                            className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm border border-primary/20">
                        {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar de Campos */}
                <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 dark:border-border-dark bg-white dark:bg-[#111418] p-6 overflow-y-auto z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="material-symbols-outlined text-primary">data_usage</span>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Columnas</h3>
                    </div>
                    <div className="flex flex-col gap-2">
                        {data?.columns.map((col, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleFieldClick(col)}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-all cursor-pointer group w-full text-left"
                            >
                                <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-primary">database</span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-primary transition-colors">{col}</span>
                            </button>
                        ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={() => setShowBuilder(true)}
                            className="w-full flex items-center justify-center gap-2 h-10 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Personalizar Tablero
                        </button>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-50/50 dark:bg-slate-900/20">
                    <div ref={dashboardRef} className="layout-container flex flex-col h-full max-w-[1200px] mx-auto px-6 py-6 sm:px-8 bg-slate-50/50 dark:bg-slate-900/20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-bold text-primary uppercase tracking-widest">{fileName}</p>
                                <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white truncate max-w-md flex items-center gap-2">
                                    Visualizaciones {location.state?.relationships ? <span className="text-[10px] bg-primary text-white px-2 py-1 rounded-md uppercase tracking-widest">PRO</span> : ''}
                                </h1>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleExportPDF}
                                    className={`flex items-center justify-center h-10 px-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition-all gap-2 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isExporting}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{isExporting ? 'sync' : 'picture_as_pdf'}</span>
                                    <span>{isExporting ? 'Procesando...' : 'PDF'}</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    className={`flex items-center justify-center h-10 px-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-bold hover:bg-green-500 hover:text-white transition-all gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isSaving}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{isSaving ? 'sync' : 'save'}</span>
                                    <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
                                </button>
                                <button onClick={() => setShowBuilder(true)} className="flex items-center justify-center h-10 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white text-sm font-bold hover:shadow-md transition-all gap-2">
                                    <span className="material-symbols-outlined text-[18px]">add_chart</span>
                                    <span className="hidden sm:inline">Nuevo</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex flex-col gap-1 rounded-xl p-5 bg-white dark:bg-[#1a2027] border border-gray-100 dark:border-[#283039] shadow-sm">
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Filas Totales</p>
                                <p className="text-slate-900 dark:text-white text-2xl font-black">{totalRows.toLocaleString()}</p>
                            </div>
                            {data?.columns.slice(0, 3).map((col, idx) => (
                                <div key={idx} className="flex flex-col gap-1 rounded-xl p-5 bg-white dark:bg-[#1a2027] border border-gray-100 dark:border-[#283039] shadow-sm">
                                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">{col}</p>
                                    <p className="text-slate-900 dark:text-white text-sm font-bold truncate opacity-80">Muestra: {String(data.rows[0][col])}</p>
                                </div>
                            ))}
                        </div>

                        {/* Executive Narrative Summary */}
                        {narrative && (
                            <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-white to-purple-500/10 dark:from-primary/20 dark:via-slate-800/50 dark:to-purple-500/10 border border-primary/20 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-7xl text-primary">auto_awesome</span>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-lg">description</span>
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-primary">Resumen Ejecutivo IA</h3>
                                </div>
                                <p className="text-slate-700 dark:text-slate-200 text-base leading-relaxed font-medium relative z-10">
                                    {narrative}
                                </p>
                            </div>
                        )}

                        {/* Filter Indicator */}
                        {globalFilter && (
                            <div className="mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                                    <span className="material-symbols-outlined text-sm">filter_alt</span>
                                    <span>Filtrado por <span className="uppercase">{globalFilter.column}</span>: {globalFilter.value}</span>
                                    <button
                                        onClick={() => setGlobalFilter(null)}
                                        className="ml-2 hover:bg-primary/20 rounded-full size-4 flex items-center justify-center transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">close</span>
                                    </button>
                                </div>
                                <button
                                    onClick={() => setGlobalFilter(null)}
                                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                                >
                                    Limpiar Filtros
                                </button>
                            </div>
                        )}

                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            {allCharts.length > 0 ? allCharts.map((rec, index) => (
                                <div key={index} className="rounded-2xl bg-white dark:bg-[#1a2027] border border-gray-100 dark:border-[#283039] p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative group/card border-l-4" style={{ borderLeftColor: COLORS[index % COLORS.length] }}>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">{rec.title}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{rec.xAxis} por {rec.yAxis}</p>
                                        </div>
                                        <span className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest">{rec.type}</span>
                                    </div>
                                    <div className="h-[280px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            {renderChart(rec) as any}
                                        </ResponsiveContainer>
                                    </div>
                                    {rec.reason && (
                                        <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                            <div className="flex gap-2">
                                                <span className="material-symbols-outlined text-primary text-sm">tips_and_updates</span>
                                                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                                                    {rec.reason}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="col-span-full py-20 text-center bg-white dark:bg-slate-800/40 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                    <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-3xl text-slate-300">add_chart</span>
                                    </div>
                                    <h3 className="text-slate-900 dark:text-white font-bold mb-2">Comienza a construir</h3>
                                    <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">Selecciona columnas y tipos de gráficos para visualizar tus datos a tu manera.</p>
                                    <button onClick={() => setShowBuilder(true)} className="px-8 h-11 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Crear mi primer gráfico</button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal de Constructor */}
            {showBuilder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-[#1a2027] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
                        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-[#1a2027]">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Constructor de Visualización</h3>
                                <p className="text-xs text-slate-500">Configura los ejes y el tipo de representación.</p>
                            </div>
                            <button onClick={() => setShowBuilder(false)} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-8 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nombre de la vista</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Tendencia de Ventas"
                                    className="h-12 px-5 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 text-sm font-bold outline-none transition-all"
                                    value={newChart.title}
                                    onChange={e => setNewChart({ ...newChart, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tipo de reporte</label>
                                    <select
                                        className="h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 text-sm font-bold outline-none transition-all appearance-none cursor-pointer"
                                        value={newChart.type}
                                        onChange={e => setNewChart({ ...newChart, type: e.target.value as any })}
                                    >
                                        <option value="bar">Gráfico de Barras</option>
                                        <option value="line">Gráfico de Líneas</option>
                                        <option value="area">Gráfico de Área</option>
                                        <option value="pie">Gráfico Circular</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Eje X (Categoría)</label>
                                    <select
                                        className="h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 text-sm font-bold outline-none transition-all"
                                        value={newChart.xAxis}
                                        onChange={e => setNewChart({ ...newChart, xAxis: e.target.value })}
                                    >
                                        {data?.columns.map(col => <option key={col} value={col}>{col}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Eje Y (Valor Numérico)</label>
                                <select
                                    className="h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 text-sm font-bold outline-none transition-all"
                                    value={newChart.yAxis}
                                    onChange={e => setNewChart({ ...newChart, yAxis: e.target.value })}
                                >
                                    {data?.columns.map(col => <option key={col} value={col}>{col}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="p-8 bg-slate-50 dark:bg-slate-800/20 flex gap-4">
                            <button onClick={() => setShowBuilder(false)} className="flex-1 h-12 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">Descartar</button>
                            <button onClick={handleAddChart} className="flex-2 px-8 h-12 rounded-xl bg-primary text-white text-sm font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all">Confirmar Gráfico</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="fixed bottom-8 right-8 z-40">
                <Link to="/analysis" state={{ data }} className="group flex items-center gap-0 hover:gap-4 bg-slate-900 border border-slate-800 dark:bg-white dark:border-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 no-underline">
                    <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
                    <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[200px] transition-all duration-500 text-sm font-black">Consultar Analista IA</span>
                </Link>
            </div>
        </div>
    );
};

export default DashboardScreen;