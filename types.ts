export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    isError?: boolean;
}

export interface User {
    name: string;
    role: string;
    avatarUrl: string;
}

export const MOCK_USER: User = {
    name: "Carlos R.",
    role: "Business Analyst",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBQt1zyVC0NpmZwtiYC8WdxArjZMJYSJ6wlUSBerhmBMfuFSHx9kCD27LuRt-BU_sDmxR4smfP5ixxU_sqRDRYMpGauBrUiaXBFuQvU7DyZU0eCd6gQMSO4E8EBPXroBQFqMt2zNBiQaFTogXVt9oNirJsmxP_9ZWjyJ7XQNEZWODZHxb2lm8DtioyucL20PSb-b3y0Lduu-h9WZ3wgSruEOzyVVvuil7mQkyztRbr7WeqtT__yTBQJn1M1J_hUDzAlLZ42A7Go6Q"
};