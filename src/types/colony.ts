export interface Colony {
  id: number;
  name: string;
  location: string;
  estimated_cats: number;
  deleted_at?: string | null;
}

export type ColonyCreateRequest = Omit<Colony, 'id' | 'deleted_at'>;
export type ColonyUpdateRequest = Partial<ColonyCreateRequest>;
