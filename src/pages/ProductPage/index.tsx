
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { useProduct } from '../../entities/product/model/fetchProduct';
import { Spin } from 'antd';
import { ProductMainBlock } from '../../widgets/ProductMainBlock/ProductMainBlock';
import { ProductDescriptionBlock } from '../../widgets/ProductDescriptionBlock/ProductDescriptionBlock';
import { ProductReviewsBlock } from '../../widgets/ProductReviewsBlock/ProductReviewsBlock';
import { ProductSpecsBlock } from '../../widgets/ProductSpecsBlock/ProductSpecsBlock';
import productBg from '../../assets/productCard/bg.png';

import { BlurBlock } from '@shared/ui/BlurBlock';
import { TabNavFrame } from '@shared/ui/TabNavFrame/TabNavFrame';

import ReviewsIcon from '../../assets/icons/star.svg?react';
import SpecsIcon from '../../assets/icons/setting.svg?react';
import InfoIcon from '../../assets/icons/info.svg?react';


export const TABS = [
  {
    key: "main",
    label: "Все про товар",
    icon: (active: boolean) => <InfoIcon fill={active ? "#fff" : "#3E4826"} width={18} height={18} />
  },
  {
    key: "specs",
    label: "Характеристики",
    icon: (active: boolean) => <SpecsIcon fill={active ? "#fff" : "#3E4826"} width={18} height={18} />
  },
  {
    key: "reviews",
    label: "Відгуки",
    icon: (active: boolean) => <ReviewsIcon fill={active ? "#fff" : "#3E4826"} width={18} height={18} />
  },
];
export function addProductToLocalList(userId: string, productId: string) {
  const storageKey = "userViewed";
  const existingMap = JSON.parse(localStorage.getItem(storageKey) || "{}");

  const userList = existingMap[userId] || [];

  if (!userList.includes(productId)) {
    const updatedList = [productId, ...userList].slice(0, 30); // максимум 30 товаров
    const updatedMap = { ...existingMap, [userId]: updatedList };
    localStorage.setItem(storageKey, JSON.stringify(updatedMap));
  }
}

export function addProductToWishlist(userId: string, productId: string) {
  const storageKey = "userWishlist";
  const existingMap = JSON.parse(localStorage.getItem(storageKey) || "{}");

  const userList = existingMap[userId] || [];

  if (!userList.includes(productId)) {
    const updatedList = [productId, ...userList].slice(0, 30);
    const updatedMap = { ...existingMap, [userId]: updatedList };
    localStorage.setItem(storageKey, JSON.stringify(updatedMap));
  }
}


export const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
 // const { product, loading } = useAppSelector(state => state.product);
    const { product, loading, error } = useProduct(id!);
  const userId = useAppSelector(state => state.user.user?.id) || "guest";

  const [tab, setTab] = useState(() => {
    const hash = window.location.hash.replace("#", "");
    return TABS.find(t => t.key === hash) ? hash : TABS[0].key;
  });

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setTab(TABS.find(t => t.key === hash) ? hash : TABS[0].key);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleChangeTab = (key: string) => {
    setTab(key);
    window.location.hash = `#${key}`;
  };

  useEffect(() => {
    if (product?.id && userId) {
      addProductToLocalList(userId, product.id);
    }
  }, [product?.id, userId]);

  if (loading || !product) return <Spin size="large" className="mt-10" />;


  return (
    <div className="py-8">
      <div className="">
        <BlurBlock
          backgroundImage={tab === "main" ? productBg : undefined}
          paper={tab !== "main"}
          className="mb-8"
        >
          <div className="mb-6">
            <TabNavFrame tabs={TABS} value={tab} onChange={handleChangeTab} />
          </div>
          {tab === "main" && <ProductMainBlock product={product} />}
          {tab === "specs" && <ProductSpecsBlock />}
          {tab === "reviews" && <ProductReviewsBlock />}
        </BlurBlock>

        {tab === "main" && (
          <div className="bg-white w-full py-6 ">
            <div className="max-w-[1100px] mx-auto px-4 space-y-8">
              <ProductDescriptionBlock product={product} />
              <ProductSpecsBlock />
              <ProductReviewsBlock />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};