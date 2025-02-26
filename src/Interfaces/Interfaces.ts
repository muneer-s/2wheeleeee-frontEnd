export interface UserData {
    _id: string;
    name: string;
    email: string;
    password: string;
    phoneNumber: number;
    isBlocked: boolean;
    isVerified: boolean;
    profile_picture: File | string | null;
    dateOfBirth: Date;
    address: string | null;
    isUser: boolean;
    license_number: string | null;
    license_Exp_Date: Date;
    license_picture_front: File | string | null;
    license_picture_back: File | string | null;
    wallet: string;
}

