import { FaCog } from "react-icons/fa";
import type { Product } from "@shared/types/api";


export const product= {
  id: "1",
  description: "Найвищий захист і комфорт у кожній деталі...",
  material: "Арамідне волокно / Кевлар",
  protectionLevel: "NIJ IIIA (захист від 9 мм FMJ, .44 Magnum)",
  weight: "~1.3–1.5 кг (залежно від розміру)",
  sizes: "M / L / XL",
  mountSystem: "3 бокові рейки для аксесуарів (ПНБ, ліхтар, гарнітура), платформа для кріплення NVG",
  suspensionSystem: "4-точковий ремінець із м’якими подушечками для комфортного носіння",
  covering: "Матова, стійка до зовнішніх чинників (волога, УФ-промені)",
  extra: "Панель для патчів (велкро), можливість кріплення чохлів для камуфляжу"
};



export const ProductSpecsBlock = ()  => (
  <div >
    <h2 className="text-[1.8rem] font-bold flex items-center mb-2 text-[#0E120A]">
      <FaCog className="mr-2 text-[#454E30]" /> Характеристики
    </h2>
    <table className="w-full font-monserrat text-[#0E120A] mt-2">
      <tbody>
        <tr><td className="font-bold py-1">Матеріал</td><td>{product.material}</td></tr>
        <tr><td className="font-bold py-1">Рівень захисту</td><td>{product.protectionLevel}</td></tr>
        <tr><td className="font-bold py-1">Вага</td><td>{product.weight}</td></tr>
        <tr><td className="font-bold py-1">Розміри</td><td>{product.sizes}</td></tr>
        <tr><td className="font-bold py-1">Система кріплень</td><td>{product.mountSystem}</td></tr>
        <tr><td className="font-bold py-1">Підвісна система</td><td>{product.suspensionSystem}</td></tr>
        <tr><td className="font-bold py-1">Покриття</td><td>{product.covering}</td></tr>
        <tr><td className="font-bold py-1">Додаткове оснащення</td><td>{product.extra}</td></tr>
      </tbody>
    </table>
  </div>
);
