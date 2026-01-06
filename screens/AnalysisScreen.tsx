import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { DataResult } from '../services/dataService';

const AnalysisScreen: React.FC = () => {
    const location = useLocation();
    const data = location.state?.data as DataResult;

    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: data ? `¡Hola! He analizado tu archivo "${data.fileName}". ¿Qué te gustaría saber sobre estos datos?` : 'Hola. He cargado los datos. ¿Qué te gustaría analizar?' }
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
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white overflow-hidden h-screen flex">
            <main className="flex-1 flex flex-col min-w-0 h-full relative z-10">
                <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-background-dark/95 backdrop-blur sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <Link to="/dashboard" className="material-symbols-outlined text-slate-400 hover:text-white no-underline">arrow_back</Link>
                        <h2 className="text-xl font-bold text-white tracking-tight">Análisis Conversacional</h2>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-surface-dark border border-white/5 p-5 rounded-xl flex flex-col gap-1">
                            <p className="text-slate-400 text-sm font-medium">Ingresos Totales</p>
                            <p className="text-3xl font-bold text-white mt-2">$2,400,000</p>
                        </div>
                        <div className="bg-surface-dark border border-white/5 p-5 rounded-xl flex flex-col gap-1">
                            <p className="text-slate-400 text-sm font-medium">Crecimiento</p>
                            <p className="text-3xl font-bold text-white mt-2">12.5%</p>
                        </div>
                    </div>
                    <div className="lg:col-span-2 bg-surface-dark border border-white/5 rounded-xl p-6 relative h-64 flex flex-center items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5"></div>
                        <div className="flex flex-col items-center gap-3 relative z-10 text-center px-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-4xl text-primary animate-subtle-pulse">analytics</span>
                            </div>
                            <p className="text-white font-bold text-lg">Visualización Dinámica</p>
                            <p className="text-slate-400 text-sm max-w-xs">Interactúa con el Asistente IA para generar gráficos y análisis profundos de tus datos de ventas.</p>
                        </div>
                    </div>
                </div>
            </main>
            <aside className="w-full md:w-[400px] bg-background-dark border-l border-white/10 flex flex-col z-30 shadow-2xl">
                <div className="h-16 border-b border-white/5 px-4 flex items-center justify-between bg-surface-dark">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-white text-[18px]">auto_awesome</span>
                        </div>
                        <h3 className="text-white text-sm font-bold">Asistente IA</h3>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 bg-background-dark/50">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-700 text-xs text-white font-bold' : 'bg-surface-dark-lighter border border-white/10'}`}>
                                {msg.role === 'user' ? 'ME' : <span className="material-symbols-outlined text-primary text-[16px]">smart_toy</span>}
                            </div>
                            <div className={`p-3.5 rounded-2xl shadow-md ${msg.role === 'user' ? 'bg-primary rounded-tr-none shadow-primary/10' : 'bg-surface-dark-lighter rounded-tl-none border border-white/5'}`}>
                                <p className={`text-sm leading-relaxed ${msg.role === 'user' ? 'text-white' : 'text-slate-200'} ${msg.isError ? 'text-red-400' : ''}`}>
                                    {msg.text}
                                </p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-surface-dark-lighter border border-white/10 flex-shrink-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-[16px] animate-spin">sync</span>
                            </div>
                            <div className="bg-surface-dark-lighter p-3.5 rounded-2xl rounded-tl-none border border-white/5">
                                <p className="text-slate-400 text-sm italic">Escribiendo...</p>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-white/5 bg-surface-dark relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        className="w-full bg-background-dark text-white text-sm rounded-xl border border-white/10 p-3 pr-12 focus:outline-none focus:border-primary/50 resize-none h-14 scrollbar-hide"
                        placeholder="Pregunta a tu data..."
                    ></textarea>
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-6 bottom-6 p-1.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary rounded-lg text-white transition-colors flex items-center justify-center shadow-lg shadow-primary/25"
                    >
                        <span className="material-symbols-outlined text-[20px]">send</span>
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default AnalysisScreen;