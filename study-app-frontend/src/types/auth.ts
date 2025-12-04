// services/userService.ts

export interface LoginModel {
    userName?: string;
    password: string;
}

export interface LoginResponse {
    fullName: string;
    session: string;
}
