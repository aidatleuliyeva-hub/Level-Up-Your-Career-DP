// F:\gopro\levelup-frontend\src\context\AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginUser, registerUser, getMe } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { id, email, full_name, role }
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  //    localStorage +    /me
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("currentUser");

    if (!savedToken || !savedUser) {
      setInitializing(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setToken(savedToken);

      //  
      getMe(savedToken)
        .catch(() => {
          //       
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          setUser(null);
          setToken(null);
        })
        .finally(() => {
          setInitializing(false);
        });
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      setUser(null);
      setToken(null);
      setInitializing(false);
    }
  }, []);

  const isAuthenticated = !!user && !!token;

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    // data = { user: {...}, token: "..." }
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(data.user));
    return data;
  };

  const register = async ({ email, password, fullName }) => {
    // :          student
    return registerUser({ email, password, fullName });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  };

  const value = {
    user,
    token,
    initializing,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
