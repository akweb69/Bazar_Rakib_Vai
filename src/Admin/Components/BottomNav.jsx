import { ChevronsLeftRightEllipsis, HomeIcon, Images, List, ShoppingBagIcon } from "lucide-react";
import { Link } from "react-router-dom";

const BottomNav = () => {

    const navItemData = [
        { id: 1, name: "Home", path: "", icon: <HomeIcon className="w-5 h-5" /> },
        { id: 2, name: "Products", path: "products", icon: <List className="w-5 h-5" /> },
        { id: 3, name: "Order", path: "order", icon: <ShoppingBagIcon className="w-5 h-5" /> },
        { id: 4, name: "Slider", path: "slider", icon: <Images className="w-5 h-5" /> },
        { id: 5, name: "Web Data", path: "web-data", icon: <ChevronsLeftRightEllipsis className="w-5 h-5" /> },
    ]
    return (
        <div className="w-full h-16 bg-orange-50 py-4">
            <div className="w-11/12 mx-auto grid grid-cols-5 gap-4">
                {navItemData.map((item) => (
                    <Link
                        className=""
                        to={`/admin/${item.path}`}>
                        <div key={item.id} className="flex flex-col items-center justify-center text-gray-600 hover:text-orange-500 cursor-pointer">
                            {item.icon}
                            <span className="ml-1 text-xs mt-1">{item.name}</span>
                        </div>
                    </Link>
                ))}

            </div>
        </div>
    );
};

export default BottomNav;