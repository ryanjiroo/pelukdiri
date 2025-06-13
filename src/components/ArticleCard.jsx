import React from 'react';
const ArticleCard = ({ article, index, inView }) => {
  return (
    <div
      className={`
        bg-[#1B4242] rounded-lg shadow-md overflow-hidden transform 
        transition-all duration-700 ease-out // Durasi transisi
        ${inView ? `opacity-100 translate-y-0 delay-${index * 100}` : 'opacity-0 translate-y-10'} // Animasi fade-up dengan delay
      `}
    >
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <span className="inline-block bg-[#9EC8B9] text-[#092635] text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
          {article.category}
        </span>
        <h3 className="text-xl font-bold text-[#9EC8B9] mb-2 leading-snug">
          {article.title}
        </h3>
        <p className="text-[#D6FFEF] text-sm mb-4 line-clamp-3">
          {article.description}
        </p>
        <a
          href={`/artikel/${article.id}`}
          className="inline-flex items-center text-[#5C8374] font-semibold hover:text-[#9EC8B9] transition-colors"
        >
          Baca Selengkapnya
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ArticleCard;