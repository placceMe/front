import AboutUs from "../../../app/layouts/delete/MainScreen/AboutUs";
import Advantages from "../../../app/layouts/delete/MainScreen/Advantages";
import Banner from "../../../app/layouts/delete/MainScreen/banner";
import ProductPage from "../../../app/layouts/delete/MainScreen/Product";
import Protocols from "../../../app/layouts/delete/MainScreen/Protocols";
import Slide from "../../../app/layouts/delete/MainScreen/slider";

const HomePage = () => {
  return (
  <div>
      <div className="container section"><Slide /></div>
      <div className="container section"><ProductPage /></div>
      <div className="container section"><Banner /></div>
      <div className="container section"><AboutUs /></div>
      <div className="container section"><Advantages /></div>
      <div className="container section"><Protocols /></div>
    </div>
  );
};

export default HomePage;