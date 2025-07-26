import { useAppDispatch } from "@store/hooks";
import { setUser } from "../../entities/user/model/userSlice";
import { useEffect } from "react";


export const SessionInit = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch(setUser(JSON.parse(user)));
    }
  }, [dispatch]);

  return null;
};
