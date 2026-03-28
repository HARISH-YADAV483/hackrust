import axiosInstance from "./axiosInstance";

export const register = async (data) => {
  const res = await axiosInstance.post("/auth/register", data);
  return res.data;
};

export const login = async (data) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("userInfo");
};