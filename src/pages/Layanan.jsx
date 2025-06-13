import React, { useRef, useEffect, useState } from 'react';
import Card from '../components/Card';

const cardsData = [
    {
        title: "Chatbot Interaktif",
        description: "Temukan ketenangan dalam percakapan dengan chatbot AI kami hadir memberi dukungan, jawaban bijak, dan saran bermakna, kapan pun kau butuh.",
        bgColor: "#092635",
        titleColor: "#9EC8B9",
        descColor: "#9EC8B9"
    },
    {
        title: "Artikel Inspiratif",
        description: "Baca artikel yang membantumu memahami diri, mengelola emosi, dan menemukan inspirasi untuk perjalanan hidup yang lebih baik.",
        bgColor: "#092635",
        titleColor: "#9EC8B9",
        descColor: "#9EC8B9"
    },
    {
        title: "Check In Harian",
        description: "Lakukan check in harian untuk memantau suasana hati dan perkembangan dirimu secara rutin dengan fitur yang mudah digunakan.",
        bgColor: "#092635",
        titleColor: "#9EC8B9",
        descColor: "#9EC8B9"
    },
    {
        title: "Group Support",
        description: "Pantau suasana hati orang terdekatmu dan berbicaralah dengan mereka melalui fitur Group Support .",
        bgColor: "#092635",
        titleColor: "#9EC8B9",
        descColor: "#9EC8B9"
    }
];

// Pastikan CARD_BASE_WIDTH dan CARD_GAP didefinisikan
const CARD_BASE_WIDTH = 300; // px - base width for cards (still useful as a reference)
const CARD_GAP = 32; // px (gap-8 di Tailwind)

const Layanan = () => {
    const aboutRef = useRef(null);
    const scrollRef = useRef(null);
    const [showAnim, setShowAnim] = useState(false);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(3); // Default for larger screens

    useEffect(() => {
        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setShowAnim(true);
            },
            { threshold: 0.2 }
        );
        if (aboutRef.current) observer.observe(aboutRef.current);
        return () => observer.disconnect();
    }, []);

    // Determine how many cards to show based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) { // md breakpoint is 768px in Tailwind
                setCardsToShow(1);
            } else {
                setCardsToShow(3); // Display 3 cards on desktop and larger screens
            }
        };

        handleResize(); // Set initially
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Auto scroll logic
    useEffect(() => {
        if (cardsData.length <= cardsToShow) {
            setScrollIndex(0); // Reset scrollIndex when not auto-scrolling
            return;
        }

        const interval = setInterval(() => {
            setScrollIndex(prev => {
                const maxIndex = cardsData.length - cardsToShow;
                return prev >= maxIndex ? 0 : prev + 1;
            });
        }, 3500); // Auto slide every 3.5 seconds

        return () => clearInterval(interval);
    }, [cardsToShow, cardsData.length]);

    useEffect(() => {
        if (!scrollRef.current) return;

        let scrollAmount = 0;
        // Calculate scroll amount based on the actual width of a single card slot including its gap
        if (cardsToShow === 1) {
            // For 1 card, scroll by the full width of the scroll container
            scrollAmount = scrollIndex * scrollRef.current.clientWidth;
        } else {
            // For 3 cards, scroll by the width of one card plus its share of the gap
            // We can get the actual width of the first card element if available
            const firstCardElement = scrollRef.current.children[0];
            if (firstCardElement) {
                // The clientWidth of the scrollRef already accounts for its own padding.
                // We need to divide that by the number of cards shown, and add the gap.
                // A simpler way for desktop is to just scroll by one card's calculated width + gap.
                scrollAmount = scrollIndex * (firstCardElement.offsetWidth + CARD_GAP);
            } else {
                // Fallback (shouldn't happen if cardsData is not empty)
                scrollAmount = scrollIndex * (300 + 32);
            }
        }

        scrollRef.current.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }, [scrollIndex, cardsToShow]);

    return (
        <div
            ref={aboutRef}
            className="min-h-fit bg-[#9EC8B9] flex flex-col items-center text-center px-4 py-12"
        >
            <h1 className={`text-5xl font-bold text-[#1B4242] mb-12 transition-all duration-700 ${showAnim ? 'animate-fade-in-down' : 'opacity-0 translate-y-10'}`}>
                Layanan Kami
            </h1>
            <div className={`w-12 h-2 mx-auto mb-12 rounded-full transition-all duration-700 ${showAnim ? 'bg-[#1B4242] scale-x-100 opacity-100' : 'bg-[#1B4242] scale-x-0 opacity-0'}`}></div>
            <div
                ref={scrollRef}
                // Updated classes: removed inline padding styles and relied on Tailwind classes
                className={`flex w-full overflow-x-auto no-scrollbar gap-8
                           transition-all duration-700
                           ${showAnim ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}
                           py-8 px-4 md:px-8 lg:max-w-5xl lg:mx-auto`} 
                style={{
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {cardsData.map((card, idx) => (
                    <div
                        key={idx}
                        className={`flex-shrink-0 flex items-stretch`}
                        style={{
                            // Updated minWidth/maxWidth calculations
                            // For 1 card on mobile: use 100% of parent width, minus its own gap on one side
                            // The `px-4` on the parent `.Layanan` container already creates side padding.
                            // The `px-4 md:px-8` on `scrollRef` also creates padding.
                            // We want the card to take the full space of `scrollRef` at `cardsToShow === 1`.
                            // So `100%` is usually correct, or `calc(100% - <some_small_margin_for_overflow>)`.
                            minWidth: cardsToShow === 1 ? 'calc(100% - 0px)' : `calc((100% / 3) - (${CARD_GAP}px * 2 / 3))`,
                            maxWidth: cardsToShow === 1 ? 'calc(100% - 0px)' : `calc((100% / 3) - (${CARD_GAP}px * 2 / 3))`,
                            minHeight: '300px',
                            maxHeight: '300px',
                            scrollSnapAlign: 'start',
                            display: 'flex',
                            alignItems: 'stretch'
                        }}
                    >
                        <Card {...card} style={{ height: '100%' }} />
                    </div>
                ))}
            </div>
            <style>
                {`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes fade-in-down {
            0% { opacity: 0; transform: translateY(-40px);}
            100% { opacity: 1; transform: translateY(0);}
          }
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(40px);}
            100% { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in-down {
            animation: fade-in-down 1s cubic-bezier(0.4,0,0.2,1) both;
          }
          .animate-fade-in-up {
            animation: fade-in-up 1s cubic-bezier(0.4,0,0.2,1) both;
          }
        `}
            </style>
        </div>
    );
};

export default Layanan;