import { useAppDispatch, useAppSelector } from "@store/hooks";
import { Select } from "antd";
import { setActiveRole } from "../../../entities/user/model/userSlice";

const ROLE_LABELS: Record<string, string> = {
  User: "Воїн",
  Saler: "Спорядник",
  
};

export const RoleSwitcher = () => {
  const roles = useAppSelector(state => state.user.user?.roles ?? []);
  const activeRole = useAppSelector(state => state.user.activeRole);
  const dispatch = useAppDispatch();

  if (!roles.length) return null;

  return (
    <Select
      value={activeRole}
      onChange={(val) => dispatch(setActiveRole(val))}
      style={{ width: 150 }}
      options={roles.map(role => ({
        value: role,
        label: ROLE_LABELS[role] || role,
      }))}
    />
  );
};
