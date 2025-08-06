import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setActiveRole, setUser } from "../../../entities/user/model/userSlice";
import { useRequest } from "@shared/request/useRequest";
//TODO Fix local to  global role
export const BecomeSellerButton = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const { request: baseRequest } = useRequest();

  const handleBecomeSeller = async () => {
    if (!user) return;

    let success = false;

    try {
      await baseRequest(`/api/users/make-saler`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });
      success = true;
    } catch {
      success = false;
    }

    if (success) {
      const updatedUser = {
        ...user,
        roles: [...new Set([...user.roles, "Saler"])],
      };
      dispatch(setUser(updatedUser));
      dispatch(setActiveRole("Saler"));
      window.location.hash = "#home";
    } else {
      alert("Не вдалося стати спорядником");
    }
  };

  return (
    <button
      className="bg-[#454E30] hover:bg-[#5a6b3b] text-white font-semibold py-2 px-4 rounded"
      onClick={handleBecomeSeller}
    >
      Стати спорядником
    </button>
  );
};
