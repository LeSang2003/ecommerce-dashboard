import { jwtDecode } from "jwt-decode";

// lấy token
export const getToken = () => {
    return localStorage.getItem("token");
};

// decode user từ token
export const getUser = () => {
    const token = getToken();
    if (!token) return null;

    try {
        return jwtDecode(token);
    } catch {
        return null;
    }
};

// check login
export const isAuthenticated = () => {
    return !!getToken();
};

export const hasRole = (role) => {
    const user = getUser();
    return user && user.role === role;
};

// logout
export const logout = () => {
    localStorage.removeItem("token");
};