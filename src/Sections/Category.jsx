import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const base_url = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`${base_url}/categories`)
            .then(res => {
                const data = res.data;
                setCategories(data);
                console.log(data);
            })
            .catch(() => {
                setCategories([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleNavigation = (name) => {
        const slug = name.trim().replace(/\s+/g, '-').toLowerCase();
        navigate(`/category/${slug}`);
    };

    // Loading Skeleton
    if (loading) {
        return (
            <div className="w-full">
                <h2 className="text-3xl font-semibold text-center mb-10 text-emerald-500 font2">
                    Categories
                </h2>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-5 w-full">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-100 border-2 border-dashed border-emerald-300 rounded-full animate-pulse" />
                            <div className="h-3 bg-emerald-100 rounded-full w-16 mt-2 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <div className="w-full">
                <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-emerald-500 font2">
                    Categories
                </h2>

                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 md:gap-6">
                    {categories?.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => handleNavigation(item?.name)}
                            className="group cursor-pointer transform transition-all duration-300 hover:scale-110 hover:z-10"
                        >
                            <div className="flex flex-col items-center space-y-3 p-3 rounded-2xl hover:bg-white hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-emerald-200">

                                {/* Category Image */}
                                <div className="relative">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-4 border-white shadow-lg group-hover:border-emerald-400 transition-all duration-300"
                                        onError={(e) => {
                                            e.target.src = "https://i.ibb.co/7yz7Yg7/placeholder.png";
                                        }}
                                    />
                                    {/* Hover Glow Effect - Emerald */}
                                    <div className="absolute inset-0 rounded-full shadow-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-300 bg-emerald-400 blur-xl -z-10 scale-110"></div>
                                </div>

                                {/* Category Name */}
                                <p className="text-xs md:text-sm font-semibold text-gray-700 group-hover:text-emerald-600 text-center px-1 line-clamp-2 transition-colors duration-300">
                                    {item?.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Category;