import React from "react";
import { Checkbox, InputNumber, Slider, Button } from "antd";

type Filters = {
  producers: string[];
  colors: string[];
  priceMin: number;
  priceMax: number;
};

type ProductFiltersProps = {
  filters: Filters;
  onChange: (key: keyof Filters, value: any) => void;
};

const producersList = ["Nitecore", "Leatherman", "Opinel", "Turbat", "Combat", "FAST"];
const colorsList = ["Чорний", "Олива", "Сірий", "Пісочний", "Жовтий"];

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onChange }) => {
  const handleCheckboxGroupChange = (key: keyof Filters, checkedValues: any) => {
    onChange(key, checkedValues);
  };

  return (
    <div className="rounded-lg bg-[#f4f5ea] p-4 w-full max-w-sm border border-[#C9CFB8] mb-6">
      <h3 className="text-lg font-semibold text-[#2b3924] mb-2">Всі фільтри</h3>

      <div className="mb-4">
        <h4 className="font-medium text-[#2b3924] mb-1">Виробник</h4>
        <Checkbox.Group
          options={producersList}
          value={filters.producers}
          onChange={(vals) => handleCheckboxGroupChange("producers", vals)}
        />
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-[#2b3924] mb-1">Колір</h4>
        <Checkbox.Group
          options={colorsList}
          value={filters.colors}
          onChange={(vals) => handleCheckboxGroupChange("colors", vals)}
        />
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-[#2b3924] mb-1">Ціна</h4>
        <div className="flex gap-2 mb-2">
          <InputNumber
            min={0}
            value={filters.priceMin}
            onChange={(val) => onChange("priceMin", val ?? 0)}
            style={{ width: "100%" }}
          />
          <span className="self-center">-</span>
          <InputNumber
            min={0}
            value={filters.priceMax}
            onChange={(val) => onChange("priceMax", val ?? 0)}
            style={{ width: "100%" }}
          />
        </div>
        <Slider
          range
          min={0}
          max={50000}
          value={[filters.priceMin, filters.priceMax]}
          onChange={(vals) => {
            onChange("priceMin", vals[0]);
            onChange("priceMax", vals[1]);
          }}
        />
      </div>

      <div className="flex justify-between gap-3">
        <Button
          type="primary"
          className="flex-1"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1) 250%), #8D8C5F",
            backgroundBlendMode: "multiply",
            border: "none",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 6
          }}
        >
          Застосувати
        </Button>

        <Button
          className="flex-1"
          onClick={() => {
            onChange("producers", []);
            onChange("colors", []);
            onChange("priceMin", 0);
            onChange("priceMax", 50000);
          }}
        >
          Скасувати
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;
