import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import BottomNavUser from "../Common/BottomNavUser";

const HomePageLayout = () => {
    return (
        <>
            <Header />
            {/* outlet */}
            <div className="min-h-screen mt-4 pb-20">
                <Outlet />
            </div>
            {/* Footer */}
            <BottomNavUser />
            <Footer />
        </>
    );
};

export default HomePageLayout;