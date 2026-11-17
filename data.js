const PAWN_THEMES = [
  {
    id: "garuda",
    label: "Garuda Cilik",
    bg: "#FF5E7E",
    text: "#FFFFFF",
    svg: `<svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9 7L3 8L7 13L6 19L12 16L18 19L17 13L21 8L15 7L12 2Z"/></svg>`,
  },
  {
    id: "monas",
    label: "Penjelajah Monas",
    bg: "#2979FF",
    text: "#FFFFFF",
    svg: `<svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C10.9 3.6 10.2 5.2 12 6.8C13.8 5.2 13.1 3.6 12 2ZM9 7H15L14 9H10L9 7ZM10.5 10H13.5L14.5 18H9.5L10.5 10ZM7 19H17L19 22H5L7 19Z"/></svg>`,
  },
  {
    id: "bintang",
    label: "Bintang Nusantara",
    bg: "#FFB300",
    text: "#0F172A",
    svg: `<svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5L14.9 8.4L21.4 9.3L16.7 13.9L17.8 20.4L12 17.3L6.2 20.4L7.3 13.9L2.6 9.3L9.1 8.4L12 2.5Z"/></svg>`,
  },
  {
    id: "padi",
    label: "Padi & Kapas",
    bg: "#00C853",
    text: "#FFFFFF",
    svg: `<svg class="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z"/></svg>`,
  },
];

const LADDERS = [
  { from: 4, to: 25 },
  { from: 13, to: 46 },
  { from: 33, to: 49 },
  { from: 42, to: 63 },
  { from: 50, to: 69 },
  { from: 62, to: 81 },
  { from: 74, to: 92 },
  { from: 85, to: 97 },
];

const SNAKES = [
  { from: 27, to: 7 },
  { from: 40, to: 3 },
  { from: 43, to: 18 },
  { from: 54, to: 31 },
  { from: 66, to: 45 },
  { from: 76, to: 58 },
  { from: 89, to: 53 },
  { from: 99, to: 41 },
];

const EVENT_SQUARES = [11, 22, 36, 57, 68, 79, 94];

const BANK_SOAL = [
  {
    id: 1,
    tema: "Transisi Politik & Awal Pemerintahan",
    pertanyaan:
      "Apa isi dari Tri Tuntutan Rakyat (Tritura) yang disuarakan mahasiswa dan rakyat pada awal tahun 1966?",
    pilihan: [
      "Bubarkan PKI, bersihkan Kabinet Dwikora, dan turunkan harga barang",
      "Kembali ke UUD 1945, bubarkan Konstituante, dan bentuk MPRS",
      "Laksanakan Pemilu, cabut Dwifungsi ABRI, dan otonomi daerah",
      "Nasionalisasi perusahaan asing, bentuk kabinet kerja, dan turunkan pajak",
    ],
    jawabanBenar: 0,
    fakta:
      "Tritura (Tri Tuntutan Rakyat) dikumandangkan pada 12 Januari 1966 oleh KAMI dan berbagai kesatuan aksi yang menuntut pembubaran PKI, pembersihan Kabinet Dwikora, serta penurunan harga kebutuhan pokok.",
  },
  {
    id: 2,
    tema: "Transisi Politik & Awal Pemerintahan",
    pertanyaan:
      "Surat Perintah Sebelas Maret (Supersemar) tahun 1966 memberikan mandat kepada Letjen Soeharto untuk...",
    pilihan: [
      "Mengambil alih seluruh tindakan yang dianggap perlu demi terjaminnya keamanan dan ketenangan jalannya pemerintahan",
      "Membubarkan parlemen dan menyusun konstitusi baru menggantikan UUD 1945",
      "Memindahkan ibu kota negara sementara ke Yogyakarta karena situasi genting",
      "Mengadakan pemilihan umum presiden secara langsung dalam waktu enam bulan",
    ],
    jawabanBenar: 0,
    fakta:
      "Supersemar ditandatangani Presiden Soekarno pada 11 Maret 1966 yang memberi mandat kepada Letjen Soeharto untuk memulihkan keamanan dan ketertiban nasional.",
  },
  {
    id: 3,
    tema: "Transisi Politik & Awal Pemerintahan",
    pertanyaan:
      "Organisasi mahasiswa yang menjadi pelopor demonstrasi menuntut perubahan pada masa transisi 1965–1966 adalah...",
    pilihan: [
      "KAMI (Kesatuan Aksi Mahasiswa Indonesia)",
      "KAPPI (Kesatuan Aksi Pemuda Pelajar Indonesia)",
      "KASI (Kesatuan Aksi Sarjana Indonesia)",
      "KAWI (Kesatuan Aksi Wanita Indonesia)",
    ],
    jawabanBenar: 0,
    fakta:
      "KAMI dibentuk pada 25 Oktober 1965 dan menjadi motor utama aksi demonstrasi mahasiswa dalam menyuarakan Tritura pada awal tahun 1966.",
  },
  {
    id: 4,
    tema: "Transisi Politik & Awal Pemerintahan",
    pertanyaan:
      "Melalui Ketetapan MPRS Nomor XXXIII/MPRS/1967, MPRS menetapkan...",
    pilihan: [
      "Pencabutan kekuasaan pemerintahan negara dari Presiden Soekarno dan pengangkatan Jenderal Soeharto sebagai Pejabat Presiden",
      "Pembentukan Kabinet Pembangunan I untuk memulai Repelita tahap pertama",
      "Penyatuan seluruh partai politik menjadi tiga kekuatan sosial politik",
      "Pembentukan Komisi Empat untuk memberantas korupsi di lingkungan birokrasi",
    ],
    jawabanBenar: 0,
    fakta:
      "Sidang Istimewa MPRS pada Maret 1967 mengeluarkan Tap MPRS No. XXXIII/MPRS/1967 yang mengangkat Jenderal Soeharto sebagai Pejabat Presiden RI.",
  },
  {
    id: 5,
    tema: "Transisi Politik & Awal Pemerintahan",
    pertanyaan:
      "Kapan Jenderal Soeharto secara resmi dilantik oleh MPRS menjadi Presiden Republik Indonesia penuh?",
    pilihan: [
      "27 Maret 1968",
      "11 Maret 1966",
      "17 Agustus 1967",
      "5 Juli 1971",
    ],
    jawabanBenar: 0,
    fakta:
      "Melalui Sidang Umum V MPRS dan Tap MPRS No. XLIV/MPRS/1968, Jenderal Soeharto dilantik menjadi Presiden Republik Indonesia pada 27 Maret 1968.",
  },
  {
    id: 6,
    tema: "Transisi Politik & Awal Pemerintahan",
    pertanyaan:
      "Kabinet transisi yang dibentuk pada Juli 1966 dengan tugas utama menciptakan stabilitas politik dan ekonomi (Dwidharma) adalah...",
    pilihan: [
      "Kabinet Ampera",
      "Kabinet Dwikora",
      "Kabinet Pembangunan I",
      "Kabinet Karya",
    ],
    jawabanBenar: 0,
    fakta:
      "Kabinet Ampera (Amanat Penderitaan Rakyat) dibentuk pada 25 Juli 1966 dengan program Caturkarya dan Dwidharma untuk memulihkan stabilitas ekonomi dan politik.",
  },
  {
    id: 7,
    tema: "Transisi Politik & Awal Pemerintahan",
    pertanyaan:
      "Apa semboyan tekad dasar yang diusung pemerintah Orde Baru pada awal berdirinya?",
    pilihan: [
      "Melaksanakan Pancasila dan UUD 1945 secara murni dan konsekuen",
      "Politik sebagai panglima tertinggi dalam revolusi nasional",
      "Berdikari tanpa kerja sama ekonomi dengan negara Barat",
      "Nasakom sebagai poros persatuan seluruh kekuatan bangsa",
    ],
    jawabanBenar: 0,
    fakta:
      "Orde Baru mendefinisikan dirinya sebagai tatanan seluruh perikehidupan rakyat, bangsa, dan negara yang diletakkan kembali pada pelaksanaan Pancasila dan UUD 1945 secara murni dan konsekuen.",
  },
  {
    id: 8,
    tema: "Transisi Politik & Awal Pemerintahan",
    pertanyaan:
      "Langkah awal pemerintah Orde Baru untuk mengatasi hiperinflasi tahun 1966 yang mencapai sekitar 650% adalah...",
    pilihan: [
      "Menerapkan kebijakan anggaran berimbang, penjadwalan utang luar negeri, dan pengendalian harga kebutuhan pokok",
      "Mencetak uang baru sebanyak-banyaknya untuk membiayai proyek mercusuar",
      "Menghentikan seluruh perdagangan ekspor-impor selama lima tahun",
      "Menetapkan nilai tukar rupiah tetap terhadap emas murni",
    ],
    jawabanBenar: 0,
    fakta:
      "Melalui tim penasihat ekonomi (seperti Widjojo Nitisastro dkk.), pemerintah menerapkan kebijakan anggaran berimbang dan restrukturisasi utang melalui Paris Club serta IGGI sehingga inflasi berhasil ditekan.",
  },
  {
    id: 9,
    tema: "Transisi Politik & Awal Pemerintahan",
    pertanyaan:
      "Pemilihan Umum pertama pada masa pemerintahan Orde Baru diselenggarakan pada tahun...",
    pilihan: ["1971", "1968", "1973", "1977"],
    jawabanBenar: 0,
    fakta:
      "Pemilu 1971 dilaksanakan pada 5 Juli 1971 dan diikuti oleh 9 partai politik serta 1 organisasi Golongan Karya (Golkar).",
  },

  {
    id: 10,
    tema: "Program Pembangunan Ekonomi & Sosial",
    pertanyaan:
      'Apa yang dimaksud dengan konsep "Trilogi Pembangunan" yang menjadi pedoman kebijakan pembangunan Orde Baru?',
    pilihan: [
      "Pemerataan pembangunan, pertumbuhan ekonomi yang cukup tinggi, dan stabilitas nasional yang sehat dan dinamis",
      "Kemandirian pangan, industrialisasi militer, dan ekspansi wilayah perdagangan",
      "Swastanisasi BUMN, penghapusan subsidi desa, dan pasar bebas tanpa pajak",
      "Pembangunan kota metropolitan, nasionalisasi bank, dan wajib belajar perguruan tinggi",
    ],
    jawabanBenar: 0,
    fakta:
      "Trilogi Pembangunan terdiri atas tiga pilar yang saling menopang: stabilitas nasional yang dinamis, pertumbuhan ekonomi yang tinggi, dan pemerataan pembangunan beserta hasil-hasilnya.",
  },
  {
    id: 11,
    tema: "Program Pembangunan Ekonomi & Sosial",
    pertanyaan:
      "Kapan program Rencana Pembangunan Lima Tahun (Repelita) I mulai dilaksanakan oleh pemerintah Orde Baru?",
    pilihan: [
      "1 April 1969",
      "17 Agustus 1966",
      "1 Januari 1973",
      "1 April 1975",
    ],
    jawabanBenar: 0,
    fakta:
      "Repelita I dimulai pada 1 April 1969 hingga 31 Maret 1974 dengan titik berat pada sektor pertanian dan industri yang mendukung pertanian.",
  },
  {
    id: 12,
    tema: "Program Pembangunan Ekonomi & Sosial",
    pertanyaan:
      "Pada tahun 1984, Indonesia memperoleh penghargaan dari FAO (Organisasi Pangan dan Pertanian PBB) atas keberhasilan mencapai...",
    pilihan: [
      "Swasembada Beras nasional",
      "Ekspor gandum terbesar di Asia Tenggara",
      "Penghapusan impor gula dan kedelai secara permanen",
      "Pembangunan bendungan terpanjang di dunia",
    ],
    jawabanBenar: 0,
    fakta:
      "Melalui Revolusi Hijau (program Bimas, Inmas, dan Insus), produksi beras Indonesia meningkat pesat sehingga mencapai Swasembada Beras pada tahun 1984 dan mendapat penghargaan FAO pada 1985.",
  },
  {
    id: 13,
    tema: "Program Pembangunan Ekonomi & Sosial",
    pertanyaan:
      "Program peningkatan produksi pertanian melalui penggunaan bibit unggul, pupuk, irigasi, pestisida, dan penyuluhan disebut...",
    pilihan: [
      "Intensifikasi Pertanian (Panca Usaha Tani)",
      "Ekstensifikasi Lahan Gambut",
      "Diversifikasi Perkebunan Ekspor",
      "Mekanisasi Perdagangan Pangan",
    ],
    jawabanBenar: 0,
    fakta:
      "Intensifikasi pertanian diwujudkan melalui Panca Usaha Tani (pengolahan tanah yang baik, irigasi teratur, bibit unggul, pemupukan tepat, dan pemberantasan hama).",
  },
  {
    id: 14,
    tema: "Program Pembangunan Ekonomi & Sosial",
    pertanyaan:
      "Kebijakan pemerintah Orde Baru untuk memperluas akses pendidikan dasar hingga ke pelosok desa sejak tahun 1973 dikenal dengan nama...",
    pilihan: [
      "SD Inpres (Sekolah Dasar Instruksi Presiden)",
      "Sekolah Rakyat Mandiri",
      "Taman Siswa Nasional",
      "Balai Pendidikan Desa Terpadu",
    ],
    jawabanBenar: 0,
    fakta:
      "Melalui Inpres Nomor 10 Tahun 1973, ratusan ribu gedung SD Inpres dibangun di seluruh Indonesia sehingga angka partisipasi sekolah dasar meningkat drastis.",
  },
  {
    id: 15,
    tema: "Program Pembangunan Ekonomi & Sosial",
    pertanyaan:
      "Lembaga pemerintah yang dibentuk pada tahun 1970 untuk mengelola program pengendalian laju pertumbuhan penduduk (Keluarga Berencana) adalah...",
    pilihan: [
      "BKKBN (Badan Koordinasi Keluarga Berencana Nasional)",
      "Bulog (Badan Urusan Logistik)",
      "Bappenas (Badan Perencanaan Pembangunan Nasional)",
      "BPPT (Badan Pengkajian dan Penerapan Teknologi)",
    ],
    jawabanBenar: 0,
    fakta:
      'BKKBN dibentuk pada tahun 1970 dengan slogan populer "Dua Anak Cukup" untuk mengendalikan laju pertumbuhan penduduk dan meningkatkan kesejahteraan keluarga.',
  },
  {
    id: 16,
    tema: "Program Pembangunan Ekonomi & Sosial",
    pertanyaan:
      "Peluncuran Satelit Komunikasi Domestik Palapa A1 pada 8 Juli 1976 bertujuan utama untuk...",
    pilihan: [
      "Menyatukan jaringan telekomunikasi dan penyiaran di seluruh kepulauan Nusantara",
      "Mengawasi pergerakan kapal asing di Samudra Hindia secara militer",
      "Menggantikan seluruh jaringan kabel listrik di Pulau Jawa",
      "Menyediakan layanan internet berkecepatan tinggi bagi universitas",
    ],
    jawabanBenar: 0,
    fakta:
      "Satelit Palapa A1 menjadikan Indonesia negara berkembang pertama yang mengoperasikan satelit komunikasi domestik sendiri untuk menghubungkan wilayah kepulauan Nusantara.",
  },
  {
    id: 17,
    tema: "Program Pembangunan Ekonomi & Sosial",
    pertanyaan:
      "Layanan kesehatan dasar terpadu untuk ibu dan anak di tingkat desa/kelurahan yang digalakkan pada masa Orde Baru adalah...",
    pilihan: [
      "Puskesmas dan Posyandu (Pos Pelayanan Terpadu)",
      "Rumah Sakit Rujukan Provinsi",
      "Klinik Asuransi Swasta",
      "Karantina Kesehatan Pelabuhan",
    ],
    jawabanBenar: 0,
    fakta:
      "Puskesmas (Pusat Kesehatan Masyarakat) dan Posyandu menjadi ujung tombak peningkatan gizi balita, imunisasi, dan kesehatan ibu-anak di seluruh pelosok Indonesia.",
  },
  {
    id: 18,
    tema: "Program Pembangunan Ekonomi & Sosial",
    pertanyaan:
      "Tokoh ilmuwan Indonesia yang memimpin pengembangan industri dirgantara nasional (IPTN / pesawat CN-235 dan N-250) pada masa Orde Baru adalah...",
    pilihan: [
      "Prof. Dr. Ing. B.J. Habibie",
      "Prof. Dr. Widjojo Nitisastro",
      "Prof. Dr. Emil Salim",
      "Ir. Sutami",
    ],
    jawabanBenar: 0,
    fakta:
      "B.J. Habibie menjabat sebagai Menristek sekaligus memimpin IPTN (Industri Pesawat Terbang Nusantara) yang berhasil menerbangkan pesawat karya anak bangsa N-250 Gatotkaca pada 10 Agustus 1995.",
  },

  {
    id: 19,
    tema: "Sistem Politik & Hubungan Luar Negeri",
    pertanyaan:
      "Pada tahun 1973, pemerintah melakukan kebijakan penyederhanaan (fusi) partai politik menjadi dua partai dan satu Golongan Karya, yaitu...",
    pilihan: [
      "PPP (Partai Persatuan Pembangunan), PDI (Partai Demokrasi Indonesia), dan Golkar",
      "PNI, Masyumi, dan Golkar",
      "NU, Parmusi, dan Partai Katolik",
      "PKB, PAN, dan PDI Perjuangan",
    ],
    jawabanBenar: 0,
    fakta:
      "Pada Januari 1973, empat partai Islam berfusi menjadi PPP dan lima partai nasionalis/non-Islam berfusi menjadi PDI, berdampingan dengan Golongan Karya (Golkar).",
  },
  {
    id: 20,
    tema: "Sistem Politik & Hubungan Luar Negeri",
    pertanyaan:
      "Partai-partai politik berbasis Islam (NU, Parmusi, PSII, dan Perti) pada 5 Januari 1973 bergabung ke dalam satu wadah partai bernama...",
    pilihan: [
      "Partai Persatuan Pembangunan (PPP)",
      "Partai Demokrasi Indonesia (PDI)",
      "Partai Syarikat Islam Indonesia Baru",
      "Partai Masyumi Reformasi",
    ],
    jawabanBenar: 0,
    fakta:
      "Empat partai Islam peserta Pemilu 1971 (NU, Parmusi, PSII, dan Perti) menyatukan diri menjadi Partai Persatuan Pembangunan (PPP) pada 5 Januari 1973.",
  },
  {
    id: 21,
    tema: "Sistem Politik & Hubungan Luar Negeri",
    pertanyaan:
      "Konsep yang menempatkan ABRI (TNI dan Polri saat itu) sebagai kekuatan pertahanan-keamanan sekaligus kekuatan sosial-politik disebut...",
    pilihan: [
      "Dwifungsi ABRI",
      "Sapta Marga Terpadu",
      "Komando Teritorial Mandiri",
      "Pertahanan Rakyat Semesta",
    ],
    jawabanBenar: 0,
    fakta:
      "Konsep Dwifungsi ABRI memberikan peran ganda kepada militer, baik sebagai penjaga pertahanan-keamanan negara maupun pemegang jabatan sosial-politik di pemerintahan dan parlemen.",
  },
  {
    id: 22,
    tema: "Sistem Politik & Hubungan Luar Negeri",
    pertanyaan:
      "Program penataran untuk menyeragamkan pemahaman dan pengamalan nilai-nilai Pancasila sejak tahun 1978 dikenal dengan sebutan...",
    pilihan: [
      "P4 (Pedoman Penghayatan dan Pengamalan Pancasila / Ekaprasetia Pancakarsa)",
      "Manipol USDEK (Manifesto Politik UUD 1945)",
      "Indoktrinasi Tujuh Bahan Pokok Revolusi",
      "Kurikulum Bela Negara Semesta",
    ],
    jawabanBenar: 0,
    fakta:
      "P4 ditetapkan melalui Tap MPR No. II/MPR/1978 tentang Ekaprasetia Pancakarsa dan disosialisasikan secara luas oleh lembaga BP-7 kepada pelajar, mahasiswa, dan pegawai negeri.",
  },
  {
    id: 23,
    tema: "Sistem Politik & Hubungan Luar Negeri",
    pertanyaan:
      "Langkah politik luar negeri pertama yang diambil Indonesia pada awal Orde Baru (Agustus 1966) untuk memulihkan stabilitas kawasan adalah...",
    pilihan: [
      "Mengakhiri konfrontasi dan memulihkan hubungan diplomatik dengan Malaysia",
      "Membentuk pakta pertahanan militer bersama Australia dan Selandia Baru",
      "Memutuskan hubungan diplomatik dengan seluruh negara anggota PBB",
      "Mengirimkan pasukan perdamaian ke Semenanjung Korea",
    ],
    jawabanBenar: 0,
    fakta:
      "Persetujuan Bangkok yang ditandatangani Adam Malik dan Tun Abdul Razak pada 11 Agustus 1966 di Jakarta secara resmi mengakhiri konfrontasi Indonesia–Malaysia.",
  },
  {
    id: 24,
    tema: "Sistem Politik & Hubungan Luar Negeri",
    pertanyaan:
      "Pada tanggal 28 September 1966, Indonesia mengambil langkah penting di kancah internasional, yaitu...",
    pilihan: [
      "Kembali menjadi anggota Perserikatan Bangsa-Bangsa (PBB)",
      "Keluar dari keanggotaan Gerakan Non-Blok (GNB)",
      "Menandatangani perjanjian pasar tunggal Eropa",
      "Menjadi anggota tetap Dewan Keamanan PBB",
    ],
    jawabanBenar: 0,
    fakta:
      "Setelah sempat keluar pada Januari 1965, Indonesia kembali aktif menjadi anggota ke-60 PBB pada 28 September 1966.",
  },
  {
    id: 25,
    tema: "Sistem Politik & Hubungan Luar Negeri",
    pertanyaan:
      "Siapakah Menteri Luar Negeri Indonesia yang ikut menandatangani Deklarasi Bangkok pada 8 Agustus 1967 sebagai pendiri ASEAN?",
    pilihan: [
      "Adam Malik",
      "Ali Alatas",
      "Mochtar Kusumaatmadja",
      "Soebandrio",
    ],
    jawabanBenar: 0,
    fakta:
      "Adam Malik mewakili Indonesia bersama empat menteri luar negeri lainnya (Malaysia, Filipina, Singapura, dan Thailand) dalam menandatangani Deklarasi Bangkok pada 8 Agustus 1967.",
  },
  {
    id: 26,
    tema: "Sistem Politik & Hubungan Luar Negeri",
    pertanyaan:
      "Pada periode 1992–1995, Indonesia dipercaya memegang kepemimpinan organisasi internasional besar melalui KTT ke-10 di Jakarta, yaitu...",
    pilihan: [
      "Gerakan Non-Blok (GNB)",
      "Organisasi Negara-Negara Pengekspor Minyak (OPEC)",
      "Liga Bangsa-Bangsa Asia Pasifik",
      "Persemakmuran Bangsa-Bangsa",
    ],
    jawabanBenar: 0,
    fakta:
      "Indonesia menjadi tuan rumah KTT ke-10 Gerakan Non-Blok di Jakarta pada September 1992 dan menjabat sebagai Ketua GNB periode 1992–1995.",
  },
  {
    id: 27,
    tema: "Sistem Politik & Hubungan Luar Negeri",
    pertanyaan:
      "Pertemuan para pemimpin ekonomi APEC di Bogor pada November 1994 menghasilkan kesepakatan perdagangan bebas kawasan yang dikenal sebagai...",
    pilihan: [
      "Deklarasi Bogor (Bogor Goals)",
      "Piagam Jakarta Baru",
      "Traktat Bali 1994",
      "Konsensus Bandung II",
    ],
    jawabanBenar: 0,
    fakta:
      'KTT APEC II di Bogor pada 15 November 1994 menghasilkan "Bogor Goals" yang menargetkan liberalisasi perdagangan dan investasi di kawasan Asia Pasifik.',
  },

  {
    id: 28,
    tema: "Dinamika Akhir & Masa Transisi 1998",
    pertanyaan:
      "Pemicu ekonomi utama yang mengguncang perekonomian Indonesia sejak pertengahan tahun 1997 adalah...",
    pilihan: [
      "Krisis moneter Asia yang menyebabkan nilai tukar Rupiah merosot tajam terhadap Dolar AS",
      "Jatuhnya harga batu bara dunia akibat penemuan energi nuklir baru",
      "Embargo perdagangan total dari negara-negara Amerika Latin",
      "Bencana kekeringan sepuluh tahun berturut-turut di seluruh Asia",
    ],
    jawabanBenar: 0,
    fakta:
      "Krisis finansial Asia yang bermula di Thailand pada Juli 1997 merembet ke Indonesia dan membuat nilai tukar Rupiah anjlok dari sekitar Rp2.500 menjadi lebih dari Rp15.000 per Dolar AS.",
  },
  {
    id: 29,
    tema: "Dinamika Akhir & Masa Transisi 1998",
    pertanyaan:
      'Istilah "KKN" yang menjadi sorotan utama gerakan mahasiswa untuk diberantas pada tuntutan Reformasi 1998 merupakan singkatan dari...',
    pilihan: [
      "Korupsi, Kolusi, dan Nepotisme",
      "Krisis, Kredit, dan Nasionalisasi",
      "Koalisi, Komando, dan Sentralisasi",
      "Koperasi, Keuangan, dan Niaga",
    ],
    jawabanBenar: 0,
    fakta:
      "Pemberantasan Korupsi, Kolusi, dan Nepotisme (KKN) menjadi salah satu dari enam agenda utama tuntutan gerakan Reformasi 1998.",
  },
  {
    id: 30,
    tema: "Dinamika Akhir & Masa Transisi 1998",
    pertanyaan:
      'Berikut ini yang termasuk dalam "Enam Agenda Reformasi 1998" yang disuarakan mahasiswa dan masyarakat adalah...',
    pilihan: [
      "Amandemen UUD 1945, penghapusan Dwifungsi ABRI, dan otonomi daerah seluas-luasnya",
      "Pembubaran DPR/MPR secara permanen dan kembali ke UUDS 1950",
      "Penghapusan pemilihan umum daerah dan pemusatan kekuasaan di ibu kota",
      "Penggabungan seluruh partai politik menjadi satu partai tunggal negara",
    ],
    jawabanBenar: 0,
    fakta:
      "Enam Agenda Reformasi meliputi: suksesi kepemimpinan nasional, amandemen UUD 1945, pemberantasan KKN, penghapusan Dwifungsi ABRI, penegakan supremasi hukum, dan pelaksanaan otonomi daerah.",
  },
  {
    id: 31,
    tema: "Dinamika Akhir & Masa Transisi 1998",
    pertanyaan:
      "Peristiwa tragis pada 12 Mei 1998 yang menewaskan empat mahasiswa Universitas Trisakti dan memicu gelombang demonstrasi lebih besar dikenal sebagai...",
    pilihan: [
      "Tragedi Trisakti",
      "Peristiwa Malari",
      "Peristiwa Tanjung Priok",
      "Peristiwa Kudatuli",
    ],
    jawabanBenar: 0,
    fakta:
      "Pada 12 Mei 1998, empat mahasiswa Universitas Trisakti (Elang Mulia Lesmana, Heri Hertanto, Hafidin Royan, dan Hendriawan Sie) gugur dalam aksi damai menuntut reformasi.",
  },
  {
    id: 32,
    tema: "Dinamika Akhir & Masa Transisi 1998",
    pertanyaan:
      "Untuk mengatasi krisis moneter 1997–1998, pemerintah Indonesia menandatangani Letter of Intent (LoI) guna memperoleh paket bantuan dana dari...",
    pilihan: [
      "IMF (International Monetary Fund / Dana Moneter Internasional)",
      "UNESCO (Organisasi Pendidikan, Keilmuan, dan Kebudayaan PBB)",
      "WHO (Organisasi Kesehatan Dunia)",
      "ASEAN Free Trade Area (AFTA)",
    ],
    jawabanBenar: 0,
    fakta:
      "Pemerintah menandatangani kesepakatan bantuan dan program penyesuaian struktural dengan IMF sejak Oktober 1997, namun krisis ekonomi dan kepercayaan politik tetap berlanjut.",
  },
  {
    id: 33,
    tema: "Dinamika Akhir & Masa Transisi 1998",
    pertanyaan:
      "Pada 18–21 Mei 1998, ribuan mahasiswa dari berbagai perguruan tinggi menduduki gedung lembaga negara untuk mendesak perubahan, yaitu...",
    pilihan: [
      "Gedung DPR/MPR di Senayan, Jakarta",
      "Gedung Merdeka di Bandung",
      "Gedung Agung di Yogyakarta",
      "Kantor Sekretariat ASEAN di Jakarta",
    ],
    jawabanBenar: 0,
    fakta:
      "Pendudukan Gedung DPR/MPR oleh ribuan mahasiswa pada 18–21 Mei 1998 menjadi puncak tekanan politik yang mendorong pimpinan DPR/MPR meminta Presiden Soeharto mundur.",
  },
  {
    id: 34,
    tema: "Dinamika Akhir & Masa Transisi 1998",
    pertanyaan:
      "Pada tanggal berapakah Presiden Soeharto secara resmi mengumumkan pengunduran dirinya dari jabatan Presiden Republik Indonesia?",
    pilihan: ["21 Mei 1998", "12 Mei 1998", "10 Maret 1998", "17 Agustus 1998"],
    jawabanBenar: 0,
    fakta:
      "Pada 21 Mei 1998 pukul 09.05 WIB di Istana Merdeka, Presiden Soeharto menyatakan berhenti dari jabatannya setelah 32 tahun memimpin Indonesia.",
  },
  {
    id: 35,
    tema: "Dinamika Akhir & Masa Transisi 1998",
    pertanyaan:
      "Sesuai Pasal 8 UUD 1945, siapakah Wakil Presiden yang langsung dilantik menggantikan Soeharto sebagai Presiden RI ke-3 pada 21 Mei 1998?",
    pilihan: [
      "Prof. Dr. Ing. B.J. Habibie",
      "Try Sutrisno",
      "Megawati Soekarnoputri",
      "Abdurrahman Wahid",
    ],
    jawabanBenar: 0,
    fakta:
      "Sesaat setelah Presiden Soeharto menyatakan berhenti pada 21 Mei 1998, Wakil Presiden B.J. Habibie mengucapkan sumpah jabatan sebagai Presiden RI ke-3.",
  },
  {
    id: 36,
    tema: "Dinamika Akhir & Masa Transisi 1998",
    pertanyaan:
      "Mundurnya Presiden Soeharto pada 21 Mei 1998 menandai berakhirnya masa pemerintahan Orde Baru dan dimulainya babak baru sejarah Indonesia, yaitu...",
    pilihan: [
      "Era Reformasi",
      "Era Demokrasi Terpimpin",
      "Era Demokrasi Parlementer",
      "Era Republik Indonesia Serikat",
    ],
    jawabanBenar: 0,
    fakta:
      "Tanggal 21 Mei 1998 menjadi tonggak peralihan sejarah Indonesia dari masa Orde Baru (1966–1998) menuju Era Reformasi yang membuka ruang demokrasi, kebebasan pers, dan otonomi daerah.",
  },
];
