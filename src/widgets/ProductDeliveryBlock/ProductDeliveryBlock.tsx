import Location from '@assets/icons/location.svg?react'
import NovaPoshta from '@assets/icons/novaposhta.svg?react'
import { GlassCard } from '@shared/ui/GlassCard/GlassCard';

const DELIVERY_OPTIONS = [
  { label: 'Самовивіз з Нової Пошти' },
  { label: 'Самовивіз з поштоматів Нової Пошти' },
  { label: "Кур'єр Нової Пошти" },
];

export const ProductDeliveryBlock = () => (
  <GlassCard>
    <div className="flex items-center gap-1">
      <Location />
      <span className="font-montserrat font-semibold text-[18px] text-color05">
        Доставка
      </span>
      <span className="font-montserrat font-normal text-[15px] text-color05 ml-1">
        в Дніпро
      </span>
    </div>

    {DELIVERY_OPTIONS.map(opt => (
      <div key={opt.label} className="flex items-center gap-2">
        <NovaPoshta />
        <span className="font-montserrat font-normal text-[15px] text-color05">
          {opt.label}
        </span>
      </div>
    ))}

    <div>
      <span className="font-montserrat font-semibold text-[18px] text-color05">
        Доставка згідно з тарифами перевізника
      </span>
    </div>
  </GlassCard>
);
