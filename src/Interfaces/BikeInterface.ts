export interface BikeData {
  _id: string;
  companyName: string;
  modelName: string;
  rentAmount: number | string;
  fuelType: string;
  images: File[];
  registerNumber: string;
  insuranceExpDate: Date | string;
  polutionExpDate: Date | string;
  rcImage: File | null;
  insuranceImage: File | null;
  PolutionImage: File | null;
  isHost: boolean;
  userId: string;
}