export interface contactus{
    id?: number;
    fullName: string;
    email: string;
    message:string;
    createdAt?:Date;
}

export interface subscriber{
    id?: number;
    email: string;
    createdAt?:Date;
}