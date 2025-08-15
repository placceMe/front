/*import React, { useState } from "react";
import { Card } from "antd";
import { RegisterForm } from "@features/auth/RegisterForm";
import { LoginForm } from "@features/auth/LoginForm ";


const BLUR_STYLE = {
  background: "rgba(229,229,216,0.7)",
  backdropFilter: "blur(14px)",
  border: "1px solid #3E4826",
};

interface AuthTabsProps {
  onSuccess?: () => void;
}

export const AuthTabs:React.FC<AuthTabsProps> = ({ onSuccess }) => {
  const [tab, setTab] = useState<"login" | "register">("login");

  const handleSuccess = () => {
    // При успехе можно либо закрыть модалку, либо переключиться на login
    setTab("login");
    onSuccess?.()
  };

  return (
    <div className="flex justify-center items-center min-h-[400px] m-10">
      <Card
        style={{
          ...BLUR_STYLE,
          width: 410,
          borderRadius: 18,
          boxShadow: "0 8px 32px rgba(62, 72, 38, 0.07)",
        }}
      >
        <div className="flex mb-6">
          <button
            className={`text-lg font-bold mr-8 transition 
              ${tab === "login" ? "text-[#425024]" : "text-[#7A808D] opacity-60"}`}
            onClick={() => setTab("login")}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              padding: 0,
              outline: "none",
            }}
          >
            Вхід
            {tab === "login" && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -4,
                  height: 3,
                  background: "#425024",
                  borderRadius: 2,
                  width: "100%",
                  display: "block",
                }}
              />
            )}
          </button>
          <button
            className={`text-lg font-bold transition
              ${tab === "register" ? "text-[#425024]" : "text-[#7A808D] opacity-60"}`}
            onClick={() => setTab("register")}
            style={{
              position: "relative",
              background: "none",
              border: "none",
              padding: 0,
              outline: "none",
            }}
          >
            Реєстрація
            {tab === "register" && (
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -4,
                  height: 3,
                  background: "#425024",
                  borderRadius: 2,
                  width: "100%",
                  display: "block",
                }}
              />
            )}
          </button>
        </div>
        <div>
          {tab === "login" ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} />
          )}
        </div>
      </Card>
    </div>
  );
};
*/
import React, { useEffect, useState } from "react";
import { RegisterForm } from "@features/auth/RegisterForm";
import { LoginForm } from "@features/auth/LoginForm ";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@store/hooks";


interface AuthTabsProps {
  onSuccess?: () => void;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({ onSuccess }) => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector(s => s.user.user);

   useEffect(() => {
    if (pendingRedirect && user?.id) {
      setPendingRedirect(false);
      // важно: модалка уже закрылась onSuccess из формы
      setTimeout(() => navigate("/profile#info"), 0);
    }
  }, [pendingRedirect, user?.id, navigate]);

  const handleSuccess = () => {
     onSuccess?.();              // закрываем модалку
    setPendingRedirect(true);   // ждём появление user в Redux
    setTab("login"); 
  };

  return (
    <div
      className="p-4 sm:p-6 rounded-lg w-full mx-auto"
      style={{
        background: "rgba(229,229,216,0.9)",
        backdropFilter: "blur(14px)",
        border: "1px solid #3E4826",
        borderRadius: 18,
        boxShadow: "0 8px 32px rgba(62, 72, 38, 0.2)",
        //maxWidth: tab === "register" ? "1400px" : "500px", // Ограничиваем сверху
        minWidth: "100%",
maxWidth: tab === "register" ? "100%" : "100%",
      }}
    >
      {/* Табы */}
      <div className="flex mb-6 justify-center flex-wrap gap-2">
        <button
          className={`text-lg font-bold mr-0 sm:mr-8 transition px-4 py-2
            ${tab === "login" ? "text-[#425024]" : "text-[#7A808D] opacity-60"}`}
          onClick={() => setTab("login")}
          style={{
            position: "relative",
            background: "none",
            border: "none",
            outline: "none",
          }}
        >
          Вхід
          {tab === "login" && (
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -4,
                height: 3,
                background: "#425024",
                borderRadius: 2,
                width: "100%",
                display: "block",
              }}
            />
          )}
        </button>
        <button
          className={`text-lg font-bold transition px-4 py-2
            ${tab === "register" ? "text-[#425024]" : "text-[#7A808D] opacity-60"}`}
          onClick={() => setTab("register")}
          style={{
            position: "relative",
            background: "none",
            border: "none",
            outline: "none",
          }}
        >
          Реєстрація
          {tab === "register" && (
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -4,
                height: 3,
                background: "#425024",
                borderRadius: 2,
                width: "100%",
                display: "block",
              }}
            />
          )}
        </button>
      </div>

      {/* Содержимое */}
      <div>
        {tab === "login" ? (
          <LoginForm onSuccess={handleSuccess} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
};
