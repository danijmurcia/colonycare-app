export interface Colony {
  id: number;
  name: string;
  location: string;
  estimated_cats: number;
  last_visit_date?: string | null;
  deleted_at?: string | null;
}

export type ColonyCreateRequest = Omit<Colony, 'id' | 'deleted_at' | 'last_visit_date'>;
export type ColonyUpdateRequest = Partial<ColonyCreateRequest>;
