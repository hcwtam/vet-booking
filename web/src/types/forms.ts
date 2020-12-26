import { OpeningHoursType } from './types';

export type OwnerSettingsData = {
  firstName: string;
  lastName: string;
};

export type ClinicSettingsData = {
  name: string;
  address: string;
  phone: string;
  contactEmail: string;
  animalTypes: string[];
  openingHours: OpeningHoursType[];
};

export type AddPetForm = {
  name: string;
  gender: string;
  desexed: string;
};

export type PetChangeForm = {
  name: string;
};

export type AddVetForm = {
  firstName: string;
  lastName: string;
  phone: string;
  clinicId: string;
  specialties: string[];
};

export type VetChangeForm = {
  firstName: string;
  lastName: string;
};

export type BookingChangeForm = {
  datetime: number;
};
