import { getUser } from "../actions/user";
import { register } from "../actions/auth";
import { login, logout } from "../actions/auth";

export const loadUser = async () => {
  if (localStorage.crypto_token) {
    const user = await getUser();
    return user;
  }
};

export const signin = async (email, password) => {
  const token = await login(email, password);
  return token;
};

export const signout = () => {
  logout();
};

export const signup = async (email, password, password2) => {
  if (password !== password2) {
    return new Error("Passwords do not match");
  } else {
    return await register({ email, password });
  }
};
