export interface VisitUser {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
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
}

export interface VisitRequest {
  cats_seen: number;
  food_grams: number;
  wet_food_cans?: number;
  notes?: string;
}
