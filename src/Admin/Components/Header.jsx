
const Header = () => {
    return (
        <div className="w-full bg-orange-100">
            <div className="w-11/12 mx-auto h-14 flex items-center justify-between gap-4 ">
                <div className="">
                    <h1 className=" font-bold text-orange-500">Admin Dashboard</h1>
                    <p className="text-xs">
                        Welcome, Rakib Vai!
                    </p>
                </div>
                {/* right side */}
                <div className="">
                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                        R
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;