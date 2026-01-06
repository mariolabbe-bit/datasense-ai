import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface DataResult {
    columns: string[];
    rows: any[];
    fileName: string;
    fileSize: number;
    summary: {
        totalRows: number;
        totalColumns: number;
    };
}

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
                resolve({
                    columns,
                    rows: results.data,
                    fileName: file.name,
                    fileSize: file.size,
                    summary: {
                        totalRows: results.data.length,
                        totalColumns: columns.length
                    }
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
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                if (jsonData.length === 0) {
                    throw new Error('La hoja de cálculo está vacía.');
                }

                const columns = Object.keys(jsonData[0] as object);

                resolve({
                    columns,
                    rows: jsonData,
                    fileName: file.name,
                    fileSize: file.size,
                    summary: {
                        totalRows: jsonData.length,
                        totalColumns: columns.length
                    }
                });
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};
