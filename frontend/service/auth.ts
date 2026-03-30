import { api } from "./api";

export const Signup = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/signup", {
      name,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const Login = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
