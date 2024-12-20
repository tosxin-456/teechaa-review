import React, { useState, useEffect } from 'react';

const images = [
    {
        src: require('../assets/dashbaord_movement/Online test-rafiki.svg').default,
        title: 'Take online quizzes to test your knowledge',
    },
    {
        src: require('../assets/dashbaord_movement/Teacher student-rafiki.svg').default,
        title: 'Connect with your teachers and students',
    },
    {
        src: require('../assets/dashbaord_movement/Bookshop-rafiki.svg').default,
        title: 'Explore our online bookshop for learning materials',
    },
    {
        src: require('../assets/dashbaord_movement/Recommendation letter-rafiki.svg').default,
        title: 'Receive personalized learning recommendations',
    },
    {
        src: require('../assets/dashbaord_movement/Performance overview-rafiki.svg').default,
        title: 'Track your performance with detailed analytics',
    },
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate images
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    const goToNextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const goToPrevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="flex flex-col items-center max-w-lg mx-auto">
            <div className="relative mt-[-50px] w-full md:w-[80%]">
                {/* Navigation Buttons */}
                <div className="text-center">
                    {/* Image */}
                    <img
                        src={images[currentIndex].src}
                        alt={images[currentIndex].title}
                        className="w-full max-w-md mx-auto rounded-lg "
                    />
                    {/* Title */}
                    <p className="mt-[-40px] text-lg font-semibold text-gray-700">
                        {images[currentIndex].title}
                    </p>
                </div>
            </div>

            {/* Indicators */}
            <div className="flex space-x-2 mt-4">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-5 h-3 rounded-2xl ${currentIndex === index ? 'bg-gray-800' : 'bg-gray-400'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
