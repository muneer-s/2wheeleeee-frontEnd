export interface IBikeDetails {
    _id: string;
    userId: string
    companyName: string;
    modelName: string;
    rentAmount: number;
    fuelType: string;
    images: string[];
    registerNumber: string;
    insuranceExpDate: Date;
    polutionExpDate: Date;
    offer: string | null;
    offerApplied: boolean | null;
    offerPrice: number | null;
    location: string
}



interface IUserDetailsBikeSingle {
    name: string;
    email: string;
    phoneNumber: number;
    address: string;
    profile_picture: string | null;
}

export interface IBikeDetailsWithUserDetails {
    _id: any;
    userId: string;
    companyName: string;
    modelName: string;
    rentAmount: number;
    fuelType: string;
    images: string[];
    registerNumber: string;
    insuranceExpDate: Date;
    polutionExpDate: Date;
    userDetails: IUserDetailsBikeSingle;
    offer: string | null;
    offerApplied: boolean | null;
    offerPrice: number | null;
    location: string
}