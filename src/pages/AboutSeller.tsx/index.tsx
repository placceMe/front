import { BlurBlock } from "@shared/ui/BlurBlock";
import React, { useEffect, useState } from "react";
import { FaStar } from 'react-icons/fa';
import sellerBg from '../../assets/bg/bg_seller.png'
import UserIcon from '../../assets/icons/user.svg?react';
import FeedbackIcon from '../../assets/icons/star.svg?react';
import ItwIcon from '../../assets/icons/star.svg?react';



const SELLER_TABS = [
  { key: 'about', label: 'Про продавця',icon: <UserIcon className="w-3 h-3"/>},
  { key: 'reviews', label: 'Відгуки про продавця', icon: <FeedbackIcon className="w-4 h-4"/> },
  { key: 'products', label: 'Товари продавця', icon: '📦' },
];




export const AboutSeller = () => {

const [tab, setTab] = useState(() => {
  const hash = window.location.hash.replace('#', '');
  return SELLER_TABS.find(t => t.key === hash)?.key || 'about';
});

useEffect(() => {
  const onHashChange = () => {
    const hash = window.location.hash.replace('#', '');
    setTab(SELLER_TABS.find(t => t.key === hash)?.key || 'about');
  };
  window.addEventListener('hashchange', onHashChange);
  return () => window.removeEventListener('hashchange', onHashChange);
}, []);


    return (
      
        <BlurBlock
  backgroundImage={tab === 'about' ? `${sellerBg}` : undefined}
  paper={tab !== 'about'}
>
        <div
            className="bg-cover bg-center"
            style={{ backgroundImage: sellerBg }}
        >
            
                <div className="flex gap-2 mb-4">
                  {SELLER_TABS.map(({ key, label, icon }) => (
  <button
    key={key}
    onClick={() => {
      window.location.hash = `#${key}`;
      setTab(key);
    }}
    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-semibold border transition
      ${tab === key
        ? 'bg-[#2b3924] text-white border-[#2b3924]'
        : 'bg-[#edf1e3] text-[#2b3924] border-[#cbd5b5] hover:bg-[#e3e9d7]'}`}
  >
    <span>{icon}</span>
    {label}
  </button>
))}

                </div>

                {/* Основной контент */}
                <div className="flex flex-wrap gap-6 justify-between">

                    {/* Левая часть */}
                    <div className="flex-1 min-w-[280px]">
                    
 <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 ">
      {/* Блок 1: Продавець SAVE */}
      <div className="xl:col-span-12">
        <h2 className="text-[28px] font-bold text-[#2b3924] flex items-center gap-2">
          Продавець SAVE
          <span className="text-[#f5b121] text-[20px] font-bold flex items-center gap-1">
            4.6/5 <FaStar />
          </span>
        </h2>
      </div>

      {/* Блок описания + часы + рейтинг + детальный фидбек */}
      <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Описание */}
        <div className="md:col-span-5 bg-[#e5e5d8]/70 rounded-[5px] p-4 space-y-4">
          <p className="text-sm text-[#2b3924] leading-relaxed">
            SAVE — це команда, що народилася з потреби підтримати тих, хто щодня ризикує заради нашої свободи.
            Ми спеціалізуємось на якісному військовому спорядженні, створеному для надійності, витривалості й зручності.
          </p>
          <p className="text-sm text-[#2b3924] leading-relaxed">
            Працюємо з 2022 року, від початку повномасштабного вторгнення. Спорядження протестоване військовими в  бойових умовах.
          </p>
          <p className="text-sm text-[#2b3924] leading-relaxed">
            Пропонуємо: тактичні рюкзаки, бронежилети, плитоноски, шоломи, форми, взуття та аксесуари.
          </p>
        </div>

        {/* Часы и кнопка */}
        <div className="md:col-span-3 flex flex-col gap-4">
          <div className="bg-[#f0f0f0] rounded p-4 text-sm text-gray-800">
            <p>Пн-Пт 09:00 - 18:00</p>
            <p>Сб-Нд 10:00 - 16:00</p>
          </div>
          <button className="bg-[#3c4e2c] hover:bg-[#2d3a20] text-white px-4 py-2 rounded text-sm font-semibold">
            Діалог з продавцем
          </button>
        </div>

        {/* Рейтинг + Детальная оценка */}
        <div className="md:col-span-4 flex flex-col gap-3 justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#2b3924]">Загальний рейтинг та оцінки</h3>
            <div className="text-sm text-[#2b3924] mb-2">на основі 36 відгуків</div>

            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-2 text-sm">
                <span className="w-[30px]">{stars} ★</span>
                <div className="flex-1 max-w-[200px] bg-gray-200 rounded h-[6px] overflow-hidden">
                  <div
                    className={`h-full ${stars === 5 ? "bg-yellow-400" : "bg-gray-400"}`}
                    style={{ width: `${(stars === 5 ? 33 : 1) / 33 * 100}%` }}
                  />
                </div>
                <span className="w-[30px] text-right">{stars === 5 ? 33 : 1}</span>
              </div>
            ))}
          </div>


{/**
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            {[ 
              { title: "Якість обслуговування", score: "4.6" },
              { title: "Своєчасна доставка", score: "4.7" },
              { title: "Відповідність товару опису", score: "4.5" },
              { title: "Наявність актуального асортименту", score: "4.8" },
            ].map(({ title, score }) => (
              <div key={title} className="h-[32px] bg-white/80 rounded-[5px] px-[15px] py-[7px] flex justify-between items-center text-sm text-[#2b3924] font-medium">
                <span>{title}</span>
                <span className="text-[#f5b121] font-bold">{score} ★</span>
              </div>
            ))}
          </div> */}
        </div>
      </div>

      {/* Нижний Блок */}
      <div className="xl:col-span-12 grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
        {[
          { label: "На NORSEN", value: "183 дні", index: "01" },
          { label: "Швидкість відправки", value: "в середньому — 6 годин", index: "02" },
          { label: "Швидкість доставки", value: "в середньому — 2 дні", index: "03" },
          { label: "Час відповіді", value: "в середньому — 5 хвилин", index: "04" },
          { label: "Наявність скарг", value: "0%", index: "05" },
        ].map((item) => (
          <div key={item.index} className="relative bg-white/80 backdrop-blur-sm rounded-md p-4 overflow-hidden">
            <div className="absolute bottom-[20px] right-2 text-[45px] font-bold leading-[100%] font-montserrat text-[#e5ac30]/30">
              {item.index}
            </div>
            <div className="relative z-10">
              <div className="text-[13px] font-semibold text-gray-800 mb-1">{item.label}</div>
              <div className="text-sm text-gray-700">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div> 
                       </div>
                       </div>
           
        </div>
</BlurBlock>
    );
};
