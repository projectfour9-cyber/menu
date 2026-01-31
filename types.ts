
export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  dietaryTags: string[];
  imageUrl?: string;
}

export interface MenuSection {
  id?: string;
  category: string;
  items: MenuItem[];
}

export interface CategoryCounts {
  appetizers: number;
  mains: number;
  liveStations: number;
  sides: number;
  desserts: number;
  beverages: number;
}

export interface GeneratedMenu {
  id?: string;
  title: string;
  eventDescription: string;
  sections: MenuSection[];
  winePairing: string;
  chefsNotes: string;
  vibeDescription: string;
  cuisineRegion?: string;
}

export interface MenuPreferences {
  eventName: string;
  clientName: string;
  eventType: string;
  date: string;
  guestCount: string;
  cuisines: string[];
  composition: CategoryCounts;
  internalNotes: string;
  budgetLevel: 'budget' | 'standard' | 'premium' | 'luxury';
}

export interface UserProfile {
  id: string;
  role: 'admin' | 'staff';
  email: string;
}
