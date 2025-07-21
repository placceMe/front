import { useAppSelector } from "@store/hooks";
import { ProfilePage } from "./ProfilePage/ui/ProfilePage";
import { AuthTabs } from "../widgets/AuthTabs";


export const CabinetPage = () => {
  const user = useAppSelector(state => state.user.user);

  return user ? <ProfilePage /> : <AuthTabs />;
};
