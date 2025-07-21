

import { useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store/hooks';
import { fetchProduct } from '../../entities/product/model/fetchProduct';
import { Image, Spin, Typography } from 'antd';
import { ProductMainBlock } from '../../widgets/ProductMainBlock/ProductMainBlock';
import { ProductDescriptionBlock } from '../../widgets/ProductDescriptionBlock/ProductDescriptionBlock';
import { ProductReviewsBlock } from '../../widgets/ProductReviewsBlock/ProductReviewsBlock';
import { ProductSpecsBlock } from '../../widgets/ProductSpecsBlock/ProductSpecsBlock';
import gearsBg from '../../assets/productCard/gear_bg.png'
import productBg from '../../assets/productCard/bg.png'

import { TabPaper } from '../../widgets/TabPaper';
import { BlurBlock } from '@shared/ui/BlurBlock';
import { TabNavFrame } from '@shared/ui/TabNavFrame/TabNavFrame';

const Text =  Typography;

export const ProductPage = () => {
  const { id } = useParams(); 
  const dispatch = useAppDispatch();
  const { product, loading } = useAppSelector(state => state.product);

useEffect(() => {
  if (product && product.id) {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || "guest";
    const viewedObj = JSON.parse(localStorage.getItem("userViewed") || "{}");

    let viewed: string[] = viewedObj[userId] || [];

    // Remove duplicates, add в начало
    viewed = [product.id, ...viewed.filter(pid => pid !== product.id)];
    viewed = viewed.slice(0, 16);

    viewedObj[userId] = viewed;
    localStorage.setItem("userViewed", JSON.stringify(viewedObj));
  }
}, [product]);


  useEffect(() => {
    if (id) dispatch(fetchProduct(id));
  }, [id, dispatch]);
  
console.log("Redux state product:", product);

 // if (loading || !product) return <Spin size="large" className="mt-10" />;

 const TABS = [
    { key: "main", label: "Все о товаре" },
    { key: "specs", label: "Характеристики" },
    { key: "reviews", label: "Отзывы" },
  ];

  // Стейт таба через hash
  const [tab, setTab] = React.useState(() => {
    const hash = window.location.hash.replace("#", "");
    return TABS.find(t => t.key === hash) ? hash : TABS[0].key;
  });
  React.useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setTab(TABS.find(t => t.key === hash) ? hash : TABS[0].key);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [TABS]);
  const handleChangeTab = (key: string) => {
    setTab(key);
    window.location.hash = `#${key}`;
  };

  if (loading || !product) return <Spin size="large" className="mt-10" />;

  return (
    <div>
      <div className="max-w-[1000px] mx-auto py-8">
        {/* Табы всегда видны */}
        <TabNavFrame tabs={TABS} value={tab} onChange={handleChangeTab} />
      </div>

      {/* Первый таб — карточка + всё что надо, остальные — только контент */}
      {tab === "main" && (
        <>
          {/* BlurCard с background — только для главной секции */}
          <BlurBlock backgroundImage={productBg} className="mb-8">
            <ProductMainBlock product={product} />
          </BlurBlock>

          {/* Дальше секции на белом фоне */}
          <div className="bg-white w-full py-6">
            <div className="max-w-[1000px] mx-auto px-4">
              <ProductDescriptionBlock product={product} />
              <ProductSpecsBlock />
              <ProductReviewsBlock />
            </div>
          </div>
        </>
      )}

      {/* Остальные табы — только соответствующий контент, без blur-карточки */}
      {tab === "specs" && (
        <div className="bg-white w-full py-6">
          <div className="max-w-[1000px] mx-auto px-4">
            <ProductSpecsBlock />
          </div>
        </div>
      )}

      {tab === "reviews" && (
        <div className="bg-white w-full py-6">
          <div className="max-w-[1000px] mx-auto px-4">
            <ProductReviewsBlock />
          </div>
        </div>
      )}
    </div>
  );
};
  /*(
    <>
      <ProductMainBlock product={product} />

 <div className="bg-white w-full min-h-[500px] py-4 sm:py-6 md:py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8">
            
            <div 
              className="relative"
              style={{ 
                backgroundImage: `url(${gearsBg})`, 
                backgroundSize: 'clamp(150px, 20vw, 300px)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right bottom'
              }}
            >
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <ProductDescriptionBlock product={product} />
                <ProductSpecsBlock />
              </div>
            </div>
            
            <ProductReviewsBlock />
          </div>
        </div>
        
        <div className="text-center py-4 sm:py-6 md:py-8 px-4">
          <Text className="text-gray-500 text-sm sm:text-base">
            Список нещодавно переглянутих товарів буде відображений тут
          </Text>
        </div>
      </div>
    </>
  );
};

*/

