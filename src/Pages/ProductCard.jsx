import { motion } from "framer-motion";
import { useState } from "react";

const ProductCard = ({ product }) => {
    const { name, image, price, _id } = product;
    const [openModal, setOpenModal] = useState(false);
    const [selectQuantity, setSelectQuantity] = useState(1);
    const [selectedPrice, setSelectedPrice] = useState(price);
    const [loading, setLoading] = useState(false);
    const base_url = import.meta.env.VITE_BASE_URL;
    const itemQuantity = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];



    return (
        <div>

            <div className="border border-orange-300 rounded-lg p-4 hover:shadow-lg bg-white transition-shadow duration-300">
                <img src={image} alt={name} className="w-full h-40 object-contain mb-4 rounded-md" />
                <h3 className="text-lg font-semibold mb-2">{name}</h3>
                <p className="text-orange-500 font-bold text-xl">RM {price}</p>
                {/* order now btn */}
                <button
                    onClick={() => setOpenModal(true)}
                    className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors duration-300"
                >
                    Order Now
                </button>



            </div>

            {/* openModal */}
            {
                openModal && (
                    <div className="relative">
                        {/* Modal content would go here */}
                        {/* view form bottom */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: "0%" }}
                            exit={{ y: "100%" }}
                            transition={{ type: "tween", duration: 0.4 }}
                            className="bg-orange-300/20 backdrop-blur-md fixed bottom-0 left-0 w-full z-50 p-4 rounded-t-2xl shadow-lg py-6 pb-20 ">

                            {/* close btn */}
                            <div
                                onClick={() => setOpenModal(false)}
                                className="absolute top-3 right-3 h-10 w-10 rounded-full bg-orange-500 text-white flex justify-center items-center p-1 cursor-pointer b">X </div>


                            <div className="rounded-lg bg-white/80 p-4">
                                <img src={image} alt={name} className="w-20 h-20  object-contain mb-4 rounded-lg" />

                                <div className="">{name}</div>
                                <div className="text-orange-500 font-bold text-lg">RM {selectedPrice}</div>

                                <div className="flex items-center mt-4 w-full">
                                    <span className="text-gray-900 font-semibold mr-2">Quantity:</span>
                                    <select
                                        value={selectQuantity}
                                        onChange={(e) => {
                                            const quantity = parseFloat(e.target.value);
                                            setSelectQuantity(quantity);
                                            setSelectedPrice(quantity * price);
                                        }}
                                        className="border border-gray-300 rounded-md p-2 w-[100px]"
                                    >
                                        {itemQuantity.map((quantity) => (
                                            <option
                                                key={quantity} value={quantity}>
                                                {quantity} Kg
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* order now btn */}
                                <button
                                    onClick={() => setOpenModal(false)}
                                    className="mt-4 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors duration-300"
                                >
                                    Order Now
                                </button>
                            </div>



                        </motion.div>
                    </div>
                )
            }
        </div>
    );
};

export default ProductCard;