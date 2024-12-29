import { jwtDecode } from "jwt-decode";

export const getInitialAuthState = () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      // Vérifier si le token n'est pas expiré
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return {
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        };
      }
      return {
        user: decodedToken,
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    }
  } catch (error) {
    localStorage.removeItem("token");
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};
