
const Header = () => {
    return (
        <div className='w-full h-14 bg-orange-200/40 sticky top-0 z-50 shadow-sm backdrop-blur-md'>
            <div className="w-11/12 mx-auto flex items-center justify-between h-full gap-4">

                {/* left side logo */}
                <div className="text-xl font-bold text-orange-600">Bazar</div>
                {/* right side profile */}
                <div className="">

                    <div className="h-10 w-10 rounded-full bg-orange-500 flex justify-center items-center text-white font-bold">R</div>

                </div>

            </div>
        </div>
    );
};

export default Header;