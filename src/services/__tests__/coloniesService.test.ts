import { coloniesService } from "../coloniesService";
import type { Colony, Visit, ApiResponse } from "../../types";
import httpManager from "../HttpManager";

jest.mock("../HttpManager", () => ({
  __esModule: true,
  default: {
    get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  },
  setOnUnauthorized: jest.fn(),
}));

const mockGet = httpManager.get as jest.Mock;
const mockPost = httpManager.post as jest.Mock;
const mockPut = httpManager.put as jest.Mock;
const mockDelete = httpManager.delete as jest.Mock;

describe("coloniesService", () => {
  afterEach(() => { jest.clearAllMocks(); });

  it("create: should create a colony", async () => {
    const mockColony: Colony = { id: 1, name: "Test", location: "Loc", estimated_cats: 10 };
    mockPost.mockResolvedValue({ data: { success: true, message: "OK", data: mockColony } });
    const result = await coloniesService.create({ name: "Test", location: "Loc", estimated_cats: 10 });
    expect(result).toEqual(mockColony);
    expect(mockPost).toHaveBeenCalledWith("/colonies/", expect.objectContaining({ name: "Test" }));
  });

  it("getAll: should return list of colonies", async () => {
    const mockColonies: Colony[] = [{ id: 1, name: "C1", location: "L1", estimated_cats: 5 }];
    mockGet.mockResolvedValue({ data: { success: true, message: "OK", data: mockColonies } });
    const result = await coloniesService.getAll();
    expect(result).toEqual(mockColonies);
    expect(result.length).toBe(1);
  });

  it("getById: should return single colony", async () => {
    const mockColony: Colony = { id: 1, name: "C1", location: "L1", estimated_cats: 5 };
    mockGet.mockResolvedValue({ data: { success: true, message: "OK", data: mockColony } });
    const result = await coloniesService.getById(1);
    expect(result).toEqual(mockColony);
    expect(mockGet).toHaveBeenCalledWith("/colonies/1");
  });

  it("update: should update and return colony", async () => {
    const updated: Colony = { id: 1, name: "Updated", location: "New", estimated_cats: 8 };
    mockPut.mockResolvedValue({ data: { success: true, message: "OK", data: updated } });
    const result = await coloniesService.update(1, { name: "Updated" });
    expect(result.name).toBe("Updated");
    expect(mockPut).toHaveBeenCalledWith("/colonies/1", { name: "Updated" });
  });

  it("delete: should delete and return message", async () => {
    mockDelete.mockResolvedValue({ data: { success: true, message: "Eliminada", data: null } });
    const result = await coloniesService.delete(1);
    expect(result).toBe("Eliminada");
    expect(mockDelete).toHaveBeenCalledWith("/colonies/1");
  });

  it("createVisit: should return ApiResponse with message", async () => {
    const mockVisit: Visit = { id: 1, colony_id: 1, date: "2026-09-29T10:00:00", cats_seen: 5, food_grams: 300 };
    mockPost.mockResolvedValue({ data: { success: true, message: "Visita registrada correctamente", data: mockVisit } });
    const result = await coloniesService.createVisit(1, { cats_seen: 5, food_grams: 300 });
    expect(result.message).toBe("Visita registrada correctamente");
    expect(result.data.cats_seen).toBe(5);
    expect(mockPost).toHaveBeenCalledWith("/colonies/1/visits", expect.any(Object));
  });
});
