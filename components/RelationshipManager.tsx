import React, { useState } from 'react';
import { DataResult, performJoin } from '../services/dataService';
import { Relationship } from '../types';

interface RelationshipManagerProps {
    tables: DataResult[];
    onComplete: (joinedData: DataResult, relationships: Relationship[]) => void;
    onCancel: () => void;
}

const RelationshipManager: React.FC<RelationshipManagerProps> = ({ tables, onComplete, onCancel }) => {
    const [selectedLeft, setSelectedLeft] = useState<string>(tables[0]?.id || '');
    const [selectedRight, setSelectedRight] = useState<string>(tables[1]?.id || '');
    const [leftField, setLeftField] = useState<string>('');
    const [rightField, setRightField] = useState<string>('');
    const [relType, setRelType] = useState<Relationship['type']>('one-to-many');

    const leftTable = tables.find(t => t.id === selectedLeft);
    const rightTable = tables.find(t => t.id === selectedRight);

    const handleJoin = () => {
        if (!leftTable || !rightTable || !leftField || !rightField) {
            alert('Por favor selecciona ambas tablas y los campos de relación.');
            return;
        }

        const joinedRows = performJoin(leftTable, rightTable, leftField, rightField, relType);

        const newJoinedData: DataResult = {
            id: `joined_${Date.now()}`,
            fileName: `${leftTable.fileName.split('.')[0]}_X_${rightTable.fileName.split('.')[0]}`,
            columns: [...leftTable.columns, ...rightTable.columns.filter(c => c !== rightField).map(c => `${rightTable.fileName.split('.')[0]}_${c}`)],
            rows: joinedRows,
            summary: {
                totalRows: joinedRows.length,
                columnTypes: { ...leftTable.summary.columnTypes } // Simplified
            },
            health: leftTable.health // Simplified
        };

        const relationship: Relationship = {
            fromTable: leftTable.id,
            fromField: leftField,
            toTable: rightTable.id,
            toField: rightField,
            type: relType
        };

        onComplete(newJoinedData, [relationship]);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-[#1a2027] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">PRO</span>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">Mapeador de Relaciones</h3>
                        </div>
                        <p className="text-xs text-slate-500">Conecta tus tablas para realizar análisis cruzados inteligentes.</p>
                    </div>
                    <button onClick={onCancel} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
                        {/* Connection line decorative */}
                        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                            <span className="material-symbols-outlined text-slate-200 dark:text-slate-800 text-4xl">link</span>
                        </div>

                        {/* Left Table Section */}
                        <div className="space-y-4 z-10">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tabla Principal</label>
                                <select
                                    className="h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 text-sm font-bold outline-none transition-all"
                                    value={selectedLeft}
                                    onChange={(e) => setSelectedLeft(e.target.value)}
                                >
                                    {tables.map(t => <option key={t.id} value={t.id}>{t.fileName}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Campo de Unión (Key)</label>
                                <select
                                    className="h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 text-sm font-bold outline-none transition-all"
                                    value={leftField}
                                    onChange={(e) => setLeftField(e.target.value)}
                                >
                                    <option value="">Seleccionar campo...</option>
                                    {leftTable?.columns.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Right Table Section */}
                        <div className="space-y-4 z-10">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tabla Secundaria</label>
                                <select
                                    className="h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 text-sm font-bold outline-none transition-all"
                                    value={selectedRight}
                                    onChange={(e) => setSelectedRight(e.target.value)}
                                >
                                    {tables.map(t => <option key={t.id} value={t.id}>{t.fileName}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Campo de Referencia</label>
                                <select
                                    className="h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/30 text-sm font-bold outline-none transition-all"
                                    value={rightField}
                                    onChange={(e) => setRightField(e.target.value)}
                                >
                                    <option value="">Seleccionar campo...</option>
                                    {rightTable?.columns.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <label className="text-[10px] font-black uppercase text-primary tracking-widest">Tipo de Relación</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setRelType('one-to-many')}
                                className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${relType === 'one-to-many' ? 'border-primary bg-white dark:bg-slate-800 shadow-md' : 'border-transparent text-slate-400'}`}
                            >
                                <span className="material-symbols-outlined">account_tree</span>
                                <span className="text-[10px] font-bold">Uno a Muchos</span>
                            </button>
                            <button
                                onClick={() => setRelType('one-to-one')}
                                className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${relType === 'one-to-one' ? 'border-primary bg-white dark:bg-slate-800 shadow-md' : 'border-transparent text-slate-400'}`}
                            >
                                <span className="material-symbols-outlined">sync_alt</span>
                                <span className="text-[10px] font-bold">Uno a Uno</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-slate-50 dark:bg-slate-800/20 flex gap-4">
                    <button onClick={onCancel} className="flex-1 h-12 rounded-xl text-sm font-black text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">Cancelar</button>
                    <button onClick={handleJoin} className="flex-2 px-8 h-12 rounded-xl bg-primary text-white text-sm font-black shadow-xl shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                        Vincular y Analizar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RelationshipManager;
