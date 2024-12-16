export interface BikeData {
    companyName: string;
    modelName: string; 
    rentAmount: number | string; 
    fuelType: string; 
    images: File[]; 
    registerNumber: string; 
    insuranceExpDate: Date | string; 
    pollutionExpDate: Date | string; 
    rcImage: File | null; 
    insuranceImage: File | null; 
  }
  