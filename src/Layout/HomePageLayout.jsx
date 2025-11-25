import { Outlet } from "react-router-dom";
import Header from "../Common/Header";
import Footer from "../Common/Footer";

const HomePageLayout = () => {
    return (
        <>
            <Header />
            {/* outlet */}
            <div className="min-h-screen">
                <Outlet />
            </div>
            {/* Footer */}
            <Footer />
        </>
    );
};

export default HomePageLayout;