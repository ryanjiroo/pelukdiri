import React, { useState } from 'react';
import ArticleCard from '../components/ArticleCard';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom'; // Pastikan Link diimpor

// --- Dummy Data Artikel (tidak berubah, sesuaikan URL gambar jika perlu) ---
const allArticles = [
  { id: 1, category: 'Kesehatan Mental', title: 'Manajemen Stres: Kunci Kesejahteraan Emosional', description: 'Pelajari teknik sederhana untuk mengelola stres sehari-hari dan meningkatkan kesehatan mental Anda. Temukan ketenangan di tengah hiruk pikuk hidup.', fullContent: '**Stres** adalah bagian tak terhindarkan dari hidup. Namun, bagaimana kita mengelolanya sangat memengaruhi kesejahteraan emosional kita. Artikel ini akan membahas teknik **mindfulness**, latihan pernapasan, dan pentingnya tidur yang cukup untuk mengurangi tingkat stres harian. Belajar untuk mengenali pemicu stres dan mengembangkan strategi coping yang sehat adalah langkah awal menuju kehidupan yang lebih tenang dan bahagia.', image: 'https://assets.nsd.co.id/artikel/efa7ba3b-2a3a-4e35-8797-159022e8cce2.png' },
  { id: 2, category: 'Judi Online', title: 'Bahaya Judi Online: Kenali dan Hindari Dampaknya', description: 'Memahami risiko dan dampak negatif dari keterlibatan dalam judi online, serta cara menghindarinya. Lindungi diri dan keluarga Anda.', fullContent: 'Judi online telah menjadi ancaman serius bagi banyak individu dan keluarga. Ini bukan hanya tentang kerugian finansial, tetapi juga dampak psikologis dan sosial yang parah, termasuk masalah hubungan, isolasi, kecemasan, depresi, dan bahkan pemikiran untuk bunuh diri. Penting untuk menyadari tanda-tanda peringatan, seperti menghabiskan lebih banyak waktu atau uang dari yang direncanakan, menyembunyikan kebiasaan judi, mengabaikan tanggung jawab, atau merasakan dorongan yang kuat untuk berjudi saat stres atau bosan. Mencari bantuan profesional adalah langkah penting untuk pemulihan.', image: 'https://dkis.cirebonkota.go.id/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-19-at-08.01.45-1024x576.jpeg' },
  { id: 3, category: 'Motivasi', title: 'Membangun Resiliensi: Bangkit dari Setiap Tantangan', description: 'Temukan cara untuk mengembangkan kekuatan batin dan bangkit dari setiap kesulitan hidup. Jadikan tantangan sebagai peluang untuk bertumbuh.', fullContent: 'Resiliensi adalah kemampuan untuk beradaptasi dan pulih dari kesulitan. Ini bukan berarti Anda tidak akan mengalami kesulitan, tetapi Anda akan memiliki alat untuk menghadapinya. Kembangkan pola pikir positif, belajar dari pengalaman, dan pertahankan hubungan sosial yang kuat. Penting untuk mempraktikkan self-compassion dan mengingat bahwa tidak apa-apa untuk meminta bantuan. Setiap tantangan adalah kesempatan untuk belajar dan menjadi lebih kuat.', image: 'https://komunitas.schoolofparenting.id/images/vod/thumbnail-kvb-resiliensi.jpg' },
  { id: 4, category: 'Kesehatan Mental', title: 'Mindfulness: Kunci Hidup Lebih Tenang dan Fokus', description: 'Praktik mindfulness dapat membantu Anda tetap fokus pada saat ini dan mengurangi kecemasan. Temukan kedamaian batin dalam setiap momen.', fullContent: 'Mindfulness adalah praktik memusatkan perhatian pada saat ini tanpa penilaian. Ini dapat mengurangi stres, meningkatkan konsentrasi, dan meningkatkan kesejahteraan emosional. Ada banyak cara untuk berlatih mindfulness, dari meditasi formal hingga memperhatikan napas Anda saat Anda melakukan tugas sehari-hari. Dengan latihan teratur, Anda dapat melatih pikiran Anda untuk lebih hadir dan kurang reaktif terhadap pikiran dan emosi negatif.', image: 'https://inspirasinusantara.id/wp-content/uploads/2025/01/IMG-20250130-WA0032.jpg' },
  { id: 5, category: 'Motivasi', title: 'Tetapkan Tujuan, Raih Impian: Panduan Praktis', description: 'Langkah-langkah praktis untuk menetapkan tujuan yang realistis dan menjaga motivasi tetap tinggi. Wujudkan potensi terbaik Anda.', fullContent: 'Menetapkan tujuan yang jelas dan spesifik adalah langkah pertama menuju keberhasilan. Pastikan tujuan Anda SMART (Specific, Measurable, Achievable, Relevant, Time-bound). Pecah tujuan besar menjadi langkah-langkah kecil yang dapat dikelola. Tetapkan tenggat waktu, lacak kemajuan Anda, dan rayakan setiap pencapaian. Jangan takut untuk menyesuaikan tujuan Anda jika diperlukan. Yang terpenting adalah terus bergerak maju dan menjaga semangat.', image: 'https://www.wowkeren.com/display/images/photo/2024/08/26/66cbbe9f65a54.webp' },
  { id: 6, category: 'Judi Online', title: 'Dampak Sosial Judi Online pada Keluarga dan Lingkungan', description: 'Ketahui bagaimana kebiasaan judi online dapat memengaruhi hubungan keluarga dan solusi pencegahannya. Lindungi orang terkasih.', fullContent: 'Kecanduan judi online tidak hanya merugikan individu, tetapi juga menyebabkan kerusakan besar pada keluarga dan lingkungan sosial mereka. Ketegangan finansial, hilangnya kepercayaan, konflik, dan isolasi adalah beberapa dampak umum. Penting bagi keluarga untuk mencari dukungan dan pendidikan tentang kecandian judi, serta menetapkan batasan yang sehat. Terapi keluarga dan kelompok dukungan dapat membantu memulihkan hubungan dan membangun kembali kehidupan yang stabil.', image: 'https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,f_auto,q_auto:best,w_640/v1634025439/01j291wvsst3b1jf4stxwmwzdf.jpg' },
  { id: 7, category: 'Kesehatan Mental', title: 'Tidur Berkualitas: Fondasi Kesehatan Jiwa & Raga', description: 'Pentingnya tidur yang cukup dan tips untuk meningkatkan kualitas tidur Anda setiap malam. Investasi terbaik untuk kesehatan Anda.', fullContent: 'Tidur yang berkualitas adalah pilar fundamental kesehatan mental dan fisik. Kurang tidur dapat menyebabkan iritabilitas, kesulitan berkonsentrasi, masalah memori, dan peningkatan risiko masalah kesehatan mental seperti kecemasan dan depresi. Ciptakan rutinitas tidur yang konsisten, pastikan kamar tidur Anda gelap dan sejuk, hindari kafein dan alkohol sebelum tidur, dan batasi waktu layar sebelum tidur. Jika masalah tidur terus berlanjut, konsultasikan dengan profesional kesehatan.', image: 'https://cdn.rri.co.id/berita/Sampang/o/1724467375738-bawang/44l60po523d71tk.webp' },
  { id: 8, category: 'Motivasi', title: 'Self-Love: Mencintai Diri Sendiri Sepenuhnya', description: 'Pelajari pentingnya self-love dan bagaimana mempraktikkannya untuk meningkatkan kepercayaan diri dan kebahagiaan.', fullContent: 'Self-love adalah dasar untuk semua hubungan sehat lainnya, termasuk hubungan dengan diri sendiri. Ini bukan tentang keegoisan, tetapi tentang menghargai diri sendiri, merawat diri, dan memprioritaskan kesejahteraan Anda. Praktikkan self-love dengan menetapkan batasan, mengatakan tidak ketika Anda perlu, merawat tubuh Anda, dan memaafkan diri sendiri atas kesalahan. Ingatlah bahwa Anda layak mendapatkan kebahagiaan dan kasih sayang.', image: 'https://cdn.idntimes.com/content-images/community/2023/05/img-20230530-140806-32d6a3626d984daa2d58033b8ad58937-b00d322ef137750a8cc0b6a0dc77c1f6.jpg' },
  { id: 9, category: 'Kesehatan Mental', title: 'Mengelola Kecemasan: Strategi Praktis Sehari-hari', description: 'Panduan untuk memahami dan mengelola tingkat kecemasan Anda dengan efektif agar hidup lebih tenang dan produktif.', fullContent: 'Kecemasan adalah respons alami terhadap stres, namun jika berlebihan dapat mengganggu kehidupan sehari-hari. Artikel ini membahas berbagai strategi praktis untuk mengelola kecemasan, termasuk teknik relaksasi, identifikasi pemicu, dan pentingnya mencari dukungan profesional. Langkah kecil setiap hari dapat membuat perbedaan besar.', image: 'https://hapday.app/wp-content/uploads/2025/02/bwktz4yvtma.jpg' },
  { id: 10, category: 'Motivasi', title: 'Kekuatan Berpikir Positif: Mengubah Perspektif Hidup', description: 'Cara melatih pikiran untuk selalu melihat sisi positif dan bagaimana hal itu dapat meningkatkan kualitas hidup Anda secara keseluruhan.', fullContent: 'Berpikir positif bukan berarti mengabaikan realitas negatif, tetapi memilih untuk fokus pada potensi kebaikan dalam setiap situasi. Ini dapat meningkatkan suasana hati, mengurangi stres, dan meningkatkan resiliensi. Praktikkan afirmasi positif, visualisasi, dan habiskan waktu dengan orang-orang yang mendukung. Mengembangkan pola pikir positif membutuhkan latihan, tetapi imbalannya sepadai.', image: 'https://tkchapin.com/wp-content/uploads/2018/07/Philippians-48-Positive-Thinking-jpg.webp' },
  { id: 11, category: 'Judi Online', title: 'Rehabilitasi dan Dukungan bagi Pecandu Judi Online', description: 'Informasi tentang sumber daya dan program rehabilitasi yang tersedia untuk membantu individu pulih dari kecanduan judi online.', fullContent: 'Pemulihan dari kecanduan judi online adalah penyakit yang serius, tetapi pemulihan adalah mungkin. Ada berbagai sumber daya yang tersedia, termasuk terapi individu, kelompok dukungan (seperti Gamblers Anonymous), dan konseling keluarga. Penting untuk mencari bantuan sesegera mungkin dan membangun sistem dukungan yang kuat. Pemulihan adalah perjalanan, dan setiap langkah maju adalah kemenangan.', image: 'https://radarmukomuko.bacakoran.co/upload/4c26b9f70bfe3cba2655d26061706345.jpeg' },
  { id: 12, category: 'Kesehatan Mental', title: 'Manfaat Meditasi untuk Kesehatan Otak dan Mental', description: 'Pelajari bagaimana meditasi dapat membantu meningkatkan fokus, mengurangi stres, dan mendukung kesehatan otak jangka panjang Anda.', fullContent: 'Meditasi bukan hanya tentang relaksasi, tetapi juga memiliki manfaat signifikan bagi kesehatan otak dan mental. Penelitian modern mendukung bahwa meditasi dapat mengubah struktur otak, meningkatkan konsentrasi, mengurangi kecemasan, dan meningkatkan kesejahteraan secara keseluruhan. Ada berbagai jenis meditasi, dari meditasi kesadaran hingga meditasi transendental. Menemukan gaya yang cocok untuk Anda dan berlatih secara teratur dapat membawa perubahan signifikan dalam hidup Anda.', image: 'https://cdn1-production-images-kly.akamaized.net/BBoLAd9XLn_8d7l-TxHWltATcoQ=/1200x675/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3502676/original/013868800_1625568634-yoga-3053488_640.jpg' },
];

const ARTICLES_PER_PAGE = 6;

const Artikel = () => {
  const [activeCategory, setActiveCategory] = useState('Semua'); // Default to 'Semua' to match your categories
  const [currentPage, setCurrentPage] = useState(1);

  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: featuredRef, inView: featuredInView } = useInView({ triggerOnce: true, threshold: 0.1, delay: 200 });
  const { ref: readMoreRef, inView: readMoreInView } = useInView({ triggerOnce: true, threshold: 0.1, delay: 400 });
  const { ref: latestArticlesRef, inView: latestArticlesInView } = useInView({ triggerOnce: true, threshold: 0.1, delay: 600 });
  const { ref: subscribeRef, inView: subscribeInView } = useInView({ triggerOnce: true, threshold: 0.1, delay: 800 });

  // Use blogCategories directly for filtering
  const blogCategories = ['Semua', 'Kesehatan Mental', 'Judi Online', 'Motivasi'];

  // This is the core change: use filteredArticles for the main list
  const articlesToDisplay = activeCategory === 'Semua'
    ? allArticles
    : allArticles.filter(article => article.category === activeCategory);

  const indexOfLastArticle = currentPage * ARTICLES_PER_PAGE;
  const indexOfFirstArticle = indexOfLastArticle - ARTICLES_PER_PAGE;
  // Apply pagination to the filtered articles
  const currentArticles = articlesToDisplay.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articlesToDisplay.length / ARTICLES_PER_PAGE);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    // Reset to the first page whenever the category changes
    setCurrentPage(1);
  }, [activeCategory]);

  const featuredArticle = allArticles[0];
  const readMoreArticles = allArticles.slice(1, 4);

  return (
    <div className="bg-[#092635] mt-16 min-h-screen py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* --- Header Utama (Articles & News) --- */}
        <div
          ref={heroRef}
          className={`relative bg-[#1B4242] rounded-xl p-8 md:p-12 mb-16 overflow-hidden
                      transform transition-all duration-700 ease-out ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Geometris di latar belakang */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#5C8374] rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#5C8374] rounded-full transform translate-x-1/2 translate-y-1/2 opacity-20"></div>
          <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-[#5C8374] rounded-lg transform rotate-45 opacity-30"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#9EC8B9] leading-tight mb-4">
              Articles & News
            </h1>
            <p className="text-lg text-[#D6FFEF] opacity-90 max-w-2xl">
              Temukan wawasan terbaru dan berita terkini seputar kesehatan mental, motivasi, dan isu-isu penting lainnya di blog PelukDiri.
            </p>
          </div>
        </div>

        {/* --- Featured Article Section --- */}
        {featuredArticle && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-[#9EC8B9] mb-8 text-center lg:text-left">Top Weekly Article</h2>

            <div
              ref={featuredRef}
              className={`bg-[#1B4242] rounded-xl shadow-xl p-6 md:p-8 mb-16 overflow-hidden lg:flex
                        transform transition-all duration-700 ease-out delay-200 ${featuredInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >

              <div className="lg:w-1/2 flex items-center justify-center p-2">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-64 object-cover rounded-lg lg:h-auto lg:max-h-[300px]"
                />
              </div>
              <div className="p-4 lg:w-1/2 flex flex-col justify-center">
                <span className="inline-block max-w-fit bg-[#9EC8B9] text-[#092635] text-sm font-semibold px-4 py-1 rounded-full mb-3 uppercase tracking-wider">
                  Featured
                </span>
                <h3 className="text-2xl font-bold text-[#9EC8B9] mb-3 leading-snug">
                  {featuredArticle.title}
                </h3>
                <p className="text-[#D6FFEF] text-base mb-4 line-clamp-3 opacity-90">
                  {featuredArticle.description}
                </p>
                <Link
                  to={`/artikel/${featuredArticle.id}`}
                  className="inline-flex items-center text-[#5C8374] font-semibold hover:text-[#9EC8B9] transition-colors"
                >
                  Baca Selengkapnya
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* --- Bagian Read More (3 kolom artikel kecil) --- */}
        <div
          ref={readMoreRef}
          className={`mb-16 transform transition-all duration-700 ease-out delay-400 ${readMoreInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-3xl font-bold text-[#9EC8B9] mb-8 text-center lg:text-left">Read More</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {readMoreArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={index}
                inView={readMoreInView}
              />
            ))}
          </div>
        </div>

        {/* --- Bagian Latest Articles dengan Filter --- */}
        <div
          ref={latestArticlesRef}
          className={`mb-16 transform transition-all duration-700 ease-out delay-600 ${latestArticlesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-3xl font-bold text-[#9EC8B9] mb-8 text-center lg:text-left">Latest articles</h2>
          {/* Filter Kategori */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-12">
            {blogCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200
                  ${activeCategory === category
                    ? 'bg-[#5C8374] text-white shadow-md'
                    : 'bg-[#1B4242] text-[#9EC8B9] hover:bg-[#5C8374] hover:text-white border border-[#5C8374]'}
                `}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Grid Artikel Terbaru */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* THIS IS THE KEY CHANGE: Use currentArticles directly */}
            {currentArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={index}
                inView={latestArticlesInView}
              />
            ))}
          </div>

          {/* Kontrol Paginasi untuk Latest Articles (diaktifkan kembali) */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`
                  px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                  ${currentPage === 1
                    ? 'bg-[#1B4242] text-[#9EC8B9] cursor-not-allowed'
                    : 'bg-[#1B4242] text-[#9EC8B9] hover:bg-[#5C8374] hover:text-white'}
                `}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`
                    px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                    ${currentPage === pageNumber
                      ? 'bg-[#5C8374] text-white shadow-md'
                      : 'bg-[#1B4242] text-[#9EC8B9] hover:bg-[#5C8374] hover:text-white'}
                  `}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`
                  px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                  ${currentPage === totalPages
                    ? 'bg-[#1B4242] text-[#9EC8B9] cursor-not-allowed'
                    : 'bg-[#1B4242] text-[#9EC8B9] hover:bg-[#5C8374] hover:text-white'}
                `}
              >
                Next
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Artikel;
