export type UserType = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userType: string;
};

export type PetType = {
  id: number;
  name: string;
  animalType: string;
  birthDate?: string;
  gender: string;
  desexed: boolean;
  illnesses: string[];
};

export type OpeningHoursType = {
  dayOfWeek: number;
  startTime: string;
  breakStartTime?: string;
  breakEndTime?: string;
  endTime: string;
};

export type ClinicType = {
  id: string;
  name?: string;
  address?: string;
  phone?: string;
  contactEmail?: string;
  animalTypes?: string[];
  openingHours?: OpeningHoursType[];
};

export type VetType = {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  specialties?: string[];
  schedule: OpeningHoursType[];
};