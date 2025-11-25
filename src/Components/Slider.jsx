import React, { useState, useEffect } from 'react';

const Slider = () => {
    const sliders = [
        "https://i.ibb.co/CKYZJBtD/Orange-and-Yellow-Countdown-Sale-Facebook-Post.png",
        "https://i.ibb.co/fYyw1YWV/1000803746.png",
        "https://i.ibb.co/v6rsMRfH/1000803700.png",
        "https://i.ibb.co/MxTKb0wM/1000803665.png"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-play
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % sliders.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [sliders.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % sliders.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full overflow-hidden">
            {/* Slider Container */}
            <div className="relative overflow-hidden rounded-xl shadow-2xl">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {sliders.map((src, index) => (
                        <div key={index} className="w-full  aspect-[16/9] flex-shrink-0">
                            <img
                                src={src}
                                alt={`Banner ${index + 1}`}
                                className="w-full h-full block"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>

                {/* Left Arrow */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    aria-label="Previous"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Right Arrow */}
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
                    aria-label="Next"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                    {sliders.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 ${index === currentIndex
                                ? 'w-10 h-3 bg-white rounded-full shadow-lg'
                                : 'w-3 h-3 bg-white/60 hover:bg-white/90 rounded-full'
                                }`}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>


        </div>
    );
};

export default Slider;