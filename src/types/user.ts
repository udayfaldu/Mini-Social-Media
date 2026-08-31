export interface UserAddress {
  address: string;
  city: string;
  state: string;
  country?: string;
  postalCode?: string;
}

export interface UserCompany {
  name: string;
  title: string;
  department: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate?: string;
  image: string;
  bloodGroup?: string;
  height?: number;
  weight?: number;
  eyeColor?: string;
  hair?: {
    color: string;
    type: string;
  };
  address?: UserAddress;
  company?: UserCompany;
  role?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}
