import React, { useState } from "react";
import { Card } from "antd";
import { RegisterForm } from "@features/auth/RegisterForm";
import { LoginForm } from "@features/auth/LoginForm ";


const BLUR_STYLE = {
  background: "rgba(229,229,216,0.7)",
  backdropFilter: "blur(14px)",
  border: "1px solid #3E4826",
};

export const AuthTabs = () => {
  const [tab, setTab] = useState<"login" | "register">("login");

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
      ${tab === "login"
        ? "text-[#425024]"
        : "text-[#7A808D] opacity-60"}`}
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
              ${tab === "register"
                ? "text-[#425024]"
                : "text-[#7A808D] opacity-60"}`}
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
          {tab === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </Card>
    </div>
  );
};
