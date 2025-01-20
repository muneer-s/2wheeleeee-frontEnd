export interface IBikeDetails {
    _id: string;
    companyName: string;
    modelName: string;
    rentAmount: number ;
    fuelType: string;
    images: string[];
    registerNumber: string;
    insuranceExpDate: Date ;
    polutionExpDate: Date ;
}



interface IUserDetailsBikeSingle {
    name: string;
    email: string;
    phoneNumber: number;
    address: string;
    profile_picture: string | null;
}

export interface IBikeDetailsWithUserDetails {
    companyName: string;
    modelName: string;
    rentAmount: number;
    fuelType: string;
    images: string[];
    registerNumber: string;
    insuranceExpDate: Date ;
    polutionExpDate: Date ;
    rcImage: string | null;
    insuranceImage: string | null;
    PolutionImage: string | null;
    userDetails: IUserDetailsBikeSingle;
}