export type ServiceCategory = 
  | 'todos'
  | 'trancas_soltas'
  | 'nago_tiara'
  | 'entrelace_crochet'
  | 'masculino'
  | 'retirada_dreads';

export interface ServiceOption {
  id: string;
  label: string;
  price: number;
  description?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  basePrice: number;
  description: string;
  details?: string;
  options?: ServiceOption[];
  featured?: boolean;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  selectedOption?: string;
  totalPrice: number;
  depositAmount: number;
  date: string;
  timeSlot: string;
  clientName: string;
  clientPhone: string;
  notes?: string;
  createdAt: string;
  pixVerified?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  serviceName: string;
}

export interface CareTip {
  id: string;
  title: string;
  question: string;
  answer: string;
  tip: string;
}

export type GalleryCategoryTag = 
  | 'Fulany Braids' 
  | 'Box Braids' 
  | 'Nagô & Tiaras' 
  | 'Crochet & Cachos' 
  | 'Linha Masculina';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: GalleryCategoryTag | string;
  imageUrl: string;
  description?: string;
  serviceTarget?: string;
  createdAt: string;
}

export interface AdminUser {
  email: string;
  name: string;
  token: string;
  role: 'owner';
  loggedInAt: string;
}
