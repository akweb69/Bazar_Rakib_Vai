import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import useCart from "../Components/useCart";

const ProductCard = ({ product }) => {
    const { name, image, price, _id } = product;
    const [openModal, setOpenModal] = useState(false);
    const [selectQuantity, setSelectQuantity] = useState(1);
    const [selectedPrice, setSelectedPrice] = useState(price);
    const [loading, setLoading] = useState(false);
    const base_url = import.meta.env.VITE_BASE_URL;
    const itemQuantity = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const { user } = useContext(AuthContext);
    const email = user?.email;
    const { refetch } = useCart();

    // তোমার ব্র্যান্ড কালার
    const primaryColor = "#10B981";

    const handleAddToCart = () => {
        const cartItem = {
            productId: _id,
            name,
            image,
            price: selectedPrice,
            quantity: selectQuantity,
            email: email,
        };

        setLoading(true);
        axios
            .post(`${base_url}/carts`, cartItem)
            .then(() => {
                toast.success("Product added to cart!");
                setOpenModal(false);
                refetch();
            })
            .catch(() => {
                toast.error("Failed to add product to cart.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div>
            {/* Product Card */}
            <div className="bg-white backdrop-blur-md rounded-2xl p-4 hover:shadow-2xl transition-all duration-300 border border-white/20">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-32  object-contain mb-4 rounded-xl "
                />
                <h3 className="text-lg font-bold  mb-2 line-clamp-2">{name}</h3>
                <p className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>
                    RM {price} <span className="text-sm font-medium ">/ Per KG</span>
                </p>

                {/* Add to Cart Button */}
                <button
                    onClick={() => setOpenModal(true)}
                    style={{ backgroundColor: primaryColor }}
                    className="mt-4 w-full text-white font-semibold py-3 rounded-xl hover:brightness-110 transition-all duration-300 shadow-lg"
                >
                    Add to Cart
                </button>
            </div>

            {/* Bottom Sheet Modal */}
            {openModal && (
                <div className="fixed inset-0 z-50 flex justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpenModal(false)}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="absolute bottom-0 left-0 w-full bg-gray-900/95 backdrop-blur-2xl rounded-t-3xl shadow-2xl overflow-hidden"
                        style={{ maxHeight: "90vh" }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setOpenModal(false)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl font-bold hover:bg-white/10 transition"
                            style={{ backgroundColor: primaryColor + "30" }}
                        >
                            ×
                        </button>

                        <div className="p-6 pb-24">
                            {/* Product Info */}
                            <div className="flex gap-5 mb-6">
                                <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 shadow-xl flex-shrink-0"
                                    style={{ borderColor: primaryColor }}>
                                    <img src={image} alt={name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{name}</h3>
                                    <p className="text-3xl font-bold mt-2" style={{ color: primaryColor }}>
                                        RM {selectedPrice.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-8">
                                <label className="text-white font-semibold text-lg block mb-3">
                                    Select Quantity
                                </label>
                                <select
                                    value={selectQuantity}
                                    onChange={(e) => {
                                        const quantity = parseFloat(e.target.value);
                                        setSelectQuantity(quantity);
                                        setSelectedPrice(quantity * price);
                                    }}
                                    className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white text-lg focus:outline-none focus:ring-4"
                                    style={{
                                        borderColor: primaryColor + "60",
                                        ringColor: primaryColor + "40",
                                    }}
                                >
                                    {itemQuantity.map((q) => (
                                        <option key={q} value={q} className="bg-gray-800">
                                            {q} Kg
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Final Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                disabled={loading}
                                style={{ backgroundColor: primaryColor }}
                                className="w-full py-5 text-white font-bold text-xl rounded-2xl shadow-2xl hover:brightness-110 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>Adding...</>
                                ) : (
                                    <>
                                        Add to Cart · RM {selectedPrice.toFixed(2)}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Bottom Glow */}
                        <div
                            className="absolute bottom-0 left-0 right-0 h-32 blur-3xl -z-10 opacity-60"
                            style={{ backgroundColor: primaryColor }}
                        />
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ProductCard;