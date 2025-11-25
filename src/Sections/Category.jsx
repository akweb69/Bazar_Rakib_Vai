import React from 'react';
import {
    FaMobileAlt, FaLaptop, FaTshirt, FaHeadphones,
    FaGamepad, FaCamera, FaHome, FaHeart
} from 'react-icons/fa';
import { GiLipstick, GiRunningShoe } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';

const Category = () => {
    const data = [
        { _id: 1, name: 'মোবাইল', icon: FaMobileAlt, color: 'bg-blue-500' },
        { _id: 2, name: 'ল্যাপটপ', icon: FaLaptop, color: 'bg-purple-500' },
        { _id: 3, name: 'ফ্যাশন', icon: FaTshirt, color: 'bg-pink-500' },
        { _id: 4, name: 'ইলেকট্রনিক্স', icon: FaHeadphones, color: 'bg-indigo-500' },
        { _id: 5, name: 'গেমিং', icon: FaGamepad, color: 'bg-green-500' },
        { _id: 6, name: 'ক্যামেরা', icon: FaCamera, color: 'bg-red-500' },
        { _id: 7, name: 'বিউটি', icon: GiLipstick, color: 'bg-rose-500' },
        { _id: 8, name: 'জুতা', icon: GiRunningShoe, color: 'bg-amber-500' },
        { _id: 9, name: 'হোম & লিভিং', icon: FaHome, color: 'bg-teal-500' },
        { _id: 10, name: 'হেলথ', icon: FaHeart, color: 'bg-emerald-500' },
    ];
    const navigate = useNavigate();
    // handle navigation--->
    const handleNavigation = (path) => {
        navigate(`/category/${path}`);
    }
    return (
        <div className="py-8">
            <div className=" mx-auto">
                {/* Section Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
                    জনপ্রিয় ক্যাটাগরি
                </h2>

                {/* Category Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 md:gap-6">
                    {data.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div

                                key={item._id}
                                className="group cursor-pointer transform transition-all duration-300 hover:scale-110"
                            >
                                <div
                                    onClick={() => handleNavigation(item.name)}
                                    className="flex flex-col items-center space-y-2">
                                    {/* Icon Circle */}
                                    <div
                                        className={`${item.color} p-4 md:p-5 rounded-full shadow-lg group-hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-2`}
                                    >
                                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                    </div>

                                    {/* Category Name */}
                                    <p className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-gray-900 text-center whitespace-nowrap">
                                        {item.name}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Category;