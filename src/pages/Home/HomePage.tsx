// src/pages/Home/ui/HomePage.tsx
import Slide from "../../components/MainScreen/slider"
import ProductPage from "../../components/MainScreen/Product";
import Banner from "../../components/MainScreen/banner"
import AboutUs from "../../components/MainScreen/AboutUs";
import Advantages from "../../components/MainScreen/Advantages";
import Protocols from "../../components/MainScreen/Protocols";

const HomePage = () => {
  return (
    <div>
      <Slide />
      <ProductPage />
      <Banner />
      <AboutUs />
      <Advantages/>
      <Protocols />
    </div>
  );
};

export default HomePage;
