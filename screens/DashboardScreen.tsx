import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MOCK_USER } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line } from 'recharts';
import { DataResult } from '../services/dataService';

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
    const data = location.state?.data as DataResult;
    const initialRecommendations = location.state?.recommendations as ChartRecommendation[] || [];

    const [userCharts, setUserCharts] = useState<ChartRecommendation[]>([]);
    const [showBuilder, setShowBuilder] = useState(false);
    const [newChart, setNewChart] = useState<ChartRecommendation>({
        title: 'Nuevo Gráfico',
        type: 'bar',
        xAxis: data?.columns[0] || '',
        yAxis: data?.columns[data?.columns.length > 1 ? 1 : 0] || data?.columns[0] || '',
    });

    const allCharts = useMemo(() => [
        ...initialRecommendations,
        ...userCharts
    ], [initialRecommendations, userCharts]);

    const fileName = data?.fileName || 'Reporte de Datos';
    const totalRows = data?.summary.totalRows || 0;

    const handleAddChart = () => {
        setUserCharts(prev => [...prev, { ...newChart, id: Date.now().toString() }]);
        setShowBuilder(false);
    };

    const renderChart = (rec: ChartRecommendation) => {
        const chartData = data?.rows.slice(0, 50) || [];

        switch (rec.type) {
            case 'area':
                return (
                    <AreaChart data={chartData}>
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
                    <BarChart data={chartData}>
                        <XAxis dataKey={rec.xAxis} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey={rec.yAxis} fill="#137fec" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
            case 'line':
                return (
                    <LineChart data={chartData}>
                        <XAxis dataKey={rec.xAxis} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Line type="monotone" dataKey={rec.yAxis} stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    </LineChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie data={chartData.slice(0, 6)} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey={rec.yAxis} nameKey={rec.xAxis}>
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
                <div className="flex items-center gap-4">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-gray-200 dark:border-gray-700"
                        style={{ backgroundImage: `url("${MOCK_USER.avatarUrl}")` }}
                    ></div>
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
                            <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default group">
                                <span className="material-symbols-outlined text-sm text-slate-400 group-hover:text-primary">database</span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{col}</span>
                            </div>
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
                    <div className="layout-container flex flex-col h-full max-w-[1200px] mx-auto px-6 py-6 sm:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-bold text-primary uppercase tracking-widest">{fileName}</p>
                                <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white truncate max-w-md">
                                    Visualizaciones Generadas
                                </h1>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowBuilder(true)} className="flex items-center justify-center h-10 px-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white text-sm font-bold hover:shadow-md transition-all gap-2">
                                    <span className="material-symbols-outlined text-[18px]">add_chart</span>
                                    <span className="hidden sm:inline">Nuevo Gráfico</span>
                                </button>
                                <button onClick={() => navigate('/share')} className="flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all gap-2 text-primary-fg">
                                    <span className="material-symbols-outlined text-[18px]">share</span>
                                    <span>Compartir</span>
                                </button>
                            </div>
                        </div>

                        {/* Stats Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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