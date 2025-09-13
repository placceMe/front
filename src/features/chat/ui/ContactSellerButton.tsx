// features/start-chat/ui/ContactSellerButton.tsx
import { useAppSelector } from "@store/hooks";
import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

type Props = {
  sellerId: string;              // userId продавца (обязателен)
  productId?: string;            // если бэкенд требует чат по товару — прокинь
  role?: "user" | "saler";       // на чей кабинет открывать (сейчас оба на /profile)
  className?: string;
  children?: React.ReactNode;    // чтобы текст не пропадал
};
/*
export function ContactSellerButton({
  sellerId,
  productId,
  role = "user",
  className,
  children = "Діалог з продавцем",
}: Props) {
  const navigate = useNavigate();
  const [sp] = useSearchParams();


    const user = useAppSelector(state => state.user.user);
  const buyerId = user?.id;


  const pid = useMemo(() => productId ?? sp.get("productId") ?? undefined, [productId, sp]);


 const start = async () => {
    if (!buyerId) { navigate("/login"); return; }

    const body: any = { sellerId, buyerId };
    if (pid) body.productId = pid;

   // features/start-chat/ui/ContactSellerButton.tsx
const resp = await fetch(`${__BASE_URL__}/api/chats`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ sellerId, buyerId, ...(pid ? { productId: pid } : {}) }),
});


    if (!resp.ok) {
      console.error("Create/Get chat failed:", await resp.text());
      return;
    }

    const chat = (await resp.json()) as { id: string };
    navigate(`/profile?chatId=${encodeURIComponent(chat.id)}#u-chat`);
  };
*/

export function ContactSellerButton({
  sellerId,
  productId,
  className,
  children = "Діалог з продавцем",
}: Props) {
  const navigate = useNavigate();
  const { id: productIdFromUrl } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const user = useAppSelector(state => state.user.user);
  const buyerId = user?.id;

  const finalProductId = useMemo(() => {
    if (productId) return productId;
    if (productIdFromUrl) return productIdFromUrl;
    return searchParams.get("productId") || null;
  }, [productId, productIdFromUrl, searchParams]);

  console.log("ContactSellerButton:", {
    sellerId,
    productId,
    productIdFromUrl,
    finalProductId,
    buyerId
  });

  const start = async () => {
    if (!buyerId) {
      navigate("/login");
      return;
    }

    if (!finalProductId) {
      console.warn("No productId available");
      alert("Не вдалося визначити товар для діалогу");
      return;
    }

    try {
      console.log("Making POST request to create chat");
      const payload: any = { sellerId, buyerId };
      if (finalProductId) payload.productId = finalProductId; 
      
     const resp = await fetch(`${__BASE_URL__}/api/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      console.log("Response status:", resp.status);

      if (!resp.ok) {
        const errorText = await resp.text();
        console.error("Create chat failed:", errorText);
        alert("Помилка створення чату");
        return;
      }

      const chat = await resp.json();
      console.log("Chat created/found:", chat);

      // Навигация в чат
      const targetUrl = `/profile?chatId=${encodeURIComponent(chat.id)}#u-chat`;
      console.log("Navigating to:", targetUrl);
      
      navigate(targetUrl);
      
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Помилка з'єднання з сервером");
    }
  };
  return (
    <button className={className} onClick={start}>
      {children}
    </button>
  );
}
