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
    id: string; // Added ID for relational mapping
    fileName: string;
    columns: string[];
    rows: any[];
    summary: {
        totalRows: number;
        columnTypes: Record<string, string>;
    };
    health?: DataHealthReport;
}

export const performJoin = (
    leftTable: DataResult,
    rightTable: DataResult,
    fromField: string,
    toField: string,
    type: 'one-to-one' | 'one-to-many' | 'many-to-one'
): any[] => {
    // Basic inner join implementation for the browser
    const joinedRows: any[] = [];

    leftTable.rows.forEach(leftRow => {
        const leftValue = leftRow[fromField];

        const matches = rightTable.rows.filter(rightRow =>
            String(rightRow[toField]) === String(leftValue)
        );

        if (matches.length > 0) {
            matches.forEach(match => {
                // Prefix columns to avoid collisions if they have same names
                const rightRowPrefixed: any = {};
                Object.keys(match).forEach(key => {
                    if (key !== toField) {
                        rightRowPrefixed[`${rightTable.fileName.split('.')[0]}_${key}`] = match[key];
                    }
                });
                joinedRows.push({ ...leftRow, ...rightRowPrefixed });
            });
        }
    });

    return joinedRows;
};

export const cleanMissingValues = (data: DataResult): DataResult => {
    const newRows = data.rows.map(row => {
        const newRow = { ...row };
        data.columns.forEach(col => {
            if (newRow[col] === null || newRow[col] === undefined || newRow[col] === '') {
                // If numeric type, fill with 0, else empty string
                newRow[col] = data.summary.columnTypes[col] === 'number' ? 0 : '';
            }
        });
        return newRow;
    });

    const newHealth = analyzeDataQuality(data.columns, newRows);
    return { ...data, rows: newRows, health: newHealth };
};

export const removeConstantColumns = (data: DataResult): DataResult => {
    const constantCols = data.health?.issues
        .filter(i => i.type === 'constant')
        .map(i => i.column) || [];

    if (constantCols.length === 0) return data;

    const newColumns = data.columns.filter(col => !constantCols.includes(col));
    const newRows = data.rows.map(row => {
        const newRow = { ...row };
        constantCols.forEach(col => delete newRow[col]);
        return newRow;
    });

    const newColumnTypes = { ...data.summary.columnTypes };
    constantCols.forEach(col => delete newColumnTypes[col]);

    const newHealth = analyzeDataQuality(newColumns, newRows);

    return {
        ...data,
        columns: newColumns,
        rows: newRows,
        summary: {
            ...data.summary,
            columnTypes: newColumnTypes
        },
        health: newHealth
    };
};

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
                    id: Math.random().toString(36).substr(2, 9),
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
                    id: Math.random().toString(36).substr(2, 9),
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
