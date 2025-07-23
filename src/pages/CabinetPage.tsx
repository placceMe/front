import { useAppSelector } from "@store/hooks";
import { ProfilePage } from "./ProfilePage/ui/ProfilePage";
import { AuthTabs } from "../widgets/AuthTabs";
import { CabinetLayout } from "../app/layouts/CabinetLayout";


export const CabinetPage = () => {
  const user = useAppSelector(state => state.user.user);

  return user ? <CabinetLayout /> : <AuthTabs />;
};
