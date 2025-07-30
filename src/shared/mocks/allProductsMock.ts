import type { Product } from '@shared/types/api';

export const allProductsMock: any[] = [
  {
    id: '1',
    title: 'Тактичний шолом EmberCore Shield M1',
    description: 'Надійний захист і комфорт у кожній деталі. EmberCore Shield M1 — це легкий і міцний тактичний шолом, розроблений для бойових, тренувальних і тактичних операцій. Ідеальний вибір для військових, добровольців, силових структур, стрільців та для тактичних тренувань.',
    price: 9720,
    categoryId: 'helmets',
    sellerId: 'user1',
    state: 'Active',
   // category: Category;
    quantity: 10,
    characteristics:[
  { id: 'c1', value: '5.2', productId: '1', charesteristicDictId: 'cd1' }, // Вага
  { id: 'c2', value: 'Кевлар', productId: '1', charesteristicDictId: 'cd2' }, // Матеріал
],
    attachments: [
      {
        id: 'img1',
        filePath: '../../../public/mock/mock1.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img2',
        filePath: '../../../public/mock/mock2.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img3',
        filePath: '../../../public/mock/mock3.png',
        productId: '1',
        product: {} as Product,
      },
         {
        id: 'img4',
        filePath: '../../../public/mock/mock4.png',
        productId: '1',
        product: {} as Product,
      },
          {
        id: 'img5',
        filePath: '../../../public/mock/mock1.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img6',
        filePath: '../../../public/mock/mock2.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img7',
        filePath: '../../../public/mock/mock3.png',
        productId: '1',
        product: {} as Product,
      },
         {
        id: 'img8',
        filePath: '../../../public/mock/mock4.png',
        productId: '1',
        product: {} as Product,
      },

    ],
    
  },
  {
    id: '2',
    title: 'Навушники Sordin Supreme Pro X',
    description: 'Професійні тактичні навушники для захисту слуху.',
    price: 5990,
    categoryId: 'headsets',
    sellerId: 'user2',
    state: 'Active',
    quantity: 12,
    characteristics: [],
    attachments: [
      { id: 'img2', filePath: '../../../public/mock/mock9.png', productId: '2', product: {} as Product },
      { id: 'img3', filePath: '../../../public/mock/mock10.png', productId: '2', product: {} as Product },
      { id: 'img4', filePath: '../../../public/mock/mock11.png', productId: '2', product: {} as Product },
      { id: 'img5', filePath: '../../../public/mock/mock12.png', productId: '2', product: {} as Product },

    ],
    
  },
  {
    id: '3',
    title: 'Плитоноска WARTECH TV-102',
    description: 'Модульна тактична плитоноска для захисту.',
    price: 4290,
    categoryId: 'plates',
    sellerId: 'user3',
    state: 'Active',
    quantity: 7,
    characteristics: [],
    attachments: [
      { id: 'img3', filePath: 'https://velmet.ua/image/catalog/Plate_Carrier/TV-102/black.jpg', productId: '3', product: {} as Product }
    ],
   
  },
  {
    id: '4',
    title: 'Тактична куртка M-Tac Softshell',
    description: 'Вітрозахисна тактична куртка для активних дій.',
    price: 1980,
    categoryId: 'clothes',
    sellerId: 'user1',
    state: 'Active',
    quantity: 18,
    characteristics: [],
    attachments: [
      { id: 'img4', filePath: '../../../public/mock/mock18.png', productId: '4', product: {} as Product }
    ],
   
  },
  {
    id: '5',
    title: 'Берці Lowa Zephyr GTX',
    description: 'Комфортне тактичне взуття з мембраною Gore-Tex.',
    price: 3850,
    categoryId: 'boots',
    sellerId: 'user2',
    state: 'Active',
    quantity: 6,
    characteristics: [],
    attachments: [
      { id: 'img5', filePath: 'https://content1.rozetka.com.ua/goods/images/big/233801865.jpg', productId: '5', product: {} as Product }
    ],
    
  },
  {
    id: '6',
    title: 'Аптечка тактична MEDIC PRO',
    description: 'Компактна аптечка для польових умов.',
    price: 940,
    categoryId: 'med',
    sellerId: 'user3',
    state: 'Active',
    quantity: 25,
    characteristics: [],
    attachments: [
      { id: 'img6', filePath: 'https://velmet.ua/image/catalog/Medical/Med_Kit_Black.jpg', productId: '6', product: {} as Product }
    ],
    
  },
  {
    id: '7',
    title: 'Каремат BLACKHAWK',
    description: 'Каремат.',
    price: 690,
    categoryId: 'equipment',
    sellerId: 'user1',
    state: 'Active',
    quantity: 17,
    characteristics: [],
    attachments: [
      { id: 'img7', filePath: '../../../public/mock/mock26.png', productId: '7', product: {} as Product }
    ],
   
  },
  {
    id: '8',
    title: 'Рюкзак M-Tac Assault Pack 36L',
    description: 'Місткий тактичний рюкзак для спорядження.',
    price: 2150,
    categoryId: 'bags',
    sellerId: 'user2',
    state: 'Active',
    quantity: 9,
    characteristics: [],
    attachments: [
      { id: 'img8', filePath: 'https://militarist.ua/images/detailed/29/10142006.jpg', productId: '8', product: {} as Product }
    ],
   
  },
  {
    id: '9',
    title: 'Рація Baofeng UV-5R',
    description: 'Компактна та надійна радіостанція.',
    price: 1350,
    categoryId: 'comm',
    sellerId: 'user3',
    state: 'Active',
    quantity: 14,
    characteristics: [],
    attachments: [
      { id: 'img9', filePath: 'https://cdn.27.ua/799/53/24/5231885_1.jpeg', productId: '9', product: {} as Product }
    ],
    
  },
  {
    id: '10',
    title: 'Бінокль Bresser Hunter 10x50',
    description: 'Якісний бінокль для спостереження в полі.',
    price: 2100,
    categoryId: 'optics',
    sellerId: 'user2',
    state: 'Active',
    quantity: 11,
    characteristics: [],
    attachments: [
      { id: 'img10', filePath: 'https://cdn.27.ua/799/56/87/5648515_1.jpeg', productId: '10', product: {} as Product }
    ],
   
  },
  {
    id: '11',
    title: 'Тактичний шолом EmberCore Shield M1',
    description: 'Надійний захист і комфорт у кожній деталі. EmberCore Shield M1 — це легкий і міцний тактичний шолом, розроблений для бойових, тренувальних і тактичних операцій. Ідеальний вибір для військових, добровольців, силових структур, стрільців та для тактичних тренувань.',
    price: 9720,
    categoryId: 'helmets',
    sellerId: 'user1',
    state: 'Active',
   // category: Category;
    quantity: 10,
    characteristics:[
  { id: 'c1', value: '5.2', productId: '1', charesteristicDictId: 'cd1' }, // Вага
  { id: 'c2', value: 'Кевлар', productId: '1', charesteristicDictId: 'cd2' }, // Матеріал
],
    attachments: [
      {
        id: 'img1',
        filePath: '../../../public/mock/mock8.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img2',
        filePath: '../../../public/mock/mock2.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img3',
        filePath: '../../../public/mock/mock3.png',
        productId: '1',
        product: {} as Product,
      },
         {
        id: 'img4',
        filePath: '../../../public/mock/mock4.png',
        productId: '1',
        product: {} as Product,
      },
        

    ],
    
  },
  {
    id: '12',
    title: 'Тактичний шолом EmberCore Shield M1',
    description: 'Надійний захист і комфорт у кожній деталі. EmberCore Shield M1 — це легкий і міцний тактичний шолом, розроблений для бойових, тренувальних і тактичних операцій. Ідеальний вибір для військових, добровольців, силових структур, стрільців та для тактичних тренувань.',
    price: 9720,
    categoryId: 'helmets',
    sellerId: 'user1',
    state: 'Active',
   // category: Category;
    quantity: 10,
    characteristics:[
  { id: 'c1', value: '5.2', productId: '1', charesteristicDictId: 'cd1' }, // Вага
  { id: 'c2', value: 'Кевлар', productId: '1', charesteristicDictId: 'cd2' }, // Матеріал
],
    attachments: [
      {
        id: 'img1',
        filePath: '../../../public/mock/mock7.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img2',
        filePath: '../../../public/mock/mock2.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img3',
        filePath: '../../../public/mock/mock3.png',
        productId: '1',
        product: {} as Product,
      },
         {
        id: 'img4',
        filePath: '../../../public/mock/mock4.png',
        productId: '1',
        product: {} as Product,
      },

    ],
    
  },{
    id: '13',
    title: 'Тактичний шолом EmberCore Shield M1',
    description: 'Надійний захист і комфорт у кожній деталі. EmberCore Shield M1 — це легкий і міцний тактичний шолом, розроблений для бойових, тренувальних і тактичних операцій. Ідеальний вибір для військових, добровольців, силових структур, стрільців та для тактичних тренувань.',
    price: 9720,
    categoryId: 'helmets',
    sellerId: 'user1',
    state: 'Active',
   // category: Category;
    quantity: 10,
    characteristics:[
  { id: 'c1', value: '5.2', productId: '1', charesteristicDictId: 'cd1' }, // Вага
  { id: 'c2', value: 'Кевлар', productId: '1', charesteristicDictId: 'cd2' }, // Матеріал
],
    attachments: [
      {
        id: 'img1',
        filePath: '../../../public/mock/mock6.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img2',
        filePath: '../../../public/mock/mock2.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img3',
        filePath: '../../../public/mock/mock3.png',
        productId: '1',
        product: {} as Product,
      },
         {
        id: 'img4',
        filePath: '../../../public/mock/mock4.png',
        productId: '1',
        product: {} as Product,
      },
          

    ],
    
  },{
    id: '14',
    title: 'Тактичний шолом EmberCore Shield M1',
    description: 'Надійний захист і комфорт у кожній деталі. EmberCore Shield M1 — це легкий і міцний тактичний шолом, розроблений для бойових, тренувальних і тактичних операцій. Ідеальний вибір для військових, добровольців, силових структур, стрільців та для тактичних тренувань.',
    price: 9720,
    categoryId: 'helmets',
    sellerId: 'user1',
    state: 'Active',
   // category: Category;
    quantity: 10,
    characteristics:[
  { id: 'c1', value: '5.2', productId: '1', charesteristicDictId: 'cd1' }, // Вага
  { id: 'c2', value: 'Кевлар', productId: '1', charesteristicDictId: 'cd2' }, // Матеріал
],
    attachments: [
      {
        id: 'img1',
        filePath: '../../../public/mock/mock5.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img2',
        filePath: '../../../public/mock/mock2.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img3',
        filePath: '../../../public/mock/mock3.png',
        productId: '1',
        product: {} as Product,
      },
         {
        id: 'img4',
        filePath: '../../../public/mock/mock4.png',
        productId: '1',
        product: {} as Product,
      },
         
    ],
    
  },{
    id: '15',
    title: 'Тактичний шолом EmberCore Shield M1',
    description: 'Надійний захист і комфорт у кожній деталі. EmberCore Shield M1 — це легкий і міцний тактичний шолом, розроблений для бойових, тренувальних і тактичних операцій. Ідеальний вибір для військових, добровольців, силових структур, стрільців та для тактичних тренувань.',
    price: 9720,
    categoryId: 'helmets',
    sellerId: 'user1',
    state: 'Active',
   // category: Category;
    quantity: 10,
    characteristics:[
  { id: 'c1', value: '5.2', productId: '1', charesteristicDictId: 'cd1' }, // Вага
  { id: 'c2', value: 'Кевлар', productId: '1', charesteristicDictId: 'cd2' }, // Матеріал
],
    attachments: [
      {
        id: 'img1',
        filePath: '../../../public/mock/mock2.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img2',
        filePath: '../../../public/mock/mock1.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img3',
        filePath: '../../../public/mock/mock3.png',
        productId: '1',
        product: {} as Product,
      },
         
    ],
    
  },{
    id: '16',
    title: 'Тактичний шолом EmberCore Shield M1',
    description: 'Надійний захист і комфорт у кожній деталі. EmberCore Shield M1 — це легкий і міцний тактичний шолом, розроблений для бойових, тренувальних і тактичних операцій. Ідеальний вибір для військових, добровольців, силових структур, стрільців та для тактичних тренувань.',
    price: 9720,
    categoryId: 'helmets',
    sellerId: 'user1',
    state: 'Active',
   // category: Category;
    quantity: 10,
    characteristics:[
  { id: 'c1', value: '5.2', productId: '1', charesteristicDictId: 'cd1' }, // Вага
  { id: 'c2', value: 'Кевлар', productId: '1', charesteristicDictId: 'cd2' }, // Матеріал
],
    attachments: [
      {
        id: 'img1',
        filePath: '../../../public/mock/mock3.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img2',
        filePath: '../../../public/mock/mock2.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img3',
        filePath: '../../../public/mock/mock1.png',
        productId: '1',
        product: {} as Product,
      },
         {
        id: 'img4',
        filePath: '../../../public/mock/mock4.png',
        productId: '1',
        product: {} as Product,
      },
       

    ],
    
  },{
    id: '17',
    title: 'Тактичний шолом EmberCore Shield M1',
    description: 'Надійний захист і комфорт у кожній деталі. EmberCore Shield M1 — це легкий і міцний тактичний шолом, розроблений для бойових, тренувальних і тактичних операцій. Ідеальний вибір для військових, добровольців, силових структур, стрільців та для тактичних тренувань.',
    price: 9720,
    categoryId: 'helmets',
    sellerId: 'user1',
    state: 'Active',
   // category: Category;
    quantity: 10,
    characteristics:[
  { id: 'c1', value: '5.2', productId: '1', charesteristicDictId: 'cd1' }, // Вага
  { id: 'c2', value: 'Кевлар', productId: '1', charesteristicDictId: 'cd2' }, // Матеріал
],
    attachments: [
      {
        id: 'img1',
        filePath: '../../../public/mock/mock4.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img2',
        filePath: '../../../public/mock/mock2.png',
        productId: '1',
        product: {} as Product,
      },
        {
        id: 'img3',
        filePath: '../../../public/mock/mock3.png',
        productId: '1',
        product: {} as Product,
      },
         {
        id: 'img4',
        filePath: '../../../public/mock/mock1.png',
        productId: '1',
        product: {} as Product,
      },
         

    ],
    
  },
  {
    id: '18',
    title: 'Навушники Sordin Supreme Pro X',
    description: 'Професійні тактичні навушники для захисту слуху.',
    price: 5990,
    categoryId: 'headsets',
    sellerId: 'user2',
    state: 'Active',
    quantity: 12,
    characteristics: [],
    attachments: [
      { id: 'img2', filePath: '../../../public/mock/mock10.png', productId: '2', product: {} as Product },
      { id: 'img3', filePath: '../../../public/mock/mock14.png', productId: '2', product: {} as Product },
      { id: 'img4', filePath: '../../../public/mock/mock11.png', productId: '2', product: {} as Product },
      { id: 'img5', filePath: '../../../public/mock/mock12.png', productId: '2', product: {} as Product },

    ],
    
  },
  {
    id: '19',
    title: 'Навушники Sordin Supreme Pro X',
    description: 'Професійні тактичні навушники для захисту слуху.',
    price: 5990,
    categoryId: 'headsets',
    sellerId: 'user2',
    state: 'Active',
    quantity: 12,
    characteristics: [],
    attachments: [
      { id: 'img2', filePath: '../../../public/mock/mock11.png', productId: '2', product: {} as Product },
      { id: 'img3', filePath: '../../../public/mock/mock10.png', productId: '2', product: {} as Product },
      { id: 'img4', filePath: '../../../public/mock/mock19.png', productId: '2', product: {} as Product },
      { id: 'img5', filePath: '../../../public/mock/mock12.png', productId: '2', product: {} as Product },

    ],
    
  },
  {
    id: '20',
    title: 'Навушники Sordin Supreme Pro X',
    description: 'Професійні тактичні навушники для захисту слуху.',
    price: 5990,
    categoryId: 'headsets',
    sellerId: 'user2',
    state: 'Active',
    quantity: 12,
    characteristics: [],
    attachments: [
      { id: 'img2', filePath: '../../../public/mock/mock12.png', productId: '2', product: {} as Product },
      { id: 'img3', filePath: '../../../public/mock/mock10.png', productId: '2', product: {} as Product },
      { id: 'img4', filePath: '../../../public/mock/mock11.png', productId: '2', product: {} as Product },
      { id: 'img5', filePath: '../../../public/mock/mock9.png', productId: '2', product: {} as Product },

    ],
    
  },
  {
    id: '21',
    title: 'Навушники Sordin Supreme Pro X',
    description: 'Професійні тактичні навушники для захисту слуху.',
    price: 5990,
    categoryId: 'headsets',
    sellerId: 'user2',
    state: 'Active',
    quantity: 12,
    characteristics: [],
    attachments: [
      { id: 'img2', filePath: '../../../public/mock/mock13.png', productId: '2', product: {} as Product },
      { id: 'img3', filePath: '../../../public/mock/mock10.png', productId: '2', product: {} as Product },
      { id: 'img4', filePath: '../../../public/mock/mock11.png', productId: '2', product: {} as Product },
      { id: 'img5', filePath: '../../../public/mock/mock12.png', productId: '2', product: {} as Product },

    ],
    
  },
  {
    id: '22',
    title: 'Навушники Sordin Supreme Pro X',
    description: 'Професійні тактичні навушники для захисту слуху.',
    price: 5990,
    categoryId: 'headsets',
    sellerId: 'user2',
    state: 'Active',
    quantity: 12,
    characteristics: [],
    attachments: [
      { id: 'img2', filePath: '../../../public/mock/mock14.png', productId: '2', product: {} as Product },
      { id: 'img3', filePath: '../../../public/mock/mock10.png', productId: '2', product: {} as Product },
      { id: 'img4', filePath: '../../../public/mock/mock11.png', productId: '2', product: {} as Product },
      { id: 'img5', filePath: '../../../public/mock/mock12.png', productId: '2', product: {} as Product },

    ],
    
  },{
    id: '23',
    title: 'Навушники Sordin Supreme Pro X',
    description: 'Професійні тактичні навушники для захисту слуху.',
    price: 5990,
    categoryId: 'headsets',
    sellerId: 'user2',
    state: 'Active',
    quantity: 12,
    characteristics: [],
    attachments: [
      { id: 'img2', filePath: '../../../public/mock/mock15.png', productId: '2', product: {} as Product },
      { id: 'img3', filePath: '../../../public/mock/mock10.png', productId: '2', product: {} as Product },
      { id: 'img4', filePath: '../../../public/mock/mock11.png', productId: '2', product: {} as Product },
      { id: 'img5', filePath: '../../../public/mock/mock12.png', productId: '2', product: {} as Product },

    ],
    
  },
  {
    id: '24',
    title: 'Навушники Sordin Supreme Pro X',
    description: 'Професійні тактичні навушники для захисту слуху.',
    price: 5990,
    categoryId: 'headsets',
    sellerId: 'user2',
    state: 'Active',
    quantity: 12,
    characteristics: [],
    attachments: [
      { id: 'img2', filePath: '../../../public/mock/mock16.png', productId: '2', product: {} as Product },
      { id: 'img3', filePath: '../../../public/mock/mock10.png', productId: '2', product: {} as Product },
      { id: 'img4', filePath: '../../../public/mock/mock11.png', productId: '2', product: {} as Product },
      { id: 'img5', filePath: '../../../public/mock/mock12.png', productId: '2', product: {} as Product },

    ],
    
  },
    {
    id: '25',
    title: 'Каремат BLACKHAWK',
    description: 'Каремат.',
    price: 690,
    categoryId: 'equipment',
    sellerId: 'user1',
    state: 'Active',
    quantity: 17,
    characteristics: [],
    attachments: [
      { id: 'img7',filePath: '../../../public/mock/mock31.png', productId: '7', product: {} as Product },
      { id: 'img7',filePath: '../../../public/mock/mock30.png', productId: '7', product: {} as Product },
      { id: 'img7',filePath: '../../../public/mock/mock29.png', productId: '7', product: {} as Product },
      { id: 'img7', filePath: '../../../public/mock/mock28.png', productId: '7', product: {} as Product }
   
    ],
  },
   {
    id: '26',
    title: 'Каремат BLACKHAWK',
    description: 'Каремат.',
    price: 690,
    categoryId: 'equipment',
    sellerId: 'user1',
    state: 'Active',
    quantity: 17,
    characteristics: [],
    attachments: [
      { id: 'img7',filePath: '../../../public/mock/mock30.png', productId: '7', product: {} as Product },
      { id: 'img7',filePath: '../../../public/mock/mock30.png', productId: '7', product: {} as Product },
      { id: 'img7',filePath: '../../../public/mock/mock29.png', productId: '7', product: {} as Product },
      { id: 'img7', filePath: '../../../public/mock/mock28.png', productId: '7', product: {} as Product }
   
    ],
   
  },
  {
    id: '27',
    title: 'Каремат BLACKHAWK',
    description: 'Каремат.',
    price: 690,
    categoryId: 'equipment',
    sellerId: 'user1',
    state: 'Active',
    quantity: 17,
    characteristics: [],
    attachments: [
      { id: 'img7',filePath: '../../../public/mock/mock28.png', productId: '7', product: {} as Product },
      { id: 'img7',filePath: '../../../public/mock/mock27.png', productId: '7', product: {} as Product },
      { id: 'img7',filePath: '../../../public/mock/mock29.png', productId: '7', product: {} as Product },
      { id: 'img7', filePath: '../../../public/mock/mock28.png', productId: '7', product: {} as Product }
   
    ],
   
  },
  {
    id: '28',
    title: 'Каремат BLACKHAWK',
    description: 'Каремат.',
    price: 690,
    categoryId: 'equipment',
    sellerId: 'user1',
    state: 'Active',
    quantity: 17,
    characteristics: [],
    attachments: [
      { id: 'img7',filePath: '../../../public/mock/mock27.png', productId: '7', product: {} as Product },
      { id: 'img7',filePath: '../../../public/mock/mock27.png', productId: '7', product: {} as Product },
      { id: 'img7',filePath: '../../../public/mock/mock29.png', productId: '7', product: {} as Product },
      { id: 'img7', filePath: '../../../public/mock/mock28.png', productId: '7', product: {} as Product }
   
    ],
   
  },{
    id: '29',
    title: 'Тактична куртка M-Tac Softshell',
    description: 'Вітрозахисна тактична куртка для активних дій.',
    price: 1980,
    categoryId: 'clothes',
    sellerId: 'user1',
    state: 'Active',
    quantity: 18,
    characteristics: [],
    attachments: [
      { id: 'img4', filePath: '../../../public/mock/mock22.png', productId: '4', product: {} as Product }
    ],
   
  },
  {
    id: '30',
    title: 'Тактична куртка M-Tac Softshell',
    description: 'Вітрозахисна тактична куртка для активних дій.',
    price: 1980,
    categoryId: 'clothes',
    sellerId: 'user1',
    state: 'Active',
    quantity: 18,
    characteristics: [],
    attachments: [
      { id: 'img4', filePath: '../../../public/mock/mock21.png', productId: '4', product: {} as Product }
    ],
   
  },
  {
    id: '31',
    title: 'Тактична куртка M-Tac Softshell',
    description: 'Вітрозахисна тактична куртка для активних дій.',
    price: 1980,
    categoryId: 'clothes',
    sellerId: 'user1',
    state: 'Active',
    quantity: 18,
    characteristics: [],
    attachments: [
      { id: 'img4', filePath: '../../../public/mock/mock20.png', productId: '4', product: {} as Product }
    ],
   
  },
  {
    id: '32',
    title: 'Тактична куртка M-Tac Softshell',
    description: 'Вітрозахисна тактична куртка для активних дій.',
    price: 1980,
    categoryId: 'clothes',
    sellerId: 'user1',
    state: 'Active',
    quantity: 18,
    characteristics: [],
    attachments: [
      { id: 'img4', filePath: '../../../public/mock/mock19.png', productId: '4', product: {} as Product }
    ],
   
  },
];