import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { DataResult } from '../services/dataService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['#137fec', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#6366f1'];

const AIChart: React.FC<{ data: any }> = ({ data }) => {
    const { title, type, data: chartData } = data;

    const renderContent = () => {
        switch (type) {
            case 'bar':
                return (
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey="value" fill="#137fec" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
            case 'line':
                return (
                    <LineChart data={chartData}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4, fill: '#8b5cf6' }} />
                    </LineChart>
                );
            case 'area':
                return (
                    <AreaChart data={chartData}>
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                        <Area type="monotone" dataKey="value" stroke="#137fec" fill="#137fec30" strokeWidth={2} />
                    </AreaChart>
                );
            case 'pie':
                return (
                    <PieChart>
                        <Pie data={chartData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" nameKey="name">
                            {chartData.map((_: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                    </PieChart>
                );
            default: return null;
        }
    };

    return (
        <div className="my-4 bg-slate-900/40 rounded-2xl border border-white/5 p-4 w-full max-w-full overflow-hidden">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">{title}</h4>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {renderContent() as any}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const AITable: React.FC<{ data: any }> = ({ data }) => {
    const { headers, rows } = data;
    return (
        <div className="my-4 overflow-x-auto rounded-xl border border-white/5 bg-slate-900/40 max-w-full">
            <table className="w-full text-left text-xs">
                <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                        {headers.map((h: string, i: number) => (
                            <th key={i} className="px-4 py-3 font-black text-slate-300 uppercase tracking-widest">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {rows.map((row: any[], i: number) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                            {row.map((val: any, j: number) => (
                                <td key={j} className="px-4 py-3 text-slate-400 font-medium whitespace-nowrap">{String(val)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const MessageBlock: React.FC<{ text: string }> = ({ text }) => {
    // Regex to split by special tags [TABLE]...[/TABLE] or [CHART]...[/CHART]
    const parts = text.split(/(\[TABLE\][\s\S]*?\[\/TABLE\]|\[CHART\][\s\S]*?\[\/CHART\])/g);

    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('[TABLE]')) {
                    try {
                        const jsonStr = part.replace('[TABLE]', '').replace('[/TABLE]', '').trim();
                        const data = JSON.parse(jsonStr);
                        return <AITable key={i} data={data} />;
                    } catch (e) {
                        return <p key={i} className="text-red-400 text-xs italic">[Error al renderizar tabla]</p>;
                    }
                }
                if (part.startsWith('[CHART]')) {
                    try {
                        const jsonStr = part.replace('[CHART]', '').replace('[/CHART]', '').trim();
                        const data = JSON.parse(jsonStr);
                        return <AIChart key={i} data={data} />;
                    } catch (e) {
                        return <p key={i} className="text-red-400 text-xs italic">[Error al renderizar gráfico]</p>;
                    }
                }
                return <span key={i} className="whitespace-pre-wrap">{part}</span>;
            })}
        </>
    );
};

const AnalysisScreen: React.FC = () => {
    const location = useLocation();
    const data = location.state?.data as DataResult;

    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: data ? `¡Hola! He analizado tu archivo "${data.fileName}". ¿En qué puedo ayudarte a visualizar hoy?` : 'Hola. He cargado los datos. ¿Qué te gustaría analizar?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const responseText = await sendMessageToGemini(userMsg.text, data);
            const modelMsg: ChatMessage = { role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, hubo un error al procesar tu solicitud.', isError: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#0b0c10] font-display text-slate-900 dark:text-white overflow-hidden h-screen flex">
            {/* Main Content Area */}
            <main className="hidden lg:flex flex-1 flex-col items-center justify-center p-8 bg-gradient-to-br from-[#0b0c10] to-[#1a1c22] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

                <header className="absolute top-0 left-0 w-full h-16 px-8 flex items-center justify-between border-b border-white/5 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" state={{ data }} className="p-2 rounded-xl hover:bg-white/5 transition-colors text-slate-400 no-underline flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
                        </Link>
                    </div>
                </header>

                <div className="relative z-10 text-center max-w-xl animate-fade-in">
                    <div className="w-24 h-24 rounded-3xl bg-primary/20 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20 rotate-3">
                        <span className="material-symbols-outlined text-5xl text-primary animate-subtle-pulse">query_stats</span>
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">Análisis Inteligente de "{data?.fileName}"</h1>
                    <p className="text-slate-400 text-lg mb-8 leading-relaxed">Pídeme resúmenes, comparaciones o visualizaciones específicas. Generaré tablas y gráficos interactivos para ti.</p>

                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-1">Tip</p>
                            <p className="text-slate-300 text-sm font-medium">"Hazme una tabla con los 5 mejores registros de [Columna]"</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-1">Tip</p>
                            <p className="text-slate-300 text-sm font-medium">"Muéstrame un gráfico de barras comparando [Campo A] y [Campo B]"</p>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-10 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] pointer-events-none">
                    DataSense AI | Core Analytics Engine 1.0
                </div>
            </main>

            {/* Chat Panel */}
            <aside className="w-full lg:w-[480px] bg-[#111418] border-l border-white/5 flex flex-col z-30 shadow-2xl">
                <header className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-[#111418] flex-none">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-white text-[18px]">auto_awesome</span>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-white text-xs font-black tracking-widest uppercase leading-none">Asistente Visual</h3>
                            <span className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wider animate-pulse">Online</span>
                        </div>
                    </div>
                    <Link to="/dashboard" state={{ data }} className="lg:hidden material-symbols-outlined text-slate-400">close</Link>
                </header>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 rounded-2xl shadow-xl max-w-[90%] ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-[#1a1e26] border border-white/10 text-slate-200 rounded-tl-none'}`}>
                                <div className="text-sm leading-relaxed overflow-hidden">
                                    <MessageBlock text={msg.text} />
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 uppercase mt-2 transform scale-90 origin-right">
                                {msg.role === 'user' ? 'Tú' : 'DataSense IA'}
                            </span>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex flex-col items-start animate-fade-in">
                            <div className="bg-[#1a1e26] border border-white/10 p-4 rounded-2xl rounded-tl-none shadow-xl">
                                <div className="flex gap-1.5 py-1">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-6 border-t border-white/5 bg-[#111418] flex-none">
                    <div className="relative group">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            className="w-full bg-[#1a1e26] text-white text-sm rounded-2xl border-2 border-white/5 p-4 pr-14 focus:outline-none focus:border-primary/50 transition-all shadow-inner h-20 scrollbar-hide resize-none"
                            placeholder="Ej: 'Compara ventas por región en un gráfico de barras'..."
                        ></textarea>
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-3 bottom-3 size-10 bg-primary hover:bg-primary/80 disabled:opacity-30 disabled:hover:bg-primary rounded-xl text-white transition-all flex items-center justify-center shadow-lg shadow-primary/20 active:scale-90"
                        >
                            <span className="material-symbols-outlined text-[20px]">send</span>
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default AnalysisScreen;