import { authService } from "../authService";
import type { UserProfile, LoginResponse } from "../../types";
import httpManager from "../HttpManager";

jest.mock("../HttpManager", () => ({
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

describe("authService", () => {
  afterEach(() => { jest.clearAllMocks(); });

  describe("login", () => {
    it("should return LoginResponse with token", async () => {
      const mockResponse: LoginResponse = {
        success: true, message: "Login exitoso",
        data: { access_token: "fake-token", token_type: "bearer" },
      };
      mockPost.mockResolvedValue({ data: mockResponse });

      const result = await authService.login("test@test.com", "123456");

      expect(result.success).toBe(true);
      expect(result.data.access_token).toBe("fake-token");
      expect(mockPost).toHaveBeenCalledWith("/auth/login", { email: "test@test.com", password: "123456" });
    });
  });

  describe("me", () => {
    it("should return UserProfile", async () => {
      const mockUser: UserProfile = { id: 1, email: "test@test.com", is_active: true, is_superuser: false };
      const apiResponse = { success: true, message: "OK", data: mockUser };
      mockGet.mockResolvedValue({ data: apiResponse });

      const result = await authService.me();

      expect(result.id).toBe(1);
      expect(result.email).toBe("test@test.com");
      expect(mockGet).toHaveBeenCalledWith("/auth/me");
    });
  });
});
