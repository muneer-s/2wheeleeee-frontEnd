interface IAdminUserDetails {
  name: string;
}

export interface IAdminBikeData {
  _id: string;
  companyName: string;
  modelName: string;
  rentAmount: number | string;
  images: string[];
  insuranceExpDate: Date | string;
  polutionExpDate: Date | string;
  userDetails: IAdminUserDetails;
  isHost: boolean;
}


export interface IAdminUser {
  isBlocked: boolean;
  isUser: boolean;
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  profile_picture: string | null;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  profile_picture: string | null;
  address: string;
  phoneNumber: number;
  isBlocked: boolean;
  isUser: boolean;
  isVerified: boolean;
  license_picture_front: string;
  license_picture_back: string;
}