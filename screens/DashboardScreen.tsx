import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MOCK_USER } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line } from 'recharts';
import { DataResult } from '../services/dataService';

const COLORS = ['#137fec', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#6366f1'];

interface ChartRecommendation {
    title: string;
    type: 'area' | 'bar' | 'pie' | 'line';
    xAxis: string;
    yAxis: string;
    reason: string;
}

const DashboardScreen: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state?.data as DataResult;
    const recommendations = location.state?.recommendations as ChartRecommendation[];

    const fileName = data?.fileName || 'Reporte de Ventas Q3';
    const totalRows = data?.summary.totalRows || 0;

    const renderChart = (rec: ChartRecommendation) => {
        const chartData = data?.rows.slice(0, 50) || [];

        switch (rec.type) {
            case 'area':
                return (
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id={`color-${rec.xAxis}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#137fec" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#137fec" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey={rec.xAxis} stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Area type="monotone" dataKey={rec.yAxis} stroke="#137fec" fillOpacity={1} fill={`url(#color-${rec.xAxis})`} strokeWidth={2} />
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
            <header className="flex-none flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-border-dark px-6 py-3 bg-white dark:bg-[#111418]">
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center justify-center size-8 rounded bg-primary/10 text-primary no-underline">
                        <span className="material-symbols-outlined text-[20px]">analytics</span>
                    </Link>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">DataFlow AI</h2>
                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
                    <nav className="flex gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <span className="text-slate-900 dark:text-white cursor-default">Dashboards</span>
                        <Link to="/analysis" className="hover:text-primary transition-colors">Conversación IA</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-9 border border-gray-200 dark:border-gray-700"
                        style={{ backgroundImage: `url("${MOCK_USER.avatarUrl}")` }}
                    ></div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                <div className="layout-container flex flex-col h-full max-w-[1440px] mx-auto px-6 py-6 sm:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                                    {data ? 'Datos Cargados' : 'Vista Previa'}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white truncate max-w-md">
                                {fileName}
                            </h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="flex flex-col gap-3 rounded-xl p-5 bg-white dark:bg-[#1a2027] border border-gray-100 dark:border-[#283039] shadow-sm">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Total Registros</p>
                            <p className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">{totalRows.toLocaleString()}</p>
                        </div>
                        {data?.columns.slice(0, 3).map((col, idx) => (
                            <div key={idx} className="flex flex-col gap-3 rounded-xl p-5 bg-white dark:bg-[#1a2027] border border-gray-100 dark:border-[#283039] shadow-sm">
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{col}</p>
                                <p className="text-slate-900 dark:text-white text-lg font-bold truncate">Muestra: {String(data.rows[0][col])}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {recommendations && recommendations.length > 0 ? recommendations.map((rec, index) => (
                            <div key={index} className="rounded-xl bg-white dark:bg-[#1a2027] border border-gray-100 dark:border-[#283039] p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-slate-900 dark:text-white text-lg font-bold">{rec.title}</h3>
                                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">{rec.type}</span>
                                </div>
                                <div className="h-[250px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {renderChart(rec) as any}
                                    </ResponsiveContainer>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 text-xs mt-4 italic">
                                    <span className="font-bold">IA Insight:</span> {rec.reason}
                                </p>
                            </div>
                        )) : (
                            <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-slate-800/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">analytics</span>
                                <p className="text-slate-500">No hay recomendaciones de gráficos disponibles para este archivo.</p>
                                <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold hover:underline">Intentar con otro archivo</button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <div className="fixed bottom-6 right-6 z-50">
                <Link to="/analysis" state={{ data }} className="group flex items-center gap-0 hover:gap-3 bg-gradient-to-r from-primary to-blue-600 hover:to-primary text-white p-4 rounded-full shadow-lg shadow-blue-500/40 transition-all duration-300 no-underline">
                    <span className="material-symbols-outlined text-[24px] animate-pulse">auto_awesome</span>
                    <span className="w-0 overflow-hidden whitespace-nowrap group-hover:w-auto transition-all duration-300 text-sm font-bold pl-0 group-hover:pl-1">Analizar chat</span>
                </Link>
            </div>
        </div>
    );
};

export default DashboardScreen;