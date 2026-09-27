export type AuthContextType = {
  isLoggedIn: boolean;
  email: string;
  login: (email: string, password: string) => void;
  logout: () => void;
};
