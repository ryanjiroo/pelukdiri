import React from 'react';

const Card = ({
  title,
  description,
  children,
  bgColor = "white",
  titleColor = "#1B4242",
  descColor = "#5C8374"
}) => (
  <div
    // Remove max-w-sm to allow the card to expand based on its parent container
    // Use responsive padding and perhaps a min-width/max-width for better control
    className="relative rounded-2xl shadow-lg p-6 sm:p-8 w-full hover:scale-105 hover:shadow-xl transition-transform duration-300 bg-opacity-95 overflow-hidden
               flex flex-col justify-between items-center text-center" // Added flex for better content distribution
    style={{ backgroundColor: bgColor }}
  >
    {/* Wave Animation */}
    <div className="absolute left-0 bottom-0 w-full h-8 sm:h-12 pointer-events-none z-0 overflow-hidden"> {/* Increased wave height for better visibility */}
      <div className="relative w-[200%] h-full">
        <svg
          className="absolute left-0 top-0 w-1/2 h-full animate-wave"
          viewBox="0 0 200 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 12 Q 25 24 50 12 T 100 12 T 150 12 T 200 12 V24 H0Z"
            fill={descColor}
            opacity="0.15"
          />
        </svg>
        <svg
          className="absolute left-1/2 top-0 w-1/2 h-full animate-wave"
          viewBox="0 0 200 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 12 Q 25 24 50 12 T 100 12 T 150 12 T 200 12 V24 H0Z"
            fill={descColor}
            opacity="0.15"
          />
        </svg>
      </div>
    </div>
    <style>
      {`
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave {
          animation: wave 3s linear infinite;
        }
      `}
    </style>
    <div className="relative z-10 flex flex-col items-center flex-grow"> {/* Added flex-grow to ensure content takes available space */}
      {title && (
        <h2
          className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 tracking-tight text-center leading-tight" // Adjusted text size, margin, and leading
          style={{ color: titleColor }} // Removed fixed letterSpacing
        >
          {title}
          <div
            className="mx-auto mt-2"
            style={{
              width: '2.5rem', // Using rem for responsive width (40px)
              height: '0.25rem', // Using rem for responsive height (4px)
              borderRadius: '0.125rem', // Using rem for responsive border-radius (2px)
              background: descColor,
              opacity: 0.7,
            }}
          />
        </h2>
      )}
      {description && (
        <p
          className="mb-4 text-sm sm:text-base leading-relaxed italic text-center" // Adjusted text size
          style={{ color: descColor }}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  </div>
);

export default Card;