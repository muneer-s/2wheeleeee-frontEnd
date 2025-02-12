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
    offer:string | null;
    offerApplied:boolean | null;
    offerPrice:number | null;
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
    companyName: string;
    modelName: string;
    rentAmount: number;
    fuelType: string;
    images: string[];
    registerNumber: string;
    insuranceExpDate: Date ;
    polutionExpDate: Date ;
    userDetails: IUserDetailsBikeSingle;
    offer:string | null;
    offerApplied:boolean | null;
    offerPrice:number | null;
}