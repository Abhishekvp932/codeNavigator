import { api } from "./api";

export const Signup = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post("/api/user/signup", {
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
    const response = await api.post("/api/user/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const Logout = async()=>{
  try {
    const response = await api.get('/api/user/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
}