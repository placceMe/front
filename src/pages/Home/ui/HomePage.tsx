import AboutUs from "../../../app/layouts/delete/MainScreen/AboutUs";
import Advantages from "../../../app/layouts/delete/MainScreen/Advantages";
import Banner from "../../../app/layouts/delete/MainScreen/banner";
import ProductPage from "../../../app/layouts/delete/MainScreen/Product";
import Protocols from "../../../app/layouts/delete/MainScreen/Protocols";
import Slide from "../../../app/layouts/delete/MainScreen/slider";

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