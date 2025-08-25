/*import React, { useEffect, useMemo, useRef, useState } from "react";
import { AutoComplete, Input } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { useNavigate } from "react-router-dom";
import { useRequest } from "@shared/request/useRequest";
import type { Product } from "@shared/types/api";

type Props = {
  className?: string;           // чтобы повесить твой .search-input
  size?: "small" | "middle" | "large";
  minLen?: number;              // с какой длины искать
  debounceMs?: number;
  maxItems?: number;
};

export const SearchBox: React.FC<Props> = ({
  className,
  size = "middle",
  minLen = 2,
  debounceMs = 300,
  maxItems = 8,
}) => {
  const { request } = useRequest();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [options, setOptions] = useState<DefaultOptionType[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  const buildImg = (url?: string) =>
    !url ? "" : url.startsWith("http") ? url : `/api/files/${url}`;

  const toOptions = (list: Product[]): DefaultOptionType[] =>
    list.slice(0, maxItems).map((p) => ({
      value: p.id,                      // что прилетит в onSelect
      label: (
        <div className="flex items-center gap-3">
          {p.mainImageUrl && (
            <img
              src={buildImg(p.mainImageUrl)}
              alt=""
              className="h-8 w-8 object-cover rounded"
              onError={(e) => ((e.currentTarget.style.display = "none"))}
            />
          )}
          <div className="flex-1">
            <div className="text-[#2b2b1a] text-sm font-medium">{p.title}</div>
            {!!p.price && (
              <div className="text-[#5c5c3e] text-xs">{p.price} ₴</div>
            )}
          </div>
        </div>
      ),
    }));

  const fetchData = async (query: string) => {
    if (query.trim().length < minLen) {
      setOptions([]);
      setOpen(false);
      return;
    }
    const res = await request<any>(`/api/products/search?query=${encodeURIComponent(query.trim())}`);
    const items: Product[] = Array.isArray(res) ? res : (res?.products ?? []); // обе схемы
    setOptions(toOptions(items));
    setOpen(true);
  };

  // debounce
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => fetchData(q), debounceMs) as unknown as number;
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <AutoComplete
      className={className}
      options={options}
      open={open}
      onDropdownVisibleChange={setOpen}
      onSelect={(value) => {
        setOpen(false);
        navigate(`/product/${value}`);
      }}
      // чтобы Enter искал по общей странице результатов:
      onSearch={(val) => setQ(val)}
      dropdownMatchSelectWidth
      style={{ width: "100%" }}
    >
      <Input.Search
        size={size}
        placeholder="Пошук"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onPressEnter={() => {
          if (!q.trim()) return;
          setOpen(false);
          navigate(`/search?query=${encodeURIComponent(q.trim())}`);
        }}
        allowClear
      />
    </AutoComplete>
  );
};
*/




/*

import React, { useEffect, useRef, useState } from "react";
import { Button, Dropdown, Drawer, Grid, Input, List, Skeleton, Typography, Divider, Tag, type InputRef } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Product } from "@shared/types/api";
import { useRequest } from "@shared/request/useRequest";

const { Title, Text } = Typography;

const FILES_BASE_URL = `${__BASE_URL__}/api/files/`;
const buildImg = (u?: string) => (!u ? "" : u.startsWith("http") ? u : FILES_BASE_URL + u);
const toUA = (n?: number) => (typeof n === "number" ? n.toLocaleString("uk-UA") : "");

// Підказки (редагуй як треба)
const SEARCH_PRESETS_UA = [
  "шолом","футболка","бронежилети",
  "тактичне взуття","берці","бронежилети","плитоноски","бойові плити",
"активні навушники",
];

type SearchApiResponse =
  | Product[]
  | {
      products?: Product[];
      pagination?: { totalItems: number; pageSize: number; totalPages: number };
    };

type Props = {
  placeholder?: string;
  size?: "small" | "middle" | "large";
  debounceMs?: number;
  minLen?: number;
  panelWidth?: number;
  className?: string;
};

export const SearchBox: React.FC<Props> = ({
  placeholder = "Пошук",
  size = "large",
  debounceMs = 300,
  minLen = 2,
  panelWidth = 960,
  className,
}) => {
  const { request } = useRequest();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);    // desktop dropdown
  const [openM, setOpenM] = useState(false);  // mobile drawer
  const [manuallyOpened, setManuallyOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const openerRef = useRef<InputRef>(null!);

  // ===== Самопишущийся placeholder (без мигания "Пошук") =====
  const [ph, setPh] = useState(placeholder);
  const TYPE_SPEED = 420;
  const ERASE_SPEED = 140;
  const PAUSE_AFTER_TYPED = 1500;
  const PAUSE_AFTER_CLEARED = 600;

  useEffect(() => {
    if (q.trim().length > 0) { setPh(placeholder); return; }
    const words = SEARCH_PRESETS_UA;
    let w = 0, i = 0, deleting = false;
    let t: number | undefined;
    let mounted = true;

    const run = () => {
      if (!mounted) return;
      const word = words[w];
      if (!deleting) {
        setPh(word.slice(0, i + 1));
        i++;
        if (i === word.length) { deleting = true; t = window.setTimeout(run, PAUSE_AFTER_TYPED); return; }
        t = window.setTimeout(run, TYPE_SPEED);
      } else {
        setPh(i > 1 ? word.slice(0, i - 1) : "");
        i--;
        if (i === 0) { deleting = false; w = (w + 1) % words.length; t = window.setTimeout(run, PAUSE_AFTER_CLEARED); return; }
        t = window.setTimeout(run, ERASE_SPEED);
      }
    };

    t = window.setTimeout(run, PAUSE_AFTER_CLEARED);
    return () => { mounted = false; if (t) window.clearTimeout(t); };
  }, [q, placeholder]);

  // ===== Загрузка результатов (НИКОГДА не открываем тут панель) =====
  const tmr = useRef<number | null>(null);
  const fetchData = async (query: string) => {
    if (query.trim().length < (minLen ?? 2)) { setItems([]); setTotal(0); return; }
    setLoading(true);
    try {
      const res: SearchApiResponse = await request<any>(
        `/api/products/search?query=${encodeURIComponent(query.trim())}`
        
      );

      console.log("[SearchBox] raw search res ->", res);
      const listRaw = Array.isArray(res) ? res : (res.products ?? []);

// НОРМАЛИЗУЕМ id: id/productId/Id
const list = listRaw.map((x: any) => ({
  ...x,
  id: x?.id ?? x?.productId ?? x?.productID ?? x?.Id ?? null,
}));

setItems(list);

const tot =
  (!Array.isArray(res) && res.pagination?.totalItems) ||
  (Array.isArray(res) ? res.length : list.length);
setTotal(Number(tot || 0));
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (tmr.current) window.clearTimeout(tmr.current);
    tmr.current = window.setTimeout(() => fetchData(q), debounceMs) as unknown as number;
    return () => { if (tmr.current) window.clearTimeout(tmr.current); };
  }, [q, debounceMs]);

  const ProductRow: React.FC<{ p: Product }> = ({ p }) => (
    <div
      className="flex items-center gap-3 py-2 px-1 rounded cursor-pointer hover:bg-[#f7f7ef]"
      onClick={() => { 
        // >>> ЛОГИРУЕМ, ЧТО И КУДА ПЕРЕДАЁМ
      const dest = `/product/${encodeURIComponent(String(p?.id))}`;
      console.log("[SearchBox] item click ->", {
        id: p?.id,
        title: p?.title,
        navigateTo: dest,
      });

      if (!p?.id) {
        console.warn("[SearchBox] Missing product id for navigation:", p);
        return; // не идём, если id нет
      }
        isMobile ? setOpenM(false) : setOpen(false); navigate(`/product/${p.id}`); }}
    >
      {p.mainImageUrl ? (
        <img
          src={buildImg(p.mainImageUrl)}
          alt=""
          style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6 }}
          onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/placeholder.png")}
        />
      ) : <div style={{ width: 44, height: 44 }} />}
      <div className="flex-1 min-w-0"><div className="truncate text-[13px] text-[#222]">{p.title}</div></div>
      {typeof p.price === "number" && <div className="ml-2 whitespace-nowrap text-[13px] font-semibold">{toUA(p.price)} грн</div>}
    </div>
  );

  // ===== Контент панели =====
  const qLen = q.trim().length;
  const PanelContent = (
    <div className="bg-white" style={{ width: isMobile ? "100%" : panelWidth, maxWidth: "100vw" }}>
    
      <div className="px-3 pt-3">
        <div style={{ display: "flex", gap: 8, flexWrap: "nowrap", overflow: "hidden" }}>
          {SEARCH_PRESETS_UA.map((s) => (
            <Tag
              key={s}
              bordered={false}
              style={{
                background: "#f3f3ea",
                border: "1px solid #e0e0d0",
                color: "#3E4826",
                borderRadius: 9999,
                padding: "2px 10px",
                cursor: "pointer",
                userSelect: "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#E6F0D6"; e.currentTarget.style.borderColor = "#3E4826"; e.currentTarget.style.color = "#2d3620"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f3ea"; e.currentTarget.style.borderColor = "#e0e0d0"; e.currentTarget.style.color = "#3E4826"; }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setQ(s)}
            >
              {s}
            </Tag>
          ))}
        </div>
      </div>

      <Divider style={{ margin: "8px 0" }} />

   
      <div className="px-3 pb-3">
        <div className="flex items-baseline justify-between">
          <Title level={5} style={{ margin: 0 }}>
            Результати пошуку {qLen >= (minLen ?? 2) && total ? <Text type="secondary">({total})</Text> : null}
          </Title>
          {!isMobile && qLen >= (minLen ?? 2) && (
            <Button
              type="link"
              size="small"
              onClick={() => { isMobile ? setOpenM(false) : setOpen(false); navigate(`/search?query=${encodeURIComponent(q.trim())}`); }}
            >
              Усі товари
            </Button>
          )}
        </div>

        {qLen < (minLen ?? 2) ? (
          <div className="py-2 text-[13px] text-[#777]">Можливо ви шукали — оберіть підказку вище</div>
        ) : loading ? (
          <List
            dataSource={[...Array(5).keys()]}
            renderItem={() => (
              <List.Item style={{ paddingLeft: 0 }}>
                <Skeleton avatar active title={false} paragraph={{ rows: 1, width: "80%" }} />
              </List.Item>
            )}
          />
        ) : items.length ? (
          <List
            dataSource={items.slice(0, isMobile ? 6 : 10)}
            renderItem={(p) => (
              <List.Item style={{ paddingLeft: 0 }}>
                <ProductRow p={p} />
              </List.Item>
            )}
          />
        ) : (
          manuallyOpened && <div className="py-2 text-[13px] text-[#777]">Нічого не знайдено</div>
        )}

        {qLen >= (minLen ?? 2) && (
          <div className="pt-2">
            <Button
              type="primary"
              block
              onClick={() => { isMobile ? setOpenM(false) : setOpen(false); navigate(`/search?query=${encodeURIComponent(q.trim())}`); }}
            >
              Усі товари
            </Button>
          </div>
        )}

        {isMobile && (qLen < (minLen ?? 2) || (!loading && items.length === 0)) && (
          <div className="pt-2">
            <Button block onClick={() => { setOpenM(false); navigate("/"); }}>
              На головну
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // ===== Desktop input =====
  const DesktopInput = (
    <Input
      size={size}
      placeholder={ph}
      prefix={<SearchOutlined />}
      value={q}
      onChange={(e) => setQ(e.target.value)}
      onFocus={() => { setManuallyOpened(true); setOpen(true); }}
      onPressEnter={() => {
        if (!q.trim()) return;
        setOpen(false);
        navigate(`/search?query=${encodeURIComponent(q.trim())}`);
      }}
      allowClear
      className={className}
    />
  );

  // ===== Mobile opener (readOnly), чтобы не ловить повторный фокус =====

  const MobileOpener = (
    <div onClick={() => { setManuallyOpened(true); setOpenM(true); }}>
      <Input
        ref={openerRef}
        size={size}
        placeholder={ph}
        prefix={<SearchOutlined />}
        readOnly
        className={className}
      />
    </div>
  );

  // ===== Render =====
  return isMobile ? (
    <>
      {MobileOpener}
      <Drawer
        open={openM}
        onClose={() => { setOpenM(false); openerRef.current?.blur(); }}
        placement="top"
        height="100vh"
        bodyStyle={{ padding: 0 }}
        destroyOnHidden
        maskClosable
        keyboard
      >
       
        <div style={{ position: "sticky", top: 0, zIndex: 1, background: "#fff", padding: 12, borderBottom: "1px solid #eee" }}>
          <Input
            size={size}
            placeholder={ph}
            prefix={<SearchOutlined />}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onPressEnter={() => {
              if (!q.trim()) return;
              setOpenM(false);
              navigate(`/search?query=${encodeURIComponent(q.trim())}`);
            }}
            allowClear
          />
        </div>

        {PanelContent}
      </Drawer>
    </>
  ) : (
    <Dropdown
      open={open}
      dropdownRender={() => PanelContent}
      onOpenChange={setOpen}
      placement="bottom"
      trigger={["click"]}
    >
      <div className="w-full">{DesktopInput}</div>
    </Dropdown>
  );
};
*/
import React, { useEffect, useRef, useState } from "react";
import {
  Button, Dropdown, Drawer, Grid, Input, List,
  Skeleton, Typography, Divider, Tag, type InputRef, message
} from "antd";
import { SearchOutlined, AudioOutlined, AudioMutedOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { Product } from "@shared/types/api";
import { useRequest } from "@shared/request/useRequest";

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

const { Title, Text } = Typography;

const FILES_BASE_URL = `${__BASE_URL__}/api/files/`;
const buildImg = (u?: string) => (!u ? "" : u.startsWith("http") ? u : FILES_BASE_URL + u);
const toUA = (n?: number) => (typeof n === "number" ? n.toLocaleString("uk-UA") : "");

// Підказки
const SEARCH_PRESETS_UA = [
  "шолом", "футболка", "бронежилети",
  "тактичне взуття", "берці", "плитоноски", "бойові плити",
  "активні навушники",
];

type SearchApiResponse =
  | Product[]
  | {
      products?: Product[];
      pagination?: { totalItems: number; pageSize: number; totalPages: number };
    };

type Props = {
  placeholder?: string;
  size?: "small" | "middle" | "large";
  debounceMs?: number;
  minLen?: number;
  panelWidth?: number;
  className?: string;
};

export const SearchBox: React.FC<Props> = ({
  placeholder = "Пошук",
  size = "large",
  debounceMs = 300,
  minLen = 2,
  panelWidth = 960,
  className,
}) => {
  const { request } = useRequest();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);    // desktop dropdown
  const [openM, setOpenM] = useState(false);  // mobile drawer
  const [manuallyOpened, setManuallyOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const openerRef = useRef<InputRef>(null!);

  // ===== Микрофон: прогрев и управление =====
  const streamRef = useRef<MediaStream | null>(null);
  const warmupMic = async () => {
    if (!navigator.mediaDevices?.getUserMedia || streamRef.current) return;
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {/* отказ — покажем в onerror */ }
  };
  const releaseMic = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  // ==== Голосовий пошук ====
  const recRef = useRef<any>(null);
  const [isListening, setIsListening] = useState(false);
  const supportsSR = !!(typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition));

  useEffect(() => {
    if (!supportsSR) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "uk-UA";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = true; // слушать дольше — на мобилках стабильнее

    rec.onstart = () => setIsListening(true);
    rec.onaudiostart = () => setIsListening(true);
    rec.onsoundstart = () => setIsListening(true);

    rec.onresult = (e: any) => {
      const text = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
      setQ(text);
      const last = e.results[e.resultIndex];
      if (last?.isFinal) {
        const finalText = last[0]?.transcript?.trim();
       if (finalText) {
  if (isMobile) setOpenM(false); else setOpen(false);
  navigate(`/search?query=${encodeURIComponent(finalText)}`);
}

        try { rec.stop(); } catch {console.log('err')}
      }
    };

    rec.onend = () => { setIsListening(false); releaseMic(); };
    rec.onerror = (e: any) => {
      setIsListening(false);
      if (e?.error === "not-allowed") message.warning("Доступ до мікрофону заборонено");
      else if (e?.error !== "aborted") message.warning("Помилка голосового пошуку");
    };

    recRef.current = rec;
    return () => {
  try { rec.stop(); } catch { console.log('err'); }
  recRef.current = null;
  releaseMic();
};

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supportsSR, isMobile, navigate]);

  const toggleVoice = async () => {
    if (!supportsSR || !recRef.current) {
      message.info("Браузер не підтримує голосовий пошук");
      return;
    }
if (isListening) {
  try { recRef.current.stop(); } catch { console.log('err'); }
  return;
}

if (isMobile) {
  setOpenM(true);
} else {
  setOpen(true);
}
setManuallyOpened(true);

    await warmupMic();
    // дать UI отрисоваться и сразу стартовать распознавание
    requestAnimationFrame(() => {
      try { recRef.current!.start(); } catch {console.log('err')}
    });
  };

  // ===== Самопишущийся placeholder =====
  const [ph, setPh] = useState(placeholder);
  const TYPE_SPEED = 420;
  const ERASE_SPEED = 140;
  const PAUSE_AFTER_TYPED = 1500;
  const PAUSE_AFTER_CLEARED = 600;

  useEffect(() => {
    if (q.trim().length > 0) { setPh(placeholder); return; }
    const words = SEARCH_PRESETS_UA;
    let w = 0, i = 0, deleting = false;
    let t: number | undefined;
    let mounted = true;

    const run = () => {
      if (!mounted) return;
      const word = words[w];
      if (!deleting) {
        setPh(word.slice(0, i + 1));
        i++;
        if (i === word.length) { deleting = true; t = window.setTimeout(run, PAUSE_AFTER_TYPED); return; }
        t = window.setTimeout(run, TYPE_SPEED);
      } else {
        setPh(i > 1 ? word.slice(0, i - 1) : "");
        i--;
        if (i === 0) { deleting = false; w = (w + 1) % words.length; t = window.setTimeout(run, PAUSE_AFTER_CLEARED); return; }
        t = window.setTimeout(run, ERASE_SPEED);
      }
    };

    t = window.setTimeout(run, PAUSE_AFTER_CLEARED);
    return () => { mounted = false; if (t) window.clearTimeout(t); };
  }, [q, placeholder]);

  // ===== Загрузка результатів (дебаунс + отмена) =====
  const tmr = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = async (query: string) => {
    if (query.trim().length < (minLen ?? 2)) {
      abortRef.current?.abort();
      setItems([]); setTotal(0);
      return;
    }
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    try {
      const res = await request(
        `/api/products/search?query=${encodeURIComponent(query.trim())}`,
        { signal: abortRef.current.signal } as any
      ) as SearchApiResponse;

      const listRaw = Array.isArray(res) ? res : (res.products ?? []);
      const list = (listRaw as any[]).map((x) => ({
        ...x,
        id: x?.id ?? x?.productId ?? x?.productID ?? x?.Id ?? null,
      }));
      setItems(list as Product[]);

      const tot =
        (!Array.isArray(res) && res.pagination?.totalItems) ||
        (Array.isArray(res) ? res.length : list.length);
      setTotal(Number(tot || 0));
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (tmr.current) window.clearTimeout(tmr.current);
    tmr.current = window.setTimeout(() => fetchData(q), debounceMs) as unknown as number;
    return () => { if (tmr.current) window.clearTimeout(tmr.current); };
  }, [q, debounceMs]); // eslint-disable-line

  // Прогреваем микрофон при открытии панели
  useEffect(() => {
    if (open || openM) warmupMic();
  }, [open, openM]);

  // Закрытие по ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (open) setOpen(false);
        if (openM) setOpenM(false);
        try { recRef.current?.stop(); } catch {console.log('err')}
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, openM]);

  const ProductRow: React.FC<{ p: Product }> = ({ p }) => (
    <div
      className="flex items-center gap-3 py-2 px-1 rounded cursor-pointer hover:bg-[#f7f7ef]"
    onClick={() => {
  const id = (p as any)?.id;
  if (!id) return;
  if (isMobile) {
    setOpenM(false);
  } else {
    setOpen(false);
  }
  navigate(`/product/${id}`);
}}

    >
      {(p as any).mainImageUrl ? (
        <img
          src={buildImg((p as any).mainImageUrl)}
          alt=""
          style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6 }}
          onError={(e) => ((e.currentTarget as HTMLImageElement).src = "/placeholder.png")}
        />
      ) : <div style={{ width: 44, height: 44 }} />}
      <div className="flex-1 min-w-0"><div className="truncate text-[13px] text-[#222]">{(p as any).title}</div></div>
      {typeof (p as any).price === "number" && <div className="ml-2 whitespace-nowrap text-[13px] font-semibold">{toUA((p as any).price)} грн</div>}
    </div>
  );

  // ===== Контент панелі =====
  const qLen = q.trim().length;
  const PanelContent = (
    <div
      className="bg-white"
      style={{ width: isMobile ? "100%" : panelWidth, maxWidth: "100vw" }}
      onMouseDown={(e) => e.preventDefault()} // не давать клику закрывать dropdown
    >
      {/* Підказки — 1 ряд */}
      <div className="px-3 pt-3">
        <div style={{ display: "flex", gap: 8, flexWrap: "nowrap", overflow: "hidden" }}>
          {SEARCH_PRESETS_UA.map((s) => (
            <Tag
              key={s}
              bordered={false}
              style={{
                background: "#f3f3ea",
                border: "1px solid #e0e0d0",
                color: "#3E4826",
                borderRadius: 9999,
                padding: "2px 10px",
                cursor: "pointer",
                userSelect: "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#E6F0D6"; e.currentTarget.style.borderColor = "#3E4826"; e.currentTarget.style.color = "#2d3620"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f3f3ea"; e.currentTarget.style.borderColor = "#e0e0d0"; e.currentTarget.style.color = "#3E4826"; }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setQ(s)}
            >
              {s}
            </Tag>
          ))}
        </div>
      </div>

      <Divider style={{ margin: "8px 0" }} />

      {/* Результати пошуку */}
      <div className="px-3 pb-3">
        <div className="flex items-baseline justify-between">
          <Title level={5} style={{ margin: 0 }}>
            Результати пошуку {qLen >= (minLen ?? 2) && total ? <Text type="secondary">({total})</Text> : null}
          </Title>
          {!isMobile && qLen >= (minLen ?? 2) && (
            <Button
              type="link"
              size="small"
             onClick={() => {
  if (isMobile) setOpenM(false); else setOpen(false);
  navigate(`/search?query=${encodeURIComponent(q.trim())}`);
}}

            >
              Усі товари
            </Button>
          )}
        </div>

        {qLen < (minLen ?? 2) ? (
          <div className="py-2 text-[13px] text-[#777]">Можливо ви шукали — оберіть підказку вище</div>
        ) : loading ? (
          <List
            dataSource={[...Array(5).keys()]}
            renderItem={() => (
              <List.Item style={{ paddingLeft: 0 }}>
                <Skeleton avatar active title={false} paragraph={{ rows: 1, width: "80%" }} />
              </List.Item>
            )}
          />
        ) : items.length ? (
          <List
            dataSource={items.slice(0, isMobile ? 6 : 10)}
            renderItem={(p) => (
              <List.Item style={{ paddingLeft: 0 }}>
                <ProductRow p={p as Product} />
              </List.Item>
            )}
          />
        ) : (
          manuallyOpened && <div className="py-2 text-[13px] text-[#777]">Нічого не знайдено</div>
        )}

        {qLen >= (minLen ?? 2) && (
          <div className="pt-2">
            <Button
              type="primary"
              block
             onClick={() => {
  if (isMobile) {
    setOpenM(false);
  } else {
    setOpen(false);
  }
  navigate(`/search?query=${encodeURIComponent(q.trim())}`);
}}

            >
              Усі товари
            </Button>
          </div>
        )}

        {isMobile && (qLen < (minLen ?? 2) || (!loading && items.length === 0)) && (
          <div className="pt-2">
            <Button block onClick={() => { setOpenM(false); navigate("/"); }}>
              На головну
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  // ===== Desktop input (зелёный микрофон, когда слушает) =====
  const DesktopInput = (
    <Input
      size={size}
      placeholder={ph}
      prefix={<SearchOutlined />}
      status={isListening ? "warning" : undefined}
      suffix={
        <Button
          type="text"
          onMouseDown={(e) => e.preventDefault()} // не закрывать выпадашку
          onClick={toggleVoice}
          icon={isListening ? <AudioOutlined style={{ color: "#3E4826" }} /> : <AudioMutedOutlined />}
          aria-pressed={isListening}
          title={supportsSR ? (isListening ? "Зупинити диктування" : "Голосовий пошук") : "Не підтримується"}
        />
      }
      value={q}
      onChange={(e) => setQ(e.target.value)}
      //onFocus={() => { setManuallyOpened(true); setOpen(true); warmupMic(); }}
       onFocus={() => setOpen(true)} 
      onPressEnter={() => {
        if (!q.trim()) return;
        setOpen(false);
        navigate(`/search?query=${encodeURIComponent(q.trim())}`);
      }}
      allowClear
      className={className}
    />
  );

  // ===== Mobile opener (readOnly) =====
  const MobileOpener = (
    <div onClick={() => { setManuallyOpened(true); setOpenM(true); warmupMic(); }}>
      <Input
        ref={openerRef}
        size={size}
        placeholder={ph}
        prefix={<SearchOutlined />}
        readOnly
        className={className}
        suffix={
          <Button
            type="text"
            onMouseDown={(e) => e.preventDefault()}
            onClick={toggleVoice}
            icon={isListening ? <AudioOutlined style={{ color: "#3E4826" }} /> : <AudioMutedOutlined />}
            aria-pressed={isListening}
            title={supportsSR ? (isListening ? "Зупинити диктування" : "Голосовий пошук") : "Не підтримується"}
          />
        }
      />
    </div>
  );

  // ===== Render =====
  return isMobile ? (
    <>
      {MobileOpener}
      <Drawer
        open={openM}
        onClose={() => { setOpenM(false); openerRef.current?.blur(); releaseMic(); }}
        placement="top"
        height="100vh"
        styles={{ body: { padding: 0 } }}
        destroyOnHidden
        maskClosable
        keyboard
      >
        {/* sticky header з інпутом і микрофоном */}
        <div style={{ position: "sticky", top: 0, zIndex: 1, background: "#fff", padding: 12, borderBottom: "1px solid #eee" }}>
          <Input
            size={size}
            placeholder={ph}
            prefix={<SearchOutlined />}
            status={isListening ? "warning" : undefined}
            suffix={
              <Button
                type="text"
                onMouseDown={(e) => e.preventDefault()}
                onClick={toggleVoice}
                icon={isListening ? <AudioOutlined style={{ color: "#3E4826" }} /> : <AudioMutedOutlined />}
                aria-pressed={isListening}
                title={supportsSR ? (isListening ? "Зупинити диктування" : "Голосовий пошук") : "Не підтримується"}
              />
            }
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onPressEnter={() => {
              if (!q.trim()) return;
              setOpenM(false);
              navigate(`/search?query=${encodeURIComponent(q.trim())}`);
            }}
            allowClear
          />
        </div>

        {PanelContent}
      </Drawer>
    </>
  ) : (
    <Dropdown
      open={open}
      popupRender={() => PanelContent}   // актуальный проп (вместо dropdownRender)
      onOpenChange={(v) => setOpen(v)}  // позволяем закрывать кликом-вне
      placement="bottom"
     trigger={['click']}                           // управляем показом вручную
    >
      {/* Гасим клик, чтобы Dropdown не переключал open сам */}
       <div
    className="w-full"
    onClick={(e) => {
      e.stopPropagation();                 // <-- не даём Dropdown обработать клик по триггеру
      setOpen(true);                       // открываем вручную на клик по полю
    }}
  >
        {DesktopInput}
      </div>
    </Dropdown>
  );
};
