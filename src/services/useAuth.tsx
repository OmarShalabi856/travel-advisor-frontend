import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { loginAPI, registerAPI, refreshTokenAPI } from "./backend-api";
import { toast } from "react-toastify";
import axios from "axios";
import type { UserProfileToken } from "~/models/UserProfileToken";

type UserContextType = {
  user: UserProfileToken | null;
  accessToken: string | null;
  registerUser: (email: string, username: string, password: string, redirectTo?: string) => void;
  loginUser: (email: string, password: string, redirectTo?: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

export const UserContext = createContext<UserContextType>({
  user: null,
  accessToken: null,
  registerUser: () => {},
  loginUser: () => {},
  logout: () => {},
  isLoggedIn: () => false,
});

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfileToken | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("accessToken");
      const storedRefresh = localStorage.getItem("refreshToken");

      if (storedToken) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        setAccessToken(storedToken);
      }
      if (storedRefresh) setRefreshToken(storedRefresh);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (err) {
      localStorage.clear();
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      async err => {
        const originalRequest = err.config;
        if (err.response?.status === 401 && !originalRequest._retry && refreshToken) {
          originalRequest._retry = true;
          try {
            const res = await  refreshTokenAPI(refreshToken);
            const newAccessToken = res.data.accessToken;
            const newRefresh = res.data.refreshToken;

            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefresh);
            axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            setAccessToken(newAccessToken);
            setRefreshToken(newRefresh);
            console.log(`success refresh token ${res.data}`)
            return axios(originalRequest); 
          } catch (err) {
            logout();
            return Promise.reject(err);
          }
        }
        return Promise.reject(err);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [refreshToken]);

    const registerUser = async (email: string, username: string, password: string, redirectTo?: string) => {
    try {
      const res = await registerAPI(email, username, password);
      console.log(res)
      console.log(res?.data)
      if (res?.data?.user.accessToken && res.data.user.refreshToken) {
        const userObj = {
          userName: res.data.user.userName,
          email: res.data.user.email,
          accessToken: res.data.user.accessToken,
          userId: res.data.user.userId,
        };
        toast.success(res.data.message)
        localStorage.setItem("user", JSON.stringify(userObj));
        localStorage.setItem("accessToken", res.data.user.accessToken);
        localStorage.setItem("refreshToken", res.data.user.refreshToken);
        setAccessToken(res.data.user.accessToken);
        setRefreshToken(res.data.user.refreshToken);
        setUser(userObj);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.user.accessToken}`;
        setTimeout(() => navigate(redirectTo || "/"), 2000);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message;
        toast.error(`Register failed: ${msg}`);
      } else {
        console.error("Unexpected Register error:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  }; 


const loginUser = async (email: string, password: string, redirectTo?: string) => {
  try {
    const res = await loginAPI(email, password);

    if (res?.data?.accessToken && res.data.refreshToken) {
      const userObj = {
        userName: res.data.userName,
        email: res.data.email,
        accessToken: res.data.accessToken,
        userId: res.data.userId,
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      setAccessToken(res.data.accessToken);
      setRefreshToken(res.data.refreshToken);
      setUser(userObj);

      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
      toast.success("Login Success!");

      setTimeout(() => navigate(redirectTo || "/"), 2000);
    } else {
      toast.warning("Missing authentication tokens.");
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message || "Invalid credentials.";
      toast.error(`Login failed: ${msg}`);
    } else {
      console.error("Unexpected login error:", error);
      toast.error("An unexpected error occurred.");
    }
  }
}

  const logout = () => {
    localStorage.clear();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  const isLoggedIn = () => !!user;

  return (
    <UserContext.Provider value={{ user, accessToken, registerUser, loginUser, logout, isLoggedIn }}>
      {isReady ? children : <div>Loading...</div>}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
