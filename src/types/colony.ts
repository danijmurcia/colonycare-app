export interface Colony {
  id: number;
  name: string;
  location: string;
  estimated_cats: number;
}

export type ColonyCreateRequest = Omit<Colony, 'id'>;
export type ColonyUpdateRequest = Partial<ColonyCreateRequest>;
