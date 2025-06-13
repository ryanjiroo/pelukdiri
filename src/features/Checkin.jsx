import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useInView } from 'react-intersection-observer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';


const moods = [
  { emoji: '😊', label: 'Baik', value: 'baik' },
  { emoji: '😐', label: 'Sedang', value: 'sedang' },
  { emoji: '😟', label: 'Buruk', value: 'buruk' },
];

const Checkin = () => {
  const { currentUserToken, currentUsername, isLoading, apiCall } = useAuth();
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState(null);
  const [description, setDescription] = useState('');

  const [currentView, setCurrentView] = useState('moodPicker');

  const [recommendationText, setRecommendationText] = useState('');
  const [historyList, setHistoryList] = useState([]);

  // Hooks useInView untuk animasi load setiap bagian
  const { ref: moodPickerRef, inView: moodPickerInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: navButtonsRef, inView: navButtonsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    delay: 200,
  });
  const { ref: dynamicContentRef, inView: dynamicContentInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    delay: 400,
  });


  useEffect(() => {
    if (!currentUserToken) {
      navigate('/login');
    }
  }, [currentUserToken, navigate]);

  const handleCheckinSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) {
      alert('Silakan pilih mood Anda terlebih dahulu!');
      return;
    }
    try {
      const moodValueForApi = selectedMood; 
      
      await apiCall('/checkin', 'POST', { mood: moodValueForApi, description }, true);
      alert('Check-in berhasil disimpan!');
      setSelectedMood(null);
      setDescription('');
      setCurrentView('recommendation');
      await fetchRecommendation();
    } catch (error) {
      // Error sudah ditangani di apiCall
    }
  };

  const fetchRecommendation = async () => {
    if (!currentUserToken) return;
    try {
      const data = await apiCall('/checkin/recommendation', 'GET', null, true);
      if (data && data.recommendation) {
        setRecommendationText(data.recommendation);
      } else {
        setRecommendationText('Tidak ada rekomendasi terbaru untuk Anda. Silakan lakukan check-in terlebih dahulu.');
      }
    } catch (error) {
      setRecommendationText('Gagal memuat rekomendasi.');
    }
  };

  const fetchHistory = async () => {
    if (!currentUserToken) return;
    try {
      const data = await apiCall('/checkin', 'GET', null, true);
      if (data && data.length > 0) {
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistoryList(data);
      } else {
        setHistoryList([]);
      }
    } catch (error) {
      setHistoryList([]);
    }
  };

  if (!currentUserToken) {
    return (
      <div className="min-h-screen bg-[#092635] flex items-center justify-center text-[#9EC8B9]">
        Memuat atau mengarahkan...
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10 py-16 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto"> 

        {/* Bagian Mood Picker dengan animasi */}
        <div 
          ref={moodPickerRef} 
          className={`bg-[#1B4242] rounded-xl shadow-xl p-6 md:p-8 mb-8 
                      transform transition-all duration-700 ease-out
                      ${moodPickerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          <h2 className="text-3xl font-bold text-center mb-2 text-[#9EC8B9]">Bagaimana perasaanmu hari ini?</h2>
          <p className="text-md text-center mb-8 text-[#9EC8B9]">Pilih mood Anda untuk melakukan check-in.</p>

          {/* Mood Selector */}
          <div className="flex justify-center flex-wrap gap-4 mb-8">
            {moods.map((moodOption) => (
              <div
                key={moodOption.value}
                onClick={() => setSelectedMood(moodOption.value)}
                className={`relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-200
                         ${selectedMood === moodOption.value
                           ? 'bg-[#5C8374] shadow-lg transform scale-105'
                           : 'bg-[#092635] border border-[#1B4242] hover:bg-[#1B4242]'}`}
              >
                <span className="text-4xl sm:text-5xl mb-1">{moodOption.emoji}</span>
                <span className="text-xs sm:text-sm font-medium text-[#9EC8B9]">{moodOption.label}</span>
              </div>
            ))}
          </div>

          {/* Text Area untuk Deskripsi */}
          <div className="mb-8">
            <label htmlFor="description" className="block text-md font-medium text-[#9EC8B9] mb-2">
              Apakah Anda ingin berbagi mengapa Anda merasa seperti ini hari ini?
            </label>
            <textarea
              id="description"
              rows="4"
              className="w-full p-4 rounded-lg bg-[#092635] border border-[#1B4242] text-[#9EC8B9] placeholder-[#5C8374]
                       focus:outline-none focus:ring-2 focus:ring-[#9EC8B9] focus:border-transparent transition-all duration-200"
              placeholder="Ketik di sini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            ></textarea>
          </div>

          {/* Tombol Continue */}
          <button
            type="submit"
            onClick={handleCheckinSubmit}
            disabled={isLoading || !selectedMood}
            className="w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 transform
                     bg-[#5C8374] text-white shadow-xl
                     hover:scale-[1.01] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Memproses...' : 'Lanjutkan'}
          </button>
        </div> {/* End Mood Picker Card */}

        {/* Tombol Navigasi Antar Konten Dinamis dengan animasi */}
        <div 
          ref={navButtonsRef} 
          className={`flex flex-wrap justify-center gap-3 mb-8 
                      transform transition-all duration-700 ease-out delay-200
                      ${navButtonsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
             <button
                onClick={() => {setCurrentView('recommendation'); fetchRecommendation();}}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${currentView === 'recommendation' ? 'bg-[#5C8374] text-white' : 'bg-[#092635] text-[#9EC8B9] hover:bg-[#5C8374] hover:text-white'}`}
                disabled={isLoading}
              >
                Rekomendasi
              </button>
              <button
                onClick={() => { setCurrentView('history'); fetchHistory(); }}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${currentView === 'history' ? 'bg-[#5C8374] text-white' : 'bg-[#092635] text-[#9EC8B9] hover:bg-[#5C8374] hover:text-white'}`}
                disabled={isLoading}
              >
                Riwayat
              </button>
        </div>

        {/* Konten Dinamis (Rekomendasi, Riwayat) dengan animasi */}
        <div 
          ref={dynamicContentRef} 
          className={`mt-8 
                      transform transition-all duration-700 ease-out delay-400
                      ${dynamicContentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        >
          {currentView === 'recommendation' && (
            <div className="bg-[#1B4242] rounded-xl shadow-xl p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-3 text-[#9EC8B9]">Rekomendasi Aktivitas untuk Anda</h3>
              {isLoading ? (
                <p className="text-[#9EC8B9]">Memuat rekomendasi...</p>
              ) : (
                <div className="bg-[#092635] p-4 rounded-lg border border-[#5C8374] text-[#9EC8B9] prose prose-sm max-w-none">
                  <ReactMarkdown
                    children={recommendationText}
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  />
                </div>
              )}
            </div>
          )}

          {currentView === 'history' && (
            <div className="bg-[#1B4242] rounded-xl shadow-xl p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-3 text-[#9EC8B9]">Riwayat Check-in Anda</h3>
              {isLoading ? (
                <p className="text-[#9EC8B9]">Memuat riwayat...</p>
              ) : historyList.length > 0 ? (
                // Added max-h-96 (adjust as needed) and overflow-y-auto, plus the custom-scrollbar-style class
                <div className="space-y-4 max-h-120 overflow-y-auto custom-scrollbar-style"> 
                  {historyList.map((item, idx) => (
                    <div key={idx} className="bg-[#092635] p-4 rounded-lg border border-[#5C8374]">
                      <p className="font-semibold text-[#9EC8B9]">Tanggal: <span className="font-normal text-[#9EC8B9]">
                        {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span></p>
                      <p className="font-semibold text-[#9EC8B9]">Mood: <span className="font-normal text-[#9EC8B9]">
                        {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
                        {item.mood === 'baik' ? ' 😊' : item.mood === 'sedang' ? ' 😐' : ' 😟'}
                      </span></p>
                      <p className="font-semibold text-[#9EC8B9]">Deskripsi: <span className="font-normal text-[#9EC8B9]">
                        {item.description || '-'}
                      </span></p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#9EC8B9]">Belum ada riwayat check-in.</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Checkin;