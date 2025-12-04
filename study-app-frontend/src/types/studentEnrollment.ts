export interface studentEnrollment{
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    preferredCourse: string;
    city?: string; // optional, matches C# nullable
    status: string;  
}
