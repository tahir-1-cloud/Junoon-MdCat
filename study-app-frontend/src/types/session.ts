
export interface Session {
    id: number;
    title: string;
    description: string;
    sessionYear: string; // ISO date string (can use Date if you parse it)
}