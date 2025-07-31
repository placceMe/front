import { useRequest } from "@shared/request/useRequest";
import { useAppDispatch } from "@store/hooks";
import { setUser } from "../../entities/user/model/userSlice";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {

const { request,loading } = useRequest();
const dispatch = useAppDispatch();
const navigate = useNavigate();


 const register = async (values: any) => {
    const resp = await request("/api/auth/register", {
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
      const resp = await request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.success) {
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
      const user = await request("/api/auth/me");
      if (user) {
        dispatch(setUser(user));
      } else {
      }
    }

  return { login, loading, register, fetchUser ,logout};
};