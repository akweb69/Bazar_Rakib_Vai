import { Outlet } from 'react-router-dom';
import BottomNav from '../Components/BottomNav';
import Header from '../Components/Header';

const AdminLayout = () => {
    return (
        <>
            {/* header */}
            <div className="fixed top-0 z-50 w-full"><Header /></div>
            <div className=" w-full ">
                <Outlet />
            </div>
            {/* footer */}
            <div className="fixed bottom-0 z-50 w-full"><BottomNav /></div>

        </>
    );
};

export default AdminLayout;