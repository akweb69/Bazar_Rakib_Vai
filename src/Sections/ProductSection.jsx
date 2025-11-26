import axios from "axios";
import { useEffect, useState } from "react";

const ProductSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const base_url = import.meta.env.VITE_BASE_URL;

    // load data --->
    useEffect(() => {
        setLoading(true);
        axios.get(`${base_url}/products`)
            .then(res => {
                const data = res.data;
                setProducts(data);
                console.log(data);
            }
            ).catch(() => {
                setProducts([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [])


    return (
        <div className="w-full ">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-orange-500 font2">
                Products
            </h2>

        </div>
    );
};

export default ProductSection;