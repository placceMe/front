import { useDispatch, useSelector } from "react-redux";
import { setCurrency } from "@shared/currency/model/currencySlice";

import { Dropdown, type MenuProps, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { RootState } from "@store/store";

const currencies = ["UAH", "USD", "EUR"] as const;

export const CurrencySwitcher = () => {
  const dispatch = useDispatch();
  const current = useSelector((state: RootState) => state.currency.current);

  const items: MenuProps["items"] = currencies.map((cur) => ({
    key: cur,
    label: cur,
  }));

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    dispatch(setCurrency(key as any));
  };

  return (
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      placement="bottomRight"
      arrow
    >
      <Button
        style={{
          backgroundColor: "#E5AC30",
          color: "#fff",
          borderColor: "#E5AC30",
          fontWeight: 600,
        }}
      >
        {current} <DownOutlined />
      </Button>
    </Dropdown>
  );
};
