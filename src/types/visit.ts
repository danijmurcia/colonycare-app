export interface VisitUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface VisitPhoto {
  id: number;
  visit_id: number;
  photo_key: string;
  photo_url?: string;
  created_at: string;
}

export interface Visit {
  id: number;
  colony_id: number;
  user_id?: number;
  user?: VisitUser;
  date: string;
  cats_seen: number;
  food_grams: number;
  wet_food_cans?: number;
  notes?: string;
  photos?: VisitPhoto[];
}

export interface VisitRequest {
  cats_seen: number;
  food_grams: number;
  wet_food_cans?: number;
  notes?: string;
}

export interface UserStats {
  total_visits: number;
  total_colonies: number;
  most_visited: { name: string; count: number } | null;
  last_visit: { date: string; colony: string } | null;
}
