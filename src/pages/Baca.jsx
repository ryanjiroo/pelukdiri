import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

const allArticles = [
  { id: 1, category: 'Kesehatan Mental', title: 'Manajemen Stres: Kunci Kesejahteraan Emosional', description: 'Pelajari teknik sederhana untuk mengelola stres sehari-hari dan meningkatkan kesehatan mental Anda. Temukan ketenangan di tengah hiruk pikuk hidup.', fullContent: '**Stres** adalah bagian tak terhindarkan dari hidup. Namun, bagaimana kita mengelolanya sangat memengaruhi kesejahteraan emosional kita. Artikel ini akan membahas teknik **mindfulness**, latihan pernapasan, dan pentingnya tidur yang cukup untuk mengurangi tingkat stres harian. Belajar untuk mengenali pemicu stres dan mengembangkan strategi coping yang sehat adalah langkah awal menuju kehidupan yang lebih tenang dan bahagia.\n\nSelain itu, penting untuk mengenali pemicu stres pribadi. Apakah itu pekerjaan, hubungan, atau keuangan? Setelah Anda mengidentifikasi pemicu, Anda bisa mulai mengembangkan strategi untuk menghadapinya. Ini bisa berarti belajar mengatakan "tidak" lebih sering, mendelegasikan tugas, atau bahkan mengambil jeda singkat untuk istirahat. Ingat, mengelola stres adalah perjalanan berkelanjutan, bukan tujuan tunggal. Fleksibilitas dan kesabaran terhadap diri sendiri adalah kunci utama dalam proses ini. Jangan ragu mencari bantuan profesional jika stres terasa terlalu berat untuk ditangani sendiri.\n\nMempertahankan keseimbangan hidup adalah aspek krusial dari manajemen stres. Ini mencakup waktu untuk bekerja, bersosialisasi, hobi, dan istirahat. Hindari kecenderungan untuk memaksakan diri secara berlebihan. Batasan yang sehat antara kehidupan pribadi dan profesional sangat penting. Latihan fisik secara teratur, bahkan hanya berjalan kaki singkat setiap hari, dapat secara signifikan mengurangi tingkat stres. Nutrisi yang baik juga berperan penting; hindari makanan olahan dan kafein berlebihan yang dapat memperburuk kecemasan. Terakhir, jangan lupakan kekuatan tawa dan humor; temukan hal-hal yang membuat Anda senang dan berikan ruang untuk itu dalam hidup Anda.', image: 'https://assets.nsd.co.id/artikel/efa7ba3b-2a3a-4e35-8797-159022e8cce2.png' },
  { id: 2, category: 'Judi Online', title: 'Bahaya Judi Online: Kenali dan Hindari Dampaknya', description: 'Memahami risiko dan dampak negatif dari keterlibatan dalam judi online, serta cara menghindarinya. Lindungi diri dan keluarga Anda.', fullContent: 'Judi online telah menjadi ancaman serius bagi banyak individu dan keluarga. Ini bukan hanya tentang kerugian finansial, tetapi juga dampak psikologis dan sosial yang parah, termasuk masalah hubungan, isolasi, kecemasan, depresi, dan bahkan pemikiran untuk bunuh diri. Penting untuk menyadari tanda-tanda peringatan, seperti menghabiskan lebih banyak waktu atau uang dari yang direncanakan, menyembunyikan kebiasaan judi, mengabaikan tanggung jawab, atau merasakan dorongan yang kuat untuk berjudi saat stres atau bosan. Mencari bantuan profesional adalah langkah penting untuk pemulihan.\n\nDampak judi online seringkali meluas ke seluruh aspek kehidupan seseorang, merusak stabilitas keuangan, hubungan pribadi, dan kesehatan mental. Individu yang kecanduan mungkin mulai berbohong, mencuri, atau mengabaikan kebutuhan dasar untuk membiayai kebiasaan mereka. Lingkungan sosial mereka juga bisa terpengaruh, dengan teman dan keluarga yang merasa tidak berdaya atau marah. Kelompok dukungan dan terapi kognitif-behavioral (CBT) adalah pilihan yang efektif untuk mengatasi kecanduan judi, membantu individu mengembangkan strategi koping yang lebih sehat dan memulihkan kehidupan mereka.\n\nPencegahan adalah kunci dalam memerangi penyebaran kecanduan judi online. Edukasi publik tentang risiko dan tanda-tanda bahaya judi harus digalakkan, terutama di kalangan remaja dan dewasa muda. Platform judi online juga memiliki tanggung jawab untuk menerapkan praktik perjudian yang bertanggung jawab, seperti batasan setoran, pengecualian diri, dan peringatan waktu. Dukungan dari pemerintah dan komunitas untuk menyediakan sumber daya bagi mereka yang berjuang dengan kecandian sangat penting untuk meminimalkan dampak merusak dari fenomena ini. Ingatlah, ada harapan dan bantuan tersedia untuk mereka yang ingin melepaskan diri dari cengkeraman judi.', image: 'https://dkis.cirebonkota.go.id/wp-content/uploads/2024/12/WhatsApp-Image-2024-12-19-at-08.01.45-1024x576.jpeg' },
  { id: 3, category: 'Motivasi', title: 'Membangun Resiliensi: Bangkit dari Setiap Tantangan', description: 'Temukan cara untuk mengembangkan kekuatan batin dan bangkit dari setiap kesulitan hidup. Jadikan tantangan sebagai peluang untuk bertumbuh.', fullContent: 'Resiliensi adalah kemampuan untuk beradaptasi dan pulih dari kesulitan. Ini bukan berarti Anda tidak akan mengalami kesulitan, tetapi Anda akan memiliki alat untuk menghadapinya. Kembangkan pola pikir positif, belajar dari pengalaman, dan pertahankan hubungan sosial yang kuat. Penting untuk mempraktikkan self-compassion dan mengingat bahwa tidak apa-apa untuk meminta bantuan. Setiap tantangan adalah kesempatan untuk belajar dan menjadi lebih kuat.\n\nMembangun resiliensi juga melibatkan pengembangan keterampilan pemecahan masalah dan kemampuan untuk melihat kegagalan sebagai kesempatan belajar, bukan sebagai akhir. Individu yang resilien cenderung memiliki jaringan dukungan yang kuat dan aktif mencari solusi daripada terjebak dalam masalah. Mereka juga mempraktikkan self-care, menjaga kesehatan fisik dan mental, dan memiliki tujuan hidup yang jelas yang memotivasi mereka untuk terus maju meskipun ada hambatan. Mengembangkan resiliensi adalah proses berkelanjutan yang membutuhkan kesadaran diri dan komitmen.\n\nSalah satu cara praktis untuk meningkatkan resiliensi adalah dengan menetapkan tujuan-tujuan kecil yang dapat dicapai. Ini membantu membangun rasa pencapaian dan kompetensi. Berlatih menerima ketidakpastian dan melepaskan kendali atas hal-hal yang tidak dapat diubah juga merupakan bagian penting dari resiliensi. Fokus pada apa yang bisa Anda kendalikan, yaitu respons Anda terhadap situasi. Pertimbangkan untuk mencari mentor atau bergabung dengan komunitas yang mendukung, karena interaksi sosial positif dapat sangat memperkuat kemampuan Anda untuk bangkit dari kesulitan. Ingatlah, resiliensi bukanlah sifat bawaan, melainkan keterampilan yang dapat dipelajari dan diperkuat seiring waktu.', image: 'https://komunitas.schoolofparenting.id/images/vod/thumbnail-kvb-resiliensi.jpg' },
  { id: 4, category: 'Kesehatan Mental', title: 'Mindfulness: Kunci Hidup Lebih Tenang dan Fokus', description: 'Praktik mindfulness dapat membantu Anda tetap fokus pada saat ini dan mengurangi kecemasan. Temukan kedamaian batin dalam setiap momen.', fullContent: 'Mindfulness adalah praktik memusatkan perhatian pada saat ini tanpa penilaian. Ini dapat mengurangi stres, meningkatkan konsentrasi, dan meningkatkan kesejahteraan emosional. Ada banyak cara untuk berlatih mindfulness, dari meditasi formal hingga memperhatikan napas Anda saat Anda melakukan tugas sehari-hari. Dengan latihan teratur, Anda dapat melatih pikiran Anda untuk lebih hadir dan kurang reaktif terhadap pikiran dan emosi negatif.\n\nSalah satu cara termudah untuk memulai praktik mindfulness adalah dengan latihan pernapasan. Luangkan beberapa menit setiap hari untuk duduk dengan tenang dan fokus pada sensasi napas Anda. Perhatikan bagaimana udara masuk dan keluar dari tubuh Anda. Ketika pikiran Anda mengembara, dengan lembut kembalikan perhatian Anda pada napas. Seiring waktu, Anda akan menemukan bahwa kemampuan Anda untuk tetap hadir meningkat, dan Anda akan lebih mampu mengelola pikiran dan emosi yang mengganggu. Mindfulness dapat diintegrasikan ke dalam aktivitas sehari-hari, seperti makan, berjalan, atau bahkan mencuci piring, menjadikan setiap momen sebagai kesempatan untuk kesadaran penuh.\n\nManfaat mindfulness meluas ke berbagai aspek kehidupan, tidak hanya mengurangi stres tetapi juga meningkatkan empati, meningkatkan kualitas tidur, dan memperbaiki hubungan. Ini membantu Anda untuk lebih menyadari dan menghargai momen-momen kecil dalam hidup. Ada banyak aplikasi dan sumber daya online yang dapat membantu Anda memulai perjalanan mindfulness Anda, dari meditasi terpandu hingga latihan singkat yang dapat Anda lakukan di mana saja. Ingatlah bahwa konsistensi adalah kunci; bahkan beberapa menit praktik setiap hari dapat membawa perubahan signifikan dalam kesejahteraan mental Anda.', image: 'https://inspirasinusantara.id/wp-content/uploads/2025/01/IMG-20250130-WA0032.jpg' },
  { id: 5, category: 'Motivasi', title: 'Tetapkan Tujuan, Raih Impian: Panduan Praktis', description: 'Langkah-langkah praktis untuk menetapkan tujuan yang realistis dan menjaga motivasi tetap tinggi. Wujudkan potensi terbaik Anda.', fullContent: 'Menetapkan tujuan yang jelas dan spesifik adalah langkah pertama menuju keberhasilan. Pastikan tujuan Anda SMART (Specific, Measurable, Achievable, Relevant, Time-bound). Pecah tujuan besar menjadi langkah-langkah kecil yang dapat dikelola. Tetapkan tenggat waktu, lacak kemajuan Anda, dan rayakan setiap pencapaian. Jangan takut untuk menyesuaikan tujuan Anda jika diperlukan. Yang terpenting adalah terus bergerak maju dan menjaga semangat.\n\nSetelah menetapkan tujuan, penting untuk membuat rencana tindakan yang konkret. Identifikasi langkah-langkah spesifik yang perlu Anda ambil, sumber daya yang Anda butuhkan, dan kemungkinan hambatan yang mungkin muncul. Melacak kemajuan Anda secara teratur akan membantu Anda tetap termotivasi dan membuat penyesuaian jika diperlukan. Jangan pernah meremehkan kekuatan visualisasi; bayangkan diri Anda mencapai tujuan Anda untuk memperkuat keyakinan diri. Ingatlah bahwa setiap langkah kecil adalah kemajuan, dan konsistensi adalah kunci untuk mencapai impian terbesar Anda.\n\nUntuk menjaga motivasi tetap tinggi dalam jangka panjang, penting untuk secara rutin mengevaluasi kemajuan Anda dan merayakan keberhasilan kecil. Ini memperkuat pola pikir positif dan memberikan dorongan untuk terus melangkah. Selain itu, temukan sistem akuntabilitas, seperti teman atau mentor, yang dapat memberikan dukungan dan dorongan. Jangan biarkan kemunduran kecil menghentikan Anda; lihatlah itu sebagai kesempatan untuk belajar dan menyesuaikan strategi Anda. Ingatlah mengapa Anda memulai dan jaga visi akhir Anda tetap hidup di pikiran. Motivasi adalah api yang perlu terus dinyalakan melalui tindakan dan refleksi yang disengaja.', image: 'https://www.wowkeren.com/display/images/photo/2024/08/26/66cbbe9f65a54.webp' },
  { id: 6, category: 'Judi Online', title: 'Dampak Sosial Judi Online pada Keluarga dan Lingkungan', description: 'Ketahui bagaimana kebiasaan judi online dapat memengaruhi hubungan keluarga dan solusi pencegahannya. Lindungi orang terkasih.', fullContent: 'Kecanduan judi online tidak hanya merugikan individu, tetapi juga menyebabkan kerusakan besar pada keluarga dan lingkungan sosial mereka. Ketegangan finansial, hilangnya kepercayaan, konflik, dan isolasi adalah beberapa dampak umum. Penting bagi keluarga untuk mencari dukungan dan pendidikan tentang kecandian judi, serta menetapkan batasan yang sehat. Terapi keluarga dan kelompok dukungan dapat membantu memulihkan hubungan dan membangun kembali kehidupan yang stabil.\n\nAnak-anak dari orang tua yang kecanduan judi seringkali mengalami masalah emosional dan perilaku, serta mungkin merasa diabaikan. Lingkungan rumah yang tidak stabil dapat berdampak jangka panjang pada perkembangan mereka. Selain itu, komunitas juga dapat terpengaruh oleh peningkatan kejahatan terkait judi atau masalah ekonomi. Pencegahan dan intervensi dini sangat penting untuk mengurangi dampak sosial ini. Program pendidikan tentang bahaya judi dan ketersediaan sumber daya dukungan harus menjadi prioritas bagi individu dan keluarga yang berisiko.\n\nPemerintah dan organisasi nirlaba memiliki peran penting dalam menyediakan kerangka kerja dukungan dan pencegahan yang komprehensif. Ini termasuk layanan konseling gratis, hotline bantuan, dan program rehabilitasi yang mudah diakses. Mengurangi stigma seputar kecanduan judi juga krusial agar individu dan keluarga lebih berani mencari bantuan. Kolaborasi antara penyedia layanan kesehatan, lembaga penegak hukum, dan komunitas dapat menciptakan lingkungan yang lebih aman dan mendukung bagi mereka yang rentan terhadap dampak negatif judi online.', image: 'https://blue.kumparan.com/image/upload/fl_progressive,fl_lossy,c_fill,f_auto,q_auto:best,w_640/v1634025439/01j291wvsst3b1jf4stxwmwzdf.jpg' },
  { id: 7, category: 'Kesehatan Mental', title: 'Tidur Berkualitas: Fondasi Kesehatan Jiwa & Raga', description: 'Pentingnya tidur yang cukup dan tips untuk meningkatkan kualitas tidur Anda setiap malam. Investasi terbaik untuk kesehatan Anda.', fullContent: 'Tidur yang berkualitas adalah pilar fundamental kesehatan mental dan fisik. Kurang tidur dapat menyebabkan iritabilitas, kesulitan berkonsentrasi, masalah memori, dan peningkatan risiko masalah kesehatan mental seperti kecemasan dan depresi. Ciptakan rutinitas tidur yang konsisten, pastikan kamar tidur Anda gelap dan sejuk, hindari kafein dan alkohol sebelum tidur, dan batasi waktu layar sebelum tidur. Jika masalah tidur terus berlanjut, konsultasikan dengan profesional kesehatan.\n\nUntuk meningkatkan kualitas tidur, pertimbangkan untuk menciptakan "zona tidur" yang optimal. Pastikan kamar tidur Anda tenang, gelap, dan sejuk. Hindari penggunaan perangkat elektronik setidaknya satu jam sebelum tidur, karena cahaya biru dapat mengganggu produksi melatonin. Luangkan waktu untuk bersantai sebelum tidur, seperti membaca buku, mandi air hangat, atau melakukan meditasi ringan. Hindari makan besar atau berolahraga berat terlalu dekat dengan waktu tidur. Dengan konsistensi, kebiasaan tidur yang sehat akan meningkatkan energi, suasana hati, dan produktivitas Anda secara signifikan.\n\nJika Anda mengalami kesulitan tidur kronis, penting untuk menyelidiki penyebab yang mendasarinya. Ini bisa termasuk stres, kondisi medis tertentu, atau gangguan tidur seperti insomnia atau sleep apnea. Terapis tidur atau dokter dapat membantu mendiagnosis masalah dan merekomendasikan intervensi yang tepat, seperti terapi perilaku kognitif untuk insomnia (CBT-I). Ingatlah, investasi dalam tidur yang berkualitas adalah investasi dalam kesehatan jangka panjang Anda, baik fisik maupun mental.', image: 'https://cdn.rri.co.id/berita/Sampang/o/1724467375738-bawang/44l60po523d71tk.webp' },
  { id: 8, category: 'Motivasi', title: 'Self-Love: Mencintai Diri Sendiri Sepenuhnya', description: 'Pelajari pentingnya self-love dan bagaimana mempraktikkannya untuk meningkatkan kepercayaan diri dan kebahagiaan.', fullContent: 'Self-love adalah dasar untuk semua hubungan sehat lainnya, termasuk hubungan dengan diri sendiri. Ini bukan tentang keegoisan, tetapi tentang menghargai diri sendiri, merawat diri, dan memprioritaskan kesejahteraan Anda. Praktikkan self-love dengan menetapkan batasan, mengatakan tidak ketika Anda perlu, merawat tubuh Anda, dan memaafkan diri sendiri atas kesalahan. Ingatlah bahwa Anda layak mendapatkan kebahagiaan dan kasih sayang.\n\nSalah satu aspek penting dari self-love adalah self-compassion, yaitu memperlakukan diri sendiri dengan kebaikan dan pengertian di saat-saat sulit, sama seperti Anda memperlakukan seorang teman baik. Ini juga berarti menerima ketidaksempurnaan Anda dan memahami bahwa kegagalan adalah bagian dari pengalaman manusia. Luangkan waktu untuk refleksi diri, identifikasi nilai-nilai inti Anda, dan hiduplah selaras dengan nilai-nilai tersebut. Self-love adalah perjalanan penemuan diri dan penerimaan yang berkelanjutan, yang akan memberdayakan Anda untuk menjalani kehidupan yang lebih otentik dan memuaskan.\n\nMembangun ritual self-care harian dapat menjadi cara yang kuat untuk mempraktikkan self-love. Ini bisa sesederhana meluangkan waktu untuk membaca buku, mandi air hangat, atau menikmati secangkir teh di pagi hari. Dengarkan tubuh dan pikiran Anda, dan berikan apa yang mereka butuhkan, bukan apa yang Anda pikir harus mereka butuhkan. Hindari perbandingan diri dengan orang lain, karena ini adalah pencuri kebahagiaan. Fokus pada pertumbuhan pribadi Anda dan rayakan keunikan Anda. Self-love adalah fondasi yang kokoh untuk kesejahteraan holistik.', image: 'https://cdn.idntimes.com/content-images/community/2023/05/img-20230530-140806-32d6a3626d984daa2d58033b8ad58937-b00d322ef137750a8cc0b6a0dc77c1f6.jpg' },
  { id: 9, category: 'Kesehatan Mental', title: 'Mengelola Kecemasan: Strategi Praktis Sehari-hari', description: 'Panduan untuk memahami dan mengelola tingkat kecemasan Anda dengan efektif agar hidup lebih tenang dan produktif.', fullContent: 'Kecemasan adalah respons alami terhadap stres, namun jika berlebihan dapat mengganggu kehidupan sehari-hari. Artikel ini membahas berbagai strategi praktis untuk mengelola kecemasan, termasuk teknik relaksasi, identifikasi pemicu, dan pentingnya mencari dukungan profesional. Langkah kecil setiap hari dapat membuat perbedaan besar.\n\nStrategi praktis lainnya untuk mengelola kecemasan meliputi olahraga teratur, diet seimbang, dan membatasi asupan kafein. Teknik pernapasan dalam, seperti pernapasan diafragma, dapat dengan cepat menenangkan sistem saraf. Mengenali dan menantang pola pikir negatif juga sangat efektif; alih-alih terjebak dalam spiral kekhawatiran, cobalah untuk melihat situasi dari perspektif yang berbeda. Membangun rutinitas yang sehat dan memastikan Anda memiliki waktu untuk relaksasi dan hobi juga penting. Jika kecemasan menghambat fungsi sehari-hari, jangan ragu untuk berbicara dengan terapis atau konselor.\n\nTeknik grounding dapat menjadi sangat membantu saat merasa cemas. Ini melibatkan memusatkan perhatian pada lingkungan sekitar Anda melalui panca indra. Misalnya, sebutkan lima hal yang bisa Anda lihat, empat hal yang bisa Anda sentuh, tiga hal yang bisa Anda dengar, dua hal yang bisa Anda cium, dan satu hal yang bisa Anda rasakan. Ini membantu mengalihkan fokus dari pikiran yang mengganggu ke momen saat ini. Latihan ini bisa dilakukan di mana saja dan kapan saja saat Anda merasa kecemasan mulai meningkat. Penting untuk menemukan strategi yang paling cocok untuk Anda dan mempraktikkannya secara teratur.', image: 'https://hapday.app/wp-content/uploads/2025/02/bwktz4yvtma.jpg' },
  { id: 10, category: 'Motivasi', title: 'Kekuatan Berpikir Positif: Mengubah Perspektif Hidup', description: 'Cara melatih pikiran untuk selalu melihat sisi positif dan bagaimana hal itu dapat meningkatkan kualitas hidup Anda secara keseluruhan.', fullContent: 'Berpikir positif bukan berarti mengabaikan realitas negatif, tetapi memilih untuk fokus pada potensi kebaikan dalam setiap situasi. Ini dapat meningkatkan suasana hati, mengurangi stres, dan meningkatkan resiliensi. Praktikkan afirmasi positif, visualisasi, dan habiskan waktu dengan orang-orang yang mendukung. Mengembangkan pola pikir positif membutuhkan latihan, tetapi imbalannya sepadai.\n\nUntuk melatih pikiran agar lebih positif, mulailah dengan menyadari pikiran negatif Anda tanpa menghakimi. Kemudian, secara sadar ganti pikiran negatif tersebut dengan yang lebih positif atau realistis. Latihan menulis jurnal syukur setiap hari juga dapat membantu Anda fokus pada hal-hal baik dalam hidup. Lingkari diri Anda dengan orang-orang yang optimis dan mendukung. Ingatlah bahwa perubahan pola pikir membutuhkan waktu dan kesabaran, tetapi dengan latihan yang konsisten, Anda dapat mengubah perspektif hidup Anda secara signifikan dan meningkatkan kesejahteraan emosional Anda.\n\nMembaca kisah-kisah inspiratif, mendengarkan podcast yang memotivasi, atau menonton video yang membangkitkan semangat juga dapat membantu menumbuhkan pola pikir positif. Hindari terlalu banyak terpapar berita negatif atau media sosial yang membanding-bandingkan. Fokus pada hal-hal yang dapat Anda syukuri setiap hari, bahkan hal-hal kecil sekalipun. Dengan mengalihkan fokus Anda secara sadar ke aspek-aspek positif, Anda akan mulai melihat dunia dengan cara yang lebih optimis dan menemukan kekuatan untuk mengatasi tantangan.', image: 'https://tkchapin.com/wp-content/uploads/2018/07/Philippians-48-Positive-Thinking-jpg.webp' },
  { id: 11, category: 'Judi Online', title: 'Rehabilitasi dan Dukungan bagi Pecandu Judi Online', description: 'Informasi tentang sumber daya dan program rehabilitasi yang tersedia untuk membantu individu pulih dari kecanduan judi online.', fullContent: 'Pemulihan dari kecanduan judi online adalah penyakit yang serius, tetapi pemulihan adalah mungkin. Ada berbagai sumber daya yang tersedia, termasuk terapi individu, kelompok dukungan (seperti Gamblers Anonymous), dan konseling keluarga. Penting untuk mencari bantuan sesegera mungkin dan membangun sistem dukungan yang kuat. Pemulihan adalah perjalanan, dan setiap langkah maju adalah kemenangan.\n\nProses rehabilitasi untuk pecandu judi online seringkali melibatkan kombinasi intervensi. Terapi perilaku kognitif (CBT) membantu mengidentifikasi dan mengubah pola pikir dan perilaku yang terkait dengan judi. Terapi kelompok menawarkan lingkungan dukungan di mana individu dapat berbagi pengalaman dan strategi koping. Dukungan keluarga juga krusial, karena keluarga seringkali merasakan dampak finansial dan emosional yang parah. Pencegahan kambuh adalah komponen penting dari pemulihan jangka panjang, melibatkan pengembangan strategi untuk mengatasi pemicu dan membangun jaringan dukungan yang berkelanjutan. Ingat, mencari bantuan adalah langkah pertama menuju kebebasan dari kecanduan.\n\nSangat disarankan untuk mencari bantuan profesional dari psikolog atau psikiater yang memiliki spesialisasi dalam kecanduan. Mereka dapat menyediakan evaluasi menyeluruh dan mengembangkan rencana perawatan yang dipersonalisasi. Selain itu, menjauhi lingkungan yang memicu perjudian, seperti situs web atau teman-teman yang aktif berjudi, adalah langkah penting. Membangun hobi dan minat baru yang tidak terkait dengan perjudian dapat mengisi kekosongan dan memberikan sumber kepuasan yang sehat. Ingatlah bahwa pemulihan adalah proses bertahap, dan relaps bisa menjadi bagian dari perjalanan; yang terpenting adalah untuk terus bangkit dan mencari dukungan ketika dibutuhkan.', image: 'https://radarmukomuko.bacakoran.co/upload/4c26b9f70bfe3cba2655d26061706345.jpeg' },
  { id: 12, category: 'Kesehatan Mental', title: 'Manfaat Meditasi untuk Kesehatan Otak dan Mental', description: 'Pelajari bagaimana meditasi dapat membantu meningkatkan fokus, mengurangi stres, dan mendukung kesehatan otak jangka panjang Anda.', fullContent: 'Meditasi bukan hanya tentang relaksasi, tetapi juga memiliki manfaat signifikan bagi kesehatan otak dan mental. Penelitian modern mendukung bahwa meditasi dapat mengubah struktur otak, meningkatkan konsentrasi, mengurangi kecemasan, dan meningkatkan kesejahteraan secara keseluruhan. Ada berbagai jenis meditasi, dari meditasi kesadaran hingga meditasi transendental. Menemukan gaya yang cocok untuk Anda dan berlatih secara teratur dapat membawa perubahan signifikan dalam hidup Anda.\n\nPraktik meditasi yang konsisten telah terbukti meningkatkan kepadatan materi abu-abu di area otak yang terkait dengan memori, pembelajaran, dan regulasi emosi. Ini juga dapat mengurangi aktivitas di amygdala, pusat respons ketakutan di otak, yang berkontribusi pada pengurangan kecemasan dan stres. Selain manfaat neurobiologis, meditasi juga meningkatkan kesadaran diri, membantu individu memahami pikiran dan emosi mereka dengan lebih jelas. Ini mengarah pada peningkatan regulasi emosi dan kemampuan untuk merespons situasi sulit dengan lebih tenang. Meditasi dapat menjadi alat yang ampuh untuk meningkatkan kualitas hidup dan kesehatan mental secara keseluruhan.\n\nAda banyak jenis meditasi yang berbeda, dan penting untuk menemukan yang paling cocok untuk Anda. Beberapa orang mungkin lebih suka meditasi kesadaran yang berfokus pada napas, sementara yang lain mungkin menemukan meditasi cinta kasih atau visualisasi lebih bermanfaat. Mulailah dengan sesi singkat, misalnya 5-10 menit sehari, dan secara bertahap tingkatkan durasinya. Konsistensi lebih penting daripada durasi. Menggunakan aplikasi meditasi terpandu dapat membantu pemula untuk tetap berada di jalur yang benar. Ingatlah bahwa meditasi adalah latihan, dan seperti otot, pikiran Anda akan menjadi lebih kuat dan lebih terampil dengan praktik yang teratur.', image: 'https://cdn1-production-images-kly.akamaized.net/BBoLAd9XLn_8d7l-TxHWltATcoQ=/1200x675/smart/filters:quality(75):strip_icc():format(jpeg)/kly-media-production/medias/3502676/original/013868800_1625568634-yoga-3053488_640.jpg' },
];

const MIN_CHARS_PER_PAGE = 1500; // Minimum characters per page

const Baca = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagedContent, setPagedContent] = useState([]);
  const [hasAnimated, setHasAnimated] = useState(false); // State baru untuk mengontrol animasi

  useEffect(() => {
    setLoading(true);
    setError(false);
    setCurrentPage(1); // Reset page when article changes
    setHasAnimated(false); // Reset animasi saat artikel berubah

    const foundArticle = allArticles.find(a => a.id === parseInt(articleId));

    if (foundArticle) {
      setArticle(foundArticle);

      const paragraphs = foundArticle.fullContent.split('\n\n');
      let pages = [];
      let currentPageContent = [];
      let currentChars = 0;

      paragraphs.forEach(para => {
        const paraLength = para.length;
        if (currentChars + paraLength <= (MIN_CHARS_PER_PAGE * 1.2) || currentPageContent.length === 0) {
          currentPageContent.push(para);
          currentChars += paraLength;
        } else {
          pages.push(currentPageContent.join('\n\n'));
          currentPageContent = [para];
          currentChars = paraLength;
        }
      });

      if (currentPageContent.length > 0) {
        pages.push(currentPageContent.join('\n\n'));
      }

      if (pages.length === 0 && foundArticle.fullContent.length > MIN_CHARS_PER_PAGE) {
          const rawContent = foundArticle.fullContent;
          for (let i = 0; i < rawContent.length; i += MIN_CHARS_PER_PAGE) {
              pages.push(rawContent.substring(i, i + MIN_CHARS_PER_PAGE));
          }
      } else if (pages.length === 0 && foundArticle.fullContent.length <= MIN_CHARS_PER_PAGE) {
          pages.push(foundArticle.fullContent);
      }

      setPagedContent(pages);
      setLoading(false); // Set loading false setelah semua data dan pagination siap

      // Trigger animation after a short delay to ensure rendering
      const animationTimer = setTimeout(() => {
        setHasAnimated(true);
      }, 100); // Penundaan kecil agar kelas awal diterapkan sebelum dihapus

      return () => clearTimeout(animationTimer); // Membersihkan timer jika komponen di-unmount
    } else {
      setError(true);
      setLoading(false); // Set loading false meskipun ada error
    }
  }, [articleId]);

  // Handle navigation on error
  useEffect(() => {
    if (error || !article) {
      const timer = setTimeout(() => {
        navigate('/artikel'); // Redirect to blog list
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, article, navigate]);

  const totalPages = pagedContent.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#092635] text-[#9EC8B9] flex items-center justify-center text-xl">
        Memuat artikel...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-[#092635] text-red-400 flex flex-col items-center justify-center p-4">
        <p className="text-xl mb-4 text-center">Artikel tidak ditemukan atau terjadi kesalahan. Anda akan diarahkan kembali ke halaman blog.</p>
        <Link to="/artikel" className="bg-[#5C8374] text-white px-6 py-3 rounded-lg hover:bg-[#1B4242] transition-colors">
          Kembali ke Blog
        </Link>
      </div>
    );
  }

  // Filter out the current article from "more articles"
  const moreArticles = allArticles.filter(a => a.id !== article.id).slice(0, 3); // Get 3 other articles

  return (
    <div className="min-h-screen mt-10 bg-[#092635] py-16 px-4 sm:px-6 lg:px-8 text-[#9EC8B9]">
      <div className={`
        max-w-7xl mx-auto flex flex-col lg:flex-row gap-8
        transform transition-all duration-700 ease-out
        ${hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}>
        {/* Main Article Content */}
        <div className="lg:w-2/3 bg-[#1B4242] rounded-xl shadow-xl p-6 md:p-8 flex-grow">
          {/* Tombol kembali */}
          <Link to="/artikel" className="inline-flex items-center text-[#9EC8B9] hover:text-[#5C8374] transition-colors mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Kembali ke Blog
          </Link>

          {/* Gambar Artikel */}
          {article.image && (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-auto rounded-lg mb-6 object-cover max-h-96"
            />
          )}

          {/* Kategori Artikel */}
          <span className="inline-block bg-[#9EC8B9] text-[#092635] text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            {article.category}
          </span>

          {/* Judul Artikel */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#9EC8B9] leading-tight mb-4">
            {article.title}
          </h1>

          {/* Konten Artikel Lengkap - Menggunakan ReactMarkdown */}
          <div className="prose prose-lg prose-invert text-[#9EC8B9] leading-relaxed text-justify hide-scrollbar">
            <ReactMarkdown
              children={pagedContent[currentPage - 1]} // Display current page content
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            />
          </div>

          {/* Pagination for Main Article Content */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`
                  px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                  ${currentPage === 1
                    ? 'bg-[#1B4242] text-[#9EC8B9] cursor-not-allowed'
                    : 'bg-[#5C8374] text-white hover:bg-[#1B4242]'}
                `}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`
                    px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                    ${currentPage === pageNumber
                      ? 'bg-[#9EC8B9] text-[#092635] shadow-md'
                      : 'bg-[#1B4242] text-[#9EC8B9] hover:bg-[#5C8374] hover:text-white'}
                  `}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`
                  px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                  ${currentPage === totalPages
                    ? 'bg-[#1B4242] text-[#9EC8B9] cursor-not-allowed'
                    : 'bg-[#5C8374] text-white hover:bg-[#1B4242]'}
                `}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Sidebar / Read News Section */}
        <div className="lg:w-1/3 bg-[#1B4242] rounded-xl shadow-xl p-6 md:p-8 h-fit lg:sticky lg:top-16">
          <h2 className="text-2xl font-bold text-[#9EC8B9] mb-6">Read More News</h2>
          <div className="space-y-6">
            {moreArticles.length > 0 ? (
              moreArticles.map(art => (
                <Link to={`/artikel/${art.id}`} key={art.id} className="block group">
                  <div className="flex items-center gap-4 bg-[#092635] rounded-lg p-3 hover:bg-[#5C8374] transition-colors duration-300">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-20 h-16 object-cover rounded-md flex-shrink-0"
                    />
                    <div>
                      <h3 className="text-md font-semibold text-white group-hover:text-[#092635] leading-tight mb-1 line-clamp-2">
                        {art.title}
                      </h3>
                      <p className="text-xs text-[#9EC8B9] group-hover:text-[#D9D9D9] line-clamp-2">
                        {art.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-[#9EC8B9] text-center">Tidak ada artikel lain untuk ditampilkan.</p>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles for Scrollbar and Paragraph Spacing */}
      <style jsx>{`
        /* Sembunyikan scrollbar untuk WebKit browsers (Chrome, Safari, Edge) */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Sembunyikan scrollbar untuk Firefox */
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
        }

        /* Override default prose paragraph margin for more spacing */
        .prose p {
          margin-bottom: 1.5em; /* Add more bottom margin to paragraphs */
          margin-top: 1.5em;    /* Add top margin also for consistency */
        }

        /* Adjust for potential first paragraph without top margin */
        .prose > p:first-child {
            margin-top: 0; /* Remove top margin for the very first paragraph if it's unwanted */
        }
      `}</style>
    </div>
  );
};

export default Baca;