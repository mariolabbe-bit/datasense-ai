export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    isError?: boolean;
}

export interface User {
    id: string;
    email: string;
    name?: string;
}

export interface Relationship {
    fromTable: string; // Table ID or name
    fromField: string;
    toTable: string;
    toField: string;
    type: 'one-to-one' | 'one-to-many' | 'many-to-one';
}

export interface RelationalData {
    tables: {
        id: string;
        name: string;
        columns: string[];
        rows: any[];
    }[];
    relationships: Relationship[];
}

export const MOCK_USER: User = {
    id: "user_123",
    email: "carlos@example.com",
    name: "Carlos R."
};