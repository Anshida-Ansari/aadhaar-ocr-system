export interface IAadhaarData {
  aadhaarNumber?: string;
  name?: string;
  dob?: string;
  gender?: string;
  address?: string;
  pincode?: string;
}

export interface IAadhaarResponse {
  aadhaarNumber: string | null;
  name: string | null;
  dob: string | null;
  gender: string | null;
  address: string | null;
  pincode: string | null;
}
