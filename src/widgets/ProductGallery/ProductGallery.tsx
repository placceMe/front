
/*
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

export const ProductGallery = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);
  const next = () => setCurrent(c => (c + 1) % images.length);

  useEffect(() => {
    const container = containerRef.current;
    const activeThumb = thumbRefs.current[current];
    if (container && activeThumb) {
      const containerRect = container.getBoundingClientRect();
      const thumbRect = activeThumb.getBoundingClientRect();
      if (
        thumbRect.left < containerRect.left ||
        thumbRect.right > containerRect.right
      ) {
        container.scrollTo({
          left: activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [current, images.length]);

  const setThumbRef = useCallback((el: HTMLDivElement | null, index: number) => {
    thumbRefs.current[index] = el;
  }, []);

  return (
    <div className="relative flex flex-col gap-2 items-center">
    
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
        style={{
          left: -24,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer'
        }}
        aria-label="Назад"
      >
        <LeftOutlined style={{ fontSize: 32, color: '#fff', filter: 'drop-shadow(0 0 6px #8888)' }} />
      </button>

     
      <Image
        width={320}
        src={images[current]}
        style={{}}
        preview={false}
      />

      
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
        style={{
          right: -24,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer'
        }}
        aria-label="Вперед"
      >
        <RightOutlined style={{ fontSize: 32, color: '#fff', filter: 'drop-shadow(0 0 6px #8888)' }} />
      </button>

    
      <div
        ref={containerRef}
        className="flex gap-2 mt-2 overflow-x-auto max-w-[340px] custom-scrollbar"
        style={{ paddingBottom: 4 }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            ref={el => setThumbRef(el, idx)}
            style={{
              border: '1px solid #E5E5D8',
              background: current === idx ? '#E5E5D8' : 'transparent',
              borderRadius: 5,
              padding: 2,
              cursor: 'pointer',
              minWidth: 60,
              boxShadow: current === idx ? '0 2px 8px #539E1A22' : undefined,
              transition: 'background 0.2s, border 0.2s',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 60,
              outline: current === idx ? '2px solid #E5E5D8' : 'none',
              outlineOffset: -2,
            }}
            onClick={() => setCurrent(idx)}
          >
            <Image
              width={48}
              src={img}
              style={{
                borderRadius: 7,
                opacity: current === idx ? 1 : 0.78,
                transition: 'opacity 0.2s',
                background: 'transparent'
              }}
              preview={false}
            />
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #7F7A77 transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 2.5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #7F7A77;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};
*/
/*
import { Button, Image } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import  RightIcon from '../../assets/icons/arrow.svg?react';
import  LeftIcon from '../../assets/icons/arrow.svg?react';

export const ProductGallery = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);

  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);
  const next = () => setCurrent(c => (c + 1) % images.length);

  useEffect(() => {
    const container = containerRef.current;
    const activeThumb = thumbRefs.current[current];
    if (container && activeThumb) {
      const containerRect = container.getBoundingClientRect();
      const thumbRect = activeThumb.getBoundingClientRect();
      if (
        thumbRect.left < containerRect.left ||
        thumbRect.right > containerRect.right
      ) {
        container.scrollTo({
          left: activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [current, images.length]);

  const setThumbRef = useCallback((el: HTMLDivElement | null, index: number) => {
    thumbRefs.current[index] = el;
  }, []);

  return (<>
 <div className="relative w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center">
 
  <Button
    type="text"
    onClick={prev}
    className="absolute left-0 top-0 -translate-y-1/2 z-10"
    style={{ background: "none", boxShadow: "none", border: "none", padding: 0 }}
    aria-label="Назад"
  >
    <LeftIcon width={28} height={28} fill="#5a6b3b" style={{ transform: "rotate(180deg)" }} />
  </Button>


  <Image
    src={images[current]}
    alt=""
    className="object-contain w-full h-full"
    preview={false}
  />


  <Button
    type="text"
    onClick={next}
    className="absolute right-0 top-0 -translate-y-1/2 z-10"
    style={{ background: "none", boxShadow: "none", border: "none", padding: 0 }}
    aria-label="Вперед"
  >
    <RightIcon width={28} height={28} fill="#5a6b3b" />
  </Button>
</div>


      <div
        ref={containerRef}
        className="flex gap-2 mt-2 overflow-x-auto max-w-[510px] custom-scrollbar "
        style={{ paddingBottom: 4 }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            ref={el => setThumbRef(el, idx)}
            onClick={() => setCurrent(idx)}
            className={
              "flex items-center justify-center h-30 w-30 min-w-[120px] rounded-lg cursor-pointer transition-all duration-200 " +
              (current === idx
                ? "ring-2 ring-[#5a6b3b] bg-[#E5E5D8]"
                : "border border-[#E5E5D8] bg-transparent")
            }
            tabIndex={0}
          >
            <Image
              width={120}
              src={img}
              className="object-contain rounded"
              preview={false}
              style={{
                opacity: current === idx ? 1 : 0.7,
                transition: 'opacity 0.2s'
              }}
            />
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #7F7A77 transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 2.5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #7F7A77;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
</>
  );
};
*/


import { Button, Image } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import RightIcon from '../../assets/icons/arrow.svg?react';
import LeftIcon from '../../assets/icons/arrow.svg?react';

export const ProductGallery = ({ images }: { images: string[]; }) => {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);




  const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);
  const next = () => setCurrent(c => (c + 1) % images.length);

  useEffect(() => {
    const container = containerRef.current;
    const activeThumb = thumbRefs.current[current];
    if (container && activeThumb) {
      const containerRect = container.getBoundingClientRect();
      const thumbRect = activeThumb.getBoundingClientRect();
      if (
        thumbRect.left < containerRect.left ||
        thumbRect.right > containerRect.right
      ) {
        container.scrollTo({
          left: activeThumb.offsetLeft - container.offsetWidth / 2 + activeThumb.offsetWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [current, images.length]);

  const setThumbRef = useCallback((el: HTMLDivElement | null, index: number) => {
    thumbRefs.current[index] = el;
  }, []);
    const FILES_BASE_URL = 'http://localhost:5001/api/files/file/';
//  const FILES_BASE_URL = "http://31.42.190.94:8080/api/files/";

const fullImages = images.map(img => {
  // если img — это уже полный путь, не добавляем BASE
  return img.startsWith('http') ? img : FILES_BASE_URL + img;
});


  return (<>
    <div className="relative w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center">
      {/* Левая стрелка */}
      <Button
        type="text"
        onClick={prev}
        className="absolute left-0 top-0 -translate-y-1/2 z-10"
        style={{ background: "none", boxShadow: "none", border: "none", padding: 0 }}
        aria-label="Назад"
      >
        <LeftIcon width={28} height={28} fill="#5a6b3b" style={{ transform: "rotate(180deg)" }} />
      </Button>

      {/* Картинка */}
      <Image
        src={fullImages[current]}
        alt=""
        className="object-contain w-full h-full"
        preview={false}
      />

      {/* Правая стрелка */}
      <Button
        type="text"
        onClick={next}
        className="absolute right-0 top-0 -translate-y-1/2 z-10"
        style={{ background: "none", boxShadow: "none", border: "none", padding: 0 }}
        aria-label="Вперед"
      >
        <RightIcon width={28} height={28} fill="#5a6b3b" />
      </Button>
    </div>


    {/* Миниатюры, максимум 4 — max-w фиксирует скролл */}
    <div
      ref={containerRef}
      className="flex gap-2 mt-2 overflow-x-auto max-w-[510px] custom-scrollbar "
      style={{ paddingBottom: 4 }}
    >
      {fullImages.map((img, idx) => (
        <div
          key={idx}
          ref={el => setThumbRef(el, idx)}
          onClick={() => setCurrent(idx)}
          className={
            "flex items-center justify-center h-30 w-30 min-w-[120px] rounded-lg cursor-pointer transition-all duration-200 " +
            (current === idx
              ? "ring-2 ring-[#5a6b3b] bg-[#E5E5D8]"
              : "border border-[#E5E5D8] bg-transparent")
          }
          tabIndex={0}
        >
          <Image
            width={120}
            src={img}
            className="object-contain rounded"
            preview={false}
            style={{
              opacity: current === idx ? 1 : 0.7,
              transition: 'opacity 0.2s'
            }}
          />
        </div>
      ))}
    </div>

    {/* Стили скролла */}
    <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #7F7A77 transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          height: 2.5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #7F7A77;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
  </>
  );
};
