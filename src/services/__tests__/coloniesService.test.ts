import { coloniesService } from '../coloniesService';
import type { Colony, Visit, ApiResponse } from '../../types';
import httpManager from '../HttpManager';

jest.mock('../HttpManager', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  },
  setOnUnauthorized: jest.fn(),
}));

const mockGet = httpManager.get as jest.Mock;
const mockPost = httpManager.post as jest.Mock;

describe('coloniesService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a colony and return it', async () => {
      const mockColony: Colony = { id: 1, name: 'Test Colony', location: 'Calle 5', estimated_cats: 10 };
      const apiResponse: ApiResponse<Colony> = { success: true, message: 'Colonia creada', data: mockColony };
      mockPost.mockResolvedValue({ data: apiResponse });

      const result = await coloniesService.create({ name: 'Test Colony', location: 'Calle 5', estimated_cats: 10 });

      expect(result).toEqual(mockColony);
      expect(mockPost).toHaveBeenCalledWith('/colonies/', expect.objectContaining({ name: 'Test Colony' }));
    });
  });

  describe('getAll', () => {
    it('should return list of colonies', async () => {
      const mockColonies: Colony[] = [
        { id: 1, name: 'Colony 1', location: 'Loc 1', estimated_cats: 5 },
        { id: 2, name: 'Colony 2', location: 'Loc 2', estimated_cats: 8 },
      ];
      const apiResponse: ApiResponse<Colony[]> = { success: true, message: 'OK', data: mockColonies };
      mockGet.mockResolvedValue({ data: apiResponse });

      const result = await coloniesService.getAll();

      expect(result).toEqual(mockColonies);
      expect(result.length).toBe(2);
    });
  });

  describe('createVisit', () => {
    it('should create a visit and return ApiResponse with message', async () => {
      const mockVisit: Visit = { id: 1, colony_id: 1, date: '2026-09-29T10:00:00', cats_seen: 5, food_grams: 300 };
      const apiResponse: ApiResponse<Visit> = { success: true, message: 'Visita registrada correctamente', data: mockVisit };
      mockPost.mockResolvedValue({ data: apiResponse });

      const result = await coloniesService.createVisit(1, { cats_seen: 5, food_grams: 300 });

      expect(result.message).toBe('Visita registrada correctamente');
      expect(result.data.cats_seen).toBe(5);
      expect(mockPost).toHaveBeenCalledWith('/colonies/1/visits', expect.any(Object));
    });
  });
});
