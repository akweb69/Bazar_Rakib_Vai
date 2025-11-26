import Category from "../Sections/Category";
import HeroSection from "../Sections/HeroSection";
import ProductSection from "../Sections/ProductSection";


const HomePage = () => {
    return (
        <div className="w-11/12 mx-auto">
            <HeroSection />
            <Category />
            <ProductSection />


        </div>
    );
};

export default HomePage;