import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface DataHealthReport {
    score: number; // 0-100
    issues: {
        column: string;
        type: 'missing' | 'inconsistent_type' | 'constant';
        severity: 'low' | 'medium' | 'high';
        message: string;
    }[];
    suggestions: string[];
}

export interface DataResult {
    fileName: string;
    columns: string[];
    rows: any[];
    summary: {
        totalRows: number;
        columnTypes: Record<string, string>;
    };
    health?: DataHealthReport;
}

const analyzeDataQuality = (columns: string[], rows: any[]): DataHealthReport => {
    const issues: DataHealthReport['issues'] = [];
    const suggestions: string[] = [];
    let totalIssuesScore = 0;

    columns.forEach(col => {
        const values = rows.map(r => r[col]);
        const nullCount = values.filter(v => v === null || v === undefined || v === '').length;
        const nullPercentage = (nullCount / rows.length) * 100;

        // Check for missing values
        if (nullPercentage > 0) {
            const severity = nullPercentage > 30 ? 'high' : (nullPercentage > 10 ? 'medium' : 'low');
            issues.push({
                column: col,
                type: 'missing',
                severity,
                message: `La columna tiene un ${nullPercentage.toFixed(1)}% de valores faltantes.`
            });
            totalIssuesScore += (severity === 'high' ? 20 : (severity === 'medium' ? 10 : 5));
        }

        // Check for inconsistent types
        const types = new Set(values.filter(v => v !== null && v !== '').map(v => typeof v));
        if (types.size > 1) {
            issues.push({
                column: col,
                type: 'inconsistent_type',
                severity: 'medium',
                message: `Tipos de datos mezclados detectados (${Array.from(types).join(', ')}).`
            });
            totalIssuesScore += 15;
        }

        // Check for constant values
        const uniqueValues = new Set(values);
        if (uniqueValues.size === 1 && rows.length > 5) { // Only flag if there are enough rows to make it meaningful
            issues.push({
                column: col,
                type: 'constant',
                severity: 'low',
                message: 'Esta columna tiene el mismo valor en todas las filas.'
            });
            totalIssuesScore += 5;
        }
    });

    if (totalIssuesScore > 0) {
        suggestions.push("Considera limpiar los valores nulos o asignar valores por defecto.");
        suggestions.push("Asegúrate de que las columnas numéricas no contengan símbolos de texto.");
    }

    return {
        score: Math.max(0, 100 - totalIssuesScore),
        issues,
        suggestions
    };
};

export const parseFile = async (file: File): Promise<DataResult> => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
        return parseCSV(file);
    } else if (extension === 'xlsx' || extension === 'xls') {
        return parseExcel(file);
    } else {
        throw new Error('Formato de archivo no soportado. Por favor use .csv o .xlsx');
    }
};

const parseCSV = (file: File): Promise<DataResult> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                const columns = results.meta.fields || [];
                const rows = results.data;

                const columnTypes: Record<string, string> = {};
                if (rows.length > 0) {
                    columns.forEach(col => {
                        const sample = rows.find(r => r[col] !== null && r[col] !== undefined)?.[col];
                        columnTypes[col] = typeof sample;
                    });
                }

                const health = analyzeDataQuality(columns, rows);

                resolve({
                    fileName: file.name,
                    columns,
                    rows,
                    summary: {
                        totalRows: rows.length,
                        columnTypes
                    },
                    health
                });
            },
            error: (error) => reject(error)
        });
    });
};

const parseExcel = async (file: File): Promise<DataResult> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

                if (jsonData.length === 0) {
                    throw new Error('La hoja de cálculo está vacía.');
                }

                const columns = Object.keys(jsonData[0]);
                const columnTypes: Record<string, string> = {};

                columns.forEach(col => {
                    const sample = jsonData.find(r => r[col] !== null && r[col] !== undefined)?.[col];
                    columnTypes[col] = typeof sample;
                });

                const health = analyzeDataQuality(columns, jsonData);

                resolve({
                    fileName: file.name,
                    columns,
                    rows: jsonData,
                    summary: {
                        totalRows: jsonData.length,
                        columnTypes
                    },
                    health
                });
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};
