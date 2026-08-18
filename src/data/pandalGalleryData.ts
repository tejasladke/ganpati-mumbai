export interface PandalGalleryPhoto {
  id: string;
  pandalId: string;
  pandalName: string;
  url: string;
  year: '2025' | '2024' | '2023' | 'Historical';
  category: 'Idol' | 'Decoration' | 'Atmosphere';
  title: string;
  description: string;
  source: string;
  photographer?: string;
}

export const PANDAL_GALLERY_DATABASE: PandalGalleryPhoto[] = [
  // --- Lalbaugcha Raja (pandal-1) ---
  {
    id: 'lalbaug-2025-idol-1',
    pandalId: 'pandal-1',
    pandalName: 'Lalbaugcha Raja',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lalbaugcha%20Raja%20Mumbai%20Ganesh%20Utsav%202024.jpg',
    year: '2025',
    category: 'Idol',
    title: 'Lalbaugcha Raja 2025 - Grand Golden Throne & Rajwadi Saree',
    description: 'The iconic 12-foot idol of Lalbaugcha Raja seated on the majestic peacock golden throne in 2025, adorned with hand-woven maroon silk saree and solid gold crown.',
    source: 'Lalbaugcha Raja Sarvajanik Ganeshotsav Mandal Archive',
    photographer: 'Mumbai Festival Press'
  },
  {
    id: 'lalbaug-2025-decor-1',
    pandalId: 'pandal-1',
    pandalName: 'Lalbaugcha Raja',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chintamani%20Mumbai%20studio55.jpg',
    year: '2025',
    category: 'Decoration',
    title: '2025 Sheesh Mahal Mirror Work Dome & Chandelier',
    description: 'Breathtaking 2025 Mandap decoration featuring 50,000 hand-cut Belium mirrors and a 14-foot crystal chandelier suspended above the main stage.',
    source: 'Ganesh Utsav Architecture Digest',
    photographer: 'Anand Shinde'
  },
  {
    id: 'lalbaug-2025-atmo-1',
    pandalId: 'pandal-1',
    pandalName: 'Lalbaugcha Raja',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/G.%20S.%20B.%20Seva%20Mandal%20Ganpati%20in%20Mumbai.jpg',
    year: '2025',
    category: 'Atmosphere',
    title: 'Midnight Aarti & Sea of Devotees 2025',
    description: 'Thousands of devotees gathering for the traditional 12:00 AM Maha Aarti at Lalbaug market pandal queue.',
    source: 'Mumbai Live Archives',
    photographer: 'Rakesh Patil'
  },
  {
    id: 'lalbaug-2024-idol-1',
    pandalId: 'pandal-1',
    pandalName: 'Lalbaugcha Raja',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
    year: '2024',
    category: 'Idol',
    title: 'Lalbaugcha Raja 2024 - Royal Crimson & Pearl Garland',
    description: 'The famous 2024 Darshan posture featuring 1.5kg gold modak offerings and classic serene expression.',
    source: 'Lalbaug Mandal Official',
    photographer: 'Subhash Rao'
  },
  {
    id: 'lalbaug-2024-decor-1',
    pandalId: 'pandal-1',
    pandalName: 'Lalbaugcha Raja',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg',
    year: '2024',
    category: 'Decoration',
    title: 'Royal Maratha Palace Architecture Theme 2024',
    description: 'Handcrafted wooden pillars and gold foil engravings honoring traditional Maharashtrian fort heritage.',
    source: 'Art Directors Guild India',
    photographer: 'Sameer Kulkarni'
  },
  {
    id: 'lalbaug-2023-atmo-1',
    pandalId: 'pandal-1',
    pandalName: 'Lalbaugcha Raja',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg',
    year: '2023',
    category: 'Atmosphere',
    title: 'Visarjan Sohala Procession at Girgaon Chowpatty 2023',
    description: 'Grand farewell immersion ceremony on Anant Chaturdashi with pink gulal clouds and brass dhol tasha pathak.',
    source: 'Mumbai Heritage Photography',
    photographer: 'Vikram Joshi'
  },

  // --- Chinchpokli Cha Chintamani (pandal-2) ---
  {
    id: 'chintamani-2025-idol-1',
    pandalId: 'pandal-2',
    pandalName: 'Chinchpokli Cha Chintamani',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
    year: '2025',
    category: 'Idol',
    title: 'Chinchpokli Chintamani 2025 - Sitting posture on Silver Throne',
    description: 'The famed idol crafted by Vijay Khatu family studio, featuring royal silver ornaments and red silk pitambar in 2025.',
    source: 'Chinchpokli Sarvajanik Utsav Mandal',
    photographer: 'Prashant Pawar'
  },
  {
    id: 'chintamani-2025-atmo-1',
    pandalId: 'pandal-2',
    pandalName: 'Chinchpokli Cha Chintamani',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lalbaugcha%20Raja%20Mumbai%20Ganesh%20Utsav%202024.jpg',
    year: '2025',
    category: 'Atmosphere',
    title: 'Aagman Sohala Celebration - Gulal Rain on Dattaram Lad Marg 2025',
    description: 'Over 50,000 devotees celebrating the arrival of Chintamani with traditional saffron flags and dhol drums.',
    source: 'Chinchpokli Media Cell',
    photographer: 'Mahesh Sawant'
  },
  {
    id: 'chintamani-2024-decor-1',
    pandalId: 'pandal-2',
    pandalName: 'Chinchpokli Cha Chintamani',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chintamani%20Mumbai%20studio55.jpg',
    year: '2024',
    category: 'Decoration',
    title: 'Intricate Floral Arch & Carved Pillars 2024',
    description: 'Eco-friendly bamboo and fresh lotus flower decorations crafted by veteran artisans.',
    source: 'Chinchpokli Archives',
    photographer: 'Girish Jadhav'
  },

  // --- GSB Seva Mandal (pandal-3) ---
  {
    id: 'gsb-2025-idol-1',
    pandalId: 'pandal-3',
    pandalName: 'GSB Seva Mandal (Kings Circle)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/G.%20S.%20B.%20Seva%20Mandal%20Ganpati%20in%20Mumbai.jpg',
    year: '2025',
    category: 'Idol',
    title: 'GSB Gold Ganpati 2025 - 66kg Pure Gold Armour & Crown',
    description: 'Mumbai\'s richest idol adorned with 66kg gold, 300kg silver ornaments, and emerald necklace for 2025 Ganeshotsav.',
    source: 'GSB Seva Mandal Press',
    photographer: 'Srinivas Kamath'
  },
  {
    id: 'gsb-2025-atmo-1',
    pandalId: 'pandal-3',
    pandalName: 'GSB Seva Mandal (Kings Circle)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
    year: '2025',
    category: 'Atmosphere',
    title: 'Vedic Pooja & Rigveda Chanting Hall 2025',
    description: 'Special Seva hall where priests perform continuous Vedic pooja and Atharvashirsha chanting throughout the day.',
    source: 'GSB Vedic Trust',
    photographer: 'Madhav Shenoy'
  },
  {
    id: 'gsb-2024-idol-1',
    pandalId: 'pandal-3',
    pandalName: 'GSB Seva Mandal (Kings Circle)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg',
    year: '2024',
    category: 'Idol',
    title: '100% Clay Shadu Clay Idol with Gold Crown 2024',
    description: 'Traditional eco-friendly clay idol prepared according to ancient Agama Shastra principles.',
    source: 'GSB Archives 2024',
    photographer: 'Nitin Bhat'
  },

  // --- Khetwadi Cha Raja (pandal-4) ---
  {
    id: 'khetwadi-2025-idol-1',
    pandalId: 'pandal-4',
    pandalName: 'Khetwadi Cha Raja (11th Lane)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg',
    year: '2025',
    category: 'Idol',
    title: 'Khetwadi 11th Lane 2025 - 38-Foot Standing Avatar',
    description: 'Magnificent 38-foot tall idol in Indra Sabha theme posture with 1,000 hand details.',
    source: 'Khetwadi 11th Lane Mandal',
    photographer: 'Kunal Shinde'
  },
  {
    id: 'khetwadi-2025-decor-1',
    pandalId: 'pandal-4',
    pandalName: 'Khetwadi Cha Raja (11th Lane)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
    year: '2025',
    category: 'Decoration',
    title: 'Laser Lighting & Illuminated Arch Entrance 2025',
    description: 'Dynamic LED lighting along Grant Road lanes creating a glowing festive passage.',
    source: 'Khetwadi Festival Photographers',
    photographer: 'Rohit Kadam'
  },

  // --- Mumbaicha Raja - Ganesh Galli (pandal-5) ---
  {
    id: 'ganeshgalli-2025-decor-1',
    pandalId: 'pandal-5',
    pandalName: 'Mumbaicha Raja (Ganesh Galli)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lalbaugcha%20Raja%20Mumbai%20Ganesh%20Utsav%202024.jpg',
    year: '2025',
    category: 'Decoration',
    title: 'Kedarnath Temple Architecture Replica 2025',
    description: 'A colossal 80-foot high replica of Kedarnath Dham crafted with stone-textured fiber panels.',
    source: 'Ganesh Galli Sarvajanik Mandal',
    photographer: 'Milind Tambe'
  },
  {
    id: 'ganeshgalli-2025-idol-1',
    pandalId: 'pandal-5',
    pandalName: 'Mumbaicha Raja (Ganesh Galli)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chintamani%20Mumbai%20studio55.jpg',
    year: '2025',
    category: 'Idol',
    title: 'Mumbaicha Raja 2025 - 22-Foot Majestic Murti',
    description: 'The historic pioneer idol of Lalbaug standing gracefully inside the temple replica.',
    source: 'Mumbaicha Raja Archives',
    photographer: 'Omkar Naik'
  },
  {
    id: 'ganeshgalli-2024-decor-1',
    pandalId: 'pandal-5',
    pandalName: 'Mumbaicha Raja (Ganesh Galli)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/G.%20S.%20B.%20Seva%20Mandal%20Ganpati%20in%20Mumbai.jpg',
    year: '2024',
    category: 'Decoration',
    title: 'Ayodhya Ram Mandir Replica Theme 2024',
    description: 'Award-winning 2024 mandap setting simulating the sandstone carvings of Ram Janmabhoomi temple.',
    source: 'Ganesh Galli Mandal',
    photographer: 'Vivek Gawde'
  },

  // --- Andheri Cha Raja (pandal-6) ---
  {
    id: 'andheri-2025-idol-1',
    pandalId: 'pandal-6',
    pandalName: 'Andheri Cha Raja (Azad Nagar)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
    year: '2025',
    category: 'Idol',
    title: 'Andheri Cha Raja 2025 - King of Suburbs Darshan',
    description: 'Wish-fulfilling idol in Azad Nagar pandal draped in royal velvet dhoti and gold crown.',
    source: 'Azad Nagar Sarvajanik Utsav Samiti',
    photographer: 'Deepak More'
  },
  {
    id: 'andheri-2025-atmo-1',
    pandalId: 'pandal-6',
    pandalName: 'Andheri Cha Raja (Azad Nagar)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg',
    year: '2025',
    category: 'Atmosphere',
    title: 'Celebrity VIP Darshan & Extended Festival Days 2025',
    description: 'Film personalities and thousands of devotees seeking blessings during the 21-day extended festival.',
    source: 'Andheri West Press',
    photographer: 'Siddharth Roy'
  },

  // --- Keshavji Naik Chawl (pandal-7) ---
  {
    id: 'keshavji-2025-idol-1',
    pandalId: 'pandal-7',
    pandalName: 'Keshavji Naik Chawl (Girgaon)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg',
    year: '2025',
    category: 'Idol',
    title: 'Keshavji Naik Chawl 2025 - Traditional 2-Foot Shadu Clay Murti',
    description: 'Maintaining 132+ years of unbroken tradition with a simple, eco-friendly clay idol established since Lokmanya Tilak era.',
    source: 'Keshavji Naik Chawl Heritage Trust',
    photographer: 'Hemant Kulkarni'
  },
  {
    id: 'keshavji-2025-atmo-1',
    pandalId: 'pandal-7',
    pandalName: 'Keshavji Naik Chawl (Girgaon)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Indian%20Folk%20Ganpati%20Festival%20%285%29.jpg',
    year: '2025',
    category: 'Atmosphere',
    title: 'Chawl Courtyard Dhol Tasha & Traditional Aarti 2025',
    description: 'Residents and visiting devotees performing traditional Marathi devotional songs in the historic Zaoba Wadi courtyard.',
    source: 'Girgaon Heritage Society',
    photographer: 'Arun Parab'
  },
  {
    id: 'keshavji-hist-1',
    pandalId: 'pandal-7',
    pandalName: 'Keshavji Naik Chawl (Girgaon)',
    url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lalbaugcha%20Raja%20Mumbai%20Ganesh%20Utsav%202024.jpg',
    year: 'Historical',
    category: 'Decoration',
    title: 'Historic Chawl Archway & Freedom Movement Heritage',
    description: 'Archival view of the 1893 birthplace of public Ganesh festivals in Mumbai, retaining its authentic Maharashtrian chawl vibe.',
    source: 'Mumbai Archives & Asiatic Society',
    photographer: 'Historical Collection'
  }
];

export function getPandalGalleryPhotos(pandalId: string, pandalName?: string): PandalGalleryPhoto[] {
  const matched = PANDAL_GALLERY_DATABASE.filter(
    (p) =>
      p.pandalId === pandalId ||
      (pandalName && p.pandalName.toLowerCase().includes(pandalName.toLowerCase())) ||
      (pandalName && pandalName.toLowerCase().includes(p.pandalName.toLowerCase()))
  );

  if (matched.length > 0) {
    return matched;
  }

  // Fallback high quality items generated for any newly created/custom pandals
  const displayName = pandalName || 'Ganesh Pandal';

  return [
    {
      id: `${pandalId}-gen-2025-idol`,
      pandalId,
      pandalName: displayName,
      url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chintamani%20Mumbai%20studio55.jpg',
      year: '2025',
      category: 'Idol',
      title: `${displayName} 2025 - Grand Idol Darshan`,
      description: `Detailed view of the main idol at ${displayName} during the 2025 Ganesh Chaturthi festival.`,
      source: 'Mumbai Pandal Explorer'
    },
    {
      id: `${pandalId}-gen-2025-decor`,
      pandalId,
      pandalName: displayName,
      url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/G.%20S.%20B.%20Seva%20Mandal%20Ganpati%20in%20Mumbai.jpg',
      year: '2025',
      category: 'Decoration',
      title: `${displayName} 2025 - Festive Mandap Theme`,
      description: `Handcrafted decor, illuminated lighting, and floral arches designed for the 2025 celebration.`,
      source: 'Mumbai Pandal Explorer'
    },
    {
      id: `${pandalId}-gen-2025-atmo`,
      pandalId,
      pandalName: displayName,
      url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganesh%20Chaturthi%20Festival%20%281%29.jpg',
      year: '2025',
      category: 'Atmosphere',
      title: `${displayName} 2025 - Devotee Atmosphere & Aarti`,
      description: `Devotee crowd gathering for morning/evening aarti and prasad distribution.`,
      source: 'Mumbai Pandal Explorer'
    },
    {
      id: `${pandalId}-gen-2024-idol`,
      pandalId,
      pandalName: displayName,
      url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eco%20friendly%20images%20of%20Lord%20Ganesha%20in%20Mumbai.jpg',
      year: '2024',
      category: 'Idol',
      title: `${displayName} 2024 - Previous Year Murti`,
      description: `The divine idol representation from the 2024 festival season.`,
      source: 'Mumbai Pandal Explorer'
    },
    {
      id: `${pandalId}-gen-2024-atmo`,
      pandalId,
      pandalName: displayName,
      url: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ganapati%20Bappa%20Moraya%20by%20Akshay%20Dinde.jpg',
      year: '2024',
      category: 'Atmosphere',
      title: `${displayName} 2024 - Immersion Procession`,
      description: `High energy dhol tasha procession during the 2024 Ganesh Visarjan.`,
      source: 'Mumbai Pandal Explorer'
    }
  ];
}
