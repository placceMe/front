import { Tabs } from "antd";
import { useLocation } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";

import RegistrationForm from "@widgets/RegistarationForm";
import OrdersTab from "@widgets/OrdersTab";
import { Wishlist } from "@pages/Wishlist";
import { ViewedProducts } from "@pages/ViewedProducts";
import { useAppSelector } from "@store/hooks";
import styles from "./CabinetTabs.module.css";
import { Chat } from "@features/chat";
import { UserOrders } from "@features/order/ui/UserOrders";

export const UserCabinet = ({ onMainChange }: { onMainChange: (v: boolean) => void }) => {
  const { user , activeRole} = useAppSelector(s => s.user);
  
  const loc = useLocation();
  const params = useMemo(() => new URLSearchParams(loc.search), [loc.search]);
  const chatIdFromUrl = params.get("chatId") ?? null;

/*const [activeKey, setActiveKey] = useState(() => {
  const h = window.location.hash.replace("#", "");
  // Если есть chatId в URL, приоритет у чата
  if (chatIdFromUrl) return "u-chat";
  return h || "u-info";
})


useEffect(() => {
  if (chatIdFromUrl && activeKey === "u-chat") {
    window.location.hash = "#u-chat";
  }
}, [chatIdFromUrl, activeKey]);
*/

 console.log("🏠 UserCabinet render");
  console.log("📍 Location:", loc.pathname, loc.search, loc.hash);
  console.log("💬 ChatId from URL:", chatIdFromUrl);

const [activeKey, setActiveKey] = useState(() => {
  const h = window.location.hash.replace("#", "");
  console.log("🔑 Initial hash:", h);
    console.log("🔑 Initial activeKey will be:", h || "u-info");
  return chatIdFromUrl ? "u-chat" : (h || "u-info");
});

useEffect(() => {
    console.log("🔄 useEffect triggered, chatIdFromUrl:", chatIdFromUrl);
    if (chatIdFromUrl) {
      console.log("✅ Setting activeKey to u-chat");
      setActiveKey("u-chat");
    }
  }, [chatIdFromUrl]);

  const onChange = (key: string) => {
    console.log("🔄 Tab changed to:", key);
    setActiveKey(key);
    window.location.hash = `#${key}`;
  };

  useEffect(() => {
    console.log("🏠 onMainChange called with:", activeKey === "u-info");
    onMainChange?.(activeKey === "u-info");
  }, [activeKey, onMainChange]);

  console.log("🎯 Current activeKey:", activeKey);
  
  const items = [
    { key: "u-info", label: "Контактна інформація", children: <RegistrationForm user={user!} /> },
    { key: "u-orders", label: "Історія замовлень", children:  <UserOrders/>},
    { key: "u-fav", label: "Список бажань", children: <Wishlist /> },
    { key: "u-viewed", label: "Переглянуті товари", children: <ViewedProducts /> },
        { 
      key: 'u-chat', 
      label: 'Чат', 
      children: <Chat roomId={user?.id!} activeRole={activeRole as "user" | "saler"} currentUserId={user?.id!} />, 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H6L4 22V6C4 4.89543 4.89543 4 6 4Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      ) 
    },
  ];
  return (
    <div className={styles.root}>
      <Tabs items={items} activeKey={activeKey} onChange={onChange} destroyOnHidden />
    </div>
  );
};
