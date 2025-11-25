import { useEffect } from "react";

const ProductDetailsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="w-11/12 mx-auto">
            Product Details page


        </div>
    );
};

export default ProductDetailsPage;
