import type{ NavigateFunction } from "react-router-dom";

export const goToCheckout = (navigate: NavigateFunction) => {
  navigate("/checkout");
};
