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
    lisence_number: string | null ;
    lisence_Exp_Date: Date;
    lisence_picture_front: File | string | null;
    lisence_picture_back: File | string | null;
}

