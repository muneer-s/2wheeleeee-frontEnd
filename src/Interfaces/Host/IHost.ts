export interface IBike {
    _id: string;
    companyName: string;
    modelName: string;
    images: string[];
    registerNumber: string;
    fuelType: string;
    rentAmount: number;
    insuranceExpDate: Date;
    polutionExpDate: Date;
    rcImage: string;
    insuranceImage: string;
    PolutionImage: string;
    isHost: boolean;
    isEdit: boolean
}