import { useRequest } from "@shared/request/useRequest";
import { useAppDispatch } from "@store/hooks";
import { setUser } from "../../entities/user/model/userSlice";
import { useNavigate } from "react-router-dom";
import type { User } from "@shared/types/api";

interface RegisterValues {
  email: string;
  password: string;
  name: string;
  phone?: string;
}
interface RegisterResponse {
  success: boolean;
  user: User;
}

interface LoginResponse {
  success: boolean;
}

export const useAuth = () => {

const { request,loading } = useRequest();
const dispatch = useAppDispatch();
const navigate = useNavigate();


 const register = async (values: RegisterValues) => {
    const resp = await request<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        roles: ["User"], // или "Saler"
        state: "Active",
        createdAt: new Date().toISOString(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp?.success && resp?.user?.id) {
      dispatch(setUser(resp.user));
      navigate("/profile#info");
    } else {
      window.alert("Помилка під час реєстрації");
    }
  };

    const login = async (values: { email: string; password: string; }) => {

        try {
      const resp = await request<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp && resp.success) {
        await fetchUser();
      }
    } catch (error) {
      console.error("Login error:", error);
    }


  };

    async function logout() {
      await request("/api/auth/logout", {
        method: "POST",
      });
      fetchUser();
    }

   async function fetchUser() {
      const user = await request<User>("/api/auth/me");
      if (user) {
        dispatch(setUser(user));
      } else {
        console.log("Користувач не авторизований")
      }
    }

  return { login, loading, register, fetchUser ,logout};
};