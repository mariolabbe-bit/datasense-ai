import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_USER } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

const dataRevenue = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
  { name: 'Jul', revenue: 7000 },
];

const dataChannels = [
  { name: 'Direct', value: 400 },
  { name: 'Social', value: 300 },
  { name: 'Organic', value: 300 },
  { name: 'Referral', value: 200 },
];

const COLORS = ['#137fec', '#8b5cf6', '#10b981', '#f59e0b'];

const DashboardScreen: React.FC = () => {
    const navigate = useNavigate();

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
                        style={{backgroundImage: `url("${MOCK_USER.avatarUrl}")`}}
                    ></div>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
                 <div className="layout-container flex flex-col h-full max-w-[1440px] mx-auto px-6 py-6 sm:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide">Generado por IA</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Reporte de Ventas Q3</h1>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => navigate('/share')} className="flex items-center justify-center h-10 px-6 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all gap-2">
                                <span className="material-symbols-outlined text-[18px]">share</span>
                                <span>Compartir</span>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="flex flex-col gap-3 rounded-xl p-5 bg-white dark:bg-[#1a2027] border border-gray-100 dark:border-[#283039] shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Ingresos Totales</p>
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">payments</span>
                            </div>
                            <div>
                                <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">$2.4M</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="material-symbols-outlined text-[#0bda5b] text-[16px]">trending_up</span>
                                    <span className="text-[#0bda5b] text-sm font-bold">+12.5%</span>
                                </div>
                            </div>
                        </div>
                         <div className="flex flex-col gap-3 rounded-xl p-5 bg-white dark:bg-[#1a2027] border border-gray-100 dark:border-[#283039] shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Beneficio Neto</p>
                                <span className="material-symbols-outlined text-slate-400 text-[20px]">account_balance_wallet</span>
                            </div>
                            <div>
                                <p className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">$850K</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="material-symbols-outlined text-[#0bda5b] text-[16px]">trending_up</span>
                                    <span className="text-[#0bda5b] text-sm font-bold">+8.1%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-[#1a2027] border border-gray-100 dark:border-[#283039] p-6 shadow-sm">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-6">Evolución de Ingresos</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dataRevenue}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#137fec" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#137fec" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} 
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#137fec" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="rounded-xl bg-white dark:bg-[#1a2027] border border-gray-100 dark:border-[#283039] p-6 shadow-sm flex flex-col">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-6">Ventas por Canal</h3>
                            <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={dataChannels}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {dataChannels.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                    {dataChannels.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                            <span className="text-slate-500 dark:text-slate-400">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            </main>
            <div className="fixed bottom-6 right-6 z-50">
                <Link to="/analysis" className="group flex items-center gap-0 hover:gap-3 bg-gradient-to-r from-primary to-blue-600 hover:to-primary text-white p-4 rounded-full shadow-lg shadow-blue-500/40 transition-all duration-300 no-underline">
                    <span className="material-symbols-outlined text-[24px] animate-pulse">auto_awesome</span>
                    <span className="w-0 overflow-hidden whitespace-nowrap group-hover:w-auto transition-all duration-300 text-sm font-bold pl-0 group-hover:pl-1">Analizar con AI</span>
                </Link>
            </div>
        </div>
    );
};

export default DashboardScreen;