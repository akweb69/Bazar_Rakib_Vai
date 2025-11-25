
const BottomNavUser = () => {
    return (
        <div className="fixed bottom-0 left-0 w-full h-14 bg-orange-200/40 backdrop-blur-md">
            <div className="w-11/12 mx-auto py-3 grid grid-cols-3 gap-4 items-center">
                <div className="">Home</div>
                <div className="">Orders</div>
                <div className="">Category</div>
            </div>
        </div>
    );
};

export default BottomNavUser;