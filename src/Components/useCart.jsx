import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const useCart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { user } = useContext(AuthContext);
    const email = user?.email;

    const base_url = import.meta.env.VITE_BASE_URL;

    // ============================
    // 🔥 REFETCH FUNCTION
    // ============================
    const fetchCart = useCallback(() => {
        if (!email) {
            setCart([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        axios
            .get(`${base_url}/carts/${email}`)
            .then((res) => {
                setCart(res.data || []);
            })
            .catch((err) => {
                setError(err);
                setCart([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [email, base_url]);

    // Initial load
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    return { cart, loading, error, refetch: fetchCart };
};

export default useCart;
