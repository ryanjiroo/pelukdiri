import React from 'react';
import { useInView } from 'react-intersection-observer';

const TentangKami = () => {
  // Animasi untuk bagian penjelasan utama
  const { ref: mainContentRef, inView: mainContentInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Animasi untuk bagian visi & misi (bisa jadi satu atau terpisah)
  const { ref: vmRef, inView: vmInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    delay: 200, // Sedikit delay setelah mainContent
  });

  // Animasi untuk bagian statistik
  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    delay: 400, // Sedikit delay setelah visi misi
  });

  return (
    <section
      id="tentang-kami"
      // Latar belakang keseluruhan yang lebih gelap (#092635)
      className="bg-[#5C8374] py-16 px-4 sm:px-6 lg:px-8"
    >
      {/* Header Utama - Mirip bagian "Our Design Solutions" */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <span className="inline-block px-3 py-1 text-sm font-semibold text-[#5C8374] bg-[#092635] rounded-full uppercase tracking-wider mb-4">
          Tentang Kami
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#092635] leading-tight mb-4">
          Mengenal PelukDiri Lebih Dekat
        </h1>
        <p className="text-lg text-[#092635]">
          PelukDiri adalah sebuah platform yang didedikasikan untuk mendukung perjalanan kesehatan mental dan kesejahteraan emosional Anda. Kami percaya bahwa setiap individu berhak mendapatkan dukungan yang penuh kasih sayang dan akses ke sumber daya yang dapat membantu mereka menavigasi tantangan hidup.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div
          ref={mainContentRef}
          className={`
            lg:col-span-2 bg-[#092635] rounded-2xl shadow-xl p-8 md:p-10
            flex flex-col transform transition-all duration-1000 ease-out
            ${mainContentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}
        >
          <h2 className="text-3xl font-bold text-[#9EC8B9] mb-4">Misi Kami</h2>
          <p className="text-[#D6FFEF] leading-relaxed text-lg">
            Melalui fitur-fitur interaktif dan konten yang dikurasi, PelukDiri berupaya menciptakan ruang yang aman dan inspiratif. Kami hadir untuk menemani Anda dalam memahami diri sendiri, mengelola stres, mengatasi kecemasan, dan mengembangkan kekuatan batin. Tujuan kami adalah memberdayakan Anda untuk "memeluk diri" dengan lebih baik, menemukan ketenangan, dan menumbuhkan resiliensi di tengah hiruk pikuk kehidupan modern. Mari bersama-sama membangun komunitas yang saling mendukung untuk kesehatan mental yang lebih baik.
          </p>
        </div>

        {/* Kolom Kanan - Visi */}
        <div
          ref={vmRef}
          className={`
            lg:col-span-1 bg-[#092635] rounded-2xl shadow-xl p-8 md:p-10
            flex flex-col transform transition-all duration-1000 ease-out
            ${vmInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}
        >
          <h2 className="text-3xl font-bold text-[#9EC8B9] mb-4">Visi Kami</h2>
          <p className="text-[#D6FFEF] leading-relaxed">
            Menjadi platform terkemuka yang memberdayakan individu untuk mencapai kesejahteraan mental holistik dan membangun resiliensi emosional di tengah tantangan modern.
          </p>
        </div>
      </div>


      {/* <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div
          ref={vmRef} // Menggunakan ref yang sama untuk Visi & Misi untuk animasi bersamaan
          className={`
            bg-[#5C8374] rounded-2xl shadow-lg p-6 md:p-8 flex flex-col items-start
            transform transition-all duration-1000 ease-out
            ${vmInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
          `}
        >
          <h3 className="text-xl font-semibold text-[#1B4242] mb-2">Akses Sumber Daya</h3>
          <p className="text-[#D6FFEF] text-sm">Menyediakan akses mudah ke sumber daya dan dukungan kesehatan mental yang terkurasi.</p>
        </div>

      
        <div
          ref={vmRef}
          className={`
            bg-[#5C8374] rounded-2xl shadow-lg p-6 md:p-8 flex flex-col items-start
            transform transition-all duration-1000 ease-out
            ${vmInView ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}
          `}
        >
          <h3 className="text-xl font-semibold text-[#1B4242] mb-2">Komunitas Aman</h3>
          <p className="text-[#D6FFEF] text-sm">Menciptakan komunitas yang aman dan inklusif untuk berbagi pengalaman dan saling mendukung.</p>
        </div>


        <div
          ref={vmRef}
          className={`
            bg-[#5C8374] rounded-2xl shadow-lg p-6 md:p-8 flex flex-col items-start
            transform transition-all duration-1000 ease-out
            ${vmInView ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-10'}
          `}
        >
          <h3 className="text-xl font-semibold text-[#1B4242] mb-2">Praktik Self-Care</h3>
          <p className="text-[#D6FFEF] text-sm">Mendorong praktik self-care dan kesadaran diri melalui konten yang inspiratif dan interaktif.</p>
        </div>

        <div
          ref={vmRef}
          className={`
            bg-[#5C8374] rounded-2xl shadow-lg p-6 md:p-8 flex flex-col items-start
            transform transition-all duration-1000 ease-out
            ${vmInView ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}
          `}
        >
          <h3 className="text-xl font-semibold text-[#1B4242] mb-2">Advokasi Kesehatan Mental</h3>
          <p className="text-[#D6FFEF] text-sm">Mengadvokasi pentingnya kesehatan mental sebagai bagian integral dari kesejahteraan hidup.</p>
        </div>
      </div> */}

      <div
        ref={statsRef}
        className={`
          max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center
          transform transition-all duration-1000 ease-out
          ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
      >
        <div className="bg-[#092635] rounded-2xl shadow-lg p-8"> 
          <p className="text-5xl font-extrabold text-[#9EC8B9] mb-2">1000+</p> 
          <p className="text-xl font-semibold text-[#D6FFEF]">Pengguna Terdaftar</p>
        </div>
        <div className="bg-[#092635] rounded-2xl shadow-lg p-8">
          <p className="text-5xl font-extrabold text-[#9EC8B9] mb-2">50+</p>
          <p className="text-xl font-semibold text-[#D6FFEF]">Konten Edukasi</p>
        </div>
        <div className="bg-[#092635] rounded-2xl shadow-lg p-8">
          <p className="text-5xl font-extrabold text-[#9EC8B9] mb-2">4.9</p>
          <p className="text-xl font-semibold text-[#D6FFEF]">Rating Pengguna</p>
        </div>
      </div>
    </section>
  );
};

export default TentangKami;