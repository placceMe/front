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

/*
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setActiveRole } from "../../../entities/user/model/userSlice";
import { Button } from "antd";
import { useEffect, useMemo, useState, KeyboardEvent } from "react";
import armorImg from "../../../shared/assets/icons/armor.svg";
import soldierImg from "../../../shared/assets/icons/soldier.svg";

const ROLE_LABELS: Record<string, string> = {
  User: "Воїн",
  Saler: "Спорядник",
};

type Role = "User" | "Saler";

export const RoleSwitcher = () => {
  const roles = useAppSelector((s) => (s.user.user?.roles ?? []) as Role[]);
  const activeRole = useAppSelector((s) => s.user.activeRole as Role | undefined);
  const dispatch = useAppDispatch();

  // вибираємо актуальне значення для старту
  const initial = useMemo<Role | undefined>(() => activeRole ?? roles[0], [activeRole, roles]);
  const [selected, setSelected] = useState<Role | undefined>(initial);

  useEffect(() => {
    setSelected(initial);
  }, [initial]);

  if (!roles.length) return null;

  const cards: Array<{ role: Role; title: string; subtitle: string; img: string }> = [
    { role: "Saler", title: "Я продаю спорядження", subtitle: "Стати спорядником", img: armorImg },
    { role: "User", title: "Я купую спорядження", subtitle: "Увійти як воїн", img: soldierImg },
  ].filter(c => roles.includes(c.role));

  const onKey = (e: KeyboardEvent<HTMLDivElement>, role: Role) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelected(role);
    }
    // стрілки перемикання
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const idx = cards.findIndex(c => c.role === (selected ?? cards[0].role));
      setSelected(cards[(idx + 1) % cards.length].role);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const idx = cards.findIndex(c => c.role === (selected ?? cards[0].role));
      setSelected(cards[(idx - 1 + cards.length) % cards.length].role);
    }
  };

  const confirm = () => selected && dispatch(setActiveRole(selected));

  return (
    <div className="px-4 sm:px-6 md:px-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#2E3116] mb-4 sm:mb-6">Оберіть:</h2>

    
      <div
        role="radiogroup"
        aria-label="Вибір ролі"
        className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4"
      >
        {cards.map(({ role, title, subtitle, img }) => {
          const active = selected === role;
          return (
            <div
              key={role}
              role="radio"
              aria-checked={active}
              tabIndex={0}
              onKeyDown={(e) => onKey(e, role)}
              onClick={() => setSelected(role)}
              className={[
                "group flex items-center sm:items-start gap-3 sm:gap-4",
                "p-3 sm:p-4 min-h-[56px] sm:min-h-[72px]",
                "rounded-xl border transition-all cursor-pointer select-none",
                active
                  ? "bg-[#E5E5D8] border-[#3E4826] shadow-[0_0_0_2px_rgba(62,72,38,0.15)]"
                  : "bg-[#F7F7EF] border-[#C9C9B0] hover:border-[#8D8C5F]",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8D8C5F]"
              ].join(" ")}
            >
              <img
                src={img}
                alt=""
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain flex-shrink-0"
                loading="eager"
              />
              <div className="flex-1">
                <div className="text-[#2E3116] font-semibold text-base sm:text-lg leading-tight">
                  {title}
                </div>
                <div className="text-[#4b4b3a] text-xs sm:text-sm mt-0.5">{subtitle}</div>
              </div>
              <div
                className={[
                  "ml-2 w-6 h-6 rounded-full border flex items-center justify-center",
                  active ? "bg-[#3E4826] border-[#3E4826]" : "border-[#8D8C5F]"
                ].join(" ")}
                aria-hidden
              >
                {active && (
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-white">
                    <path fill="currentColor" d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.29 7.71l-1.41-1.41z"/>
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>


      <div className="mt-5 sm:mt-6">
        <Button
          type="primary"
          block                           // на мобайлі повна ширина
          className="!bg-[#3E4826] !border-[#3E4826] hover:!bg-[#30381f] hover:!border-[#30381f] 
                     h-11 sm:h-12 text-base sm:text-lg rounded-xl"
          onClick={confirm}
          disabled={!selected}
        >
          Продовжити
        </Button>
      </div>

 
      {selected && (
        <p className="text-center text-sm text-[#4b4b3a] mt-3">
          Обрана роль: <span className="font-semibold">{ROLE_LABELS[selected]}</span>
        </p>
      )}
    </div>
  );
};
*/