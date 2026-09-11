import { AudioTrack } from "./types";

export const RELAXING_AUDIO_TRACKS: AudioTrack[] = [
  // 1. Classical Masterpieces (Classic Best Curated 5 Tracks)
  {
    id: "classic-canon",
    title: "Pachelbel - Canon in D major (파헬벨 캐논 변주곡)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 명작 🎻",
    src: "/audio/classic-best/01-pachelbel-canon.mp3",
    duration: "6:23",
    icon: "Music"
  },
  {
    id: "classic-fur-elise",
    title: "Beethoven - Für Elise (베토벤 엘리제를 위하여)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 피아노 🎹",
    src: "/audio/classic-best/02-beethoven-fur-elise.mp3",
    duration: "3:49",
    icon: "Music"
  },
  {
    id: "classic-winter",
    title: "Vivaldi - Four Seasons 'Winter' 1st Mvt (비발디 사계 '겨울' 1악장)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 현악 🎻",
    src: "/audio/classic-best/03-vivaldi-winter-1st.mp3",
    duration: "3:44",
    icon: "Music"
  },
  {
    id: "classic-liebesfreud",
    title: "Kreisler - Liebesfreud (크라이슬러 사랑의 기쁨)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 바이올린 🎻",
    src: "/audio/classic-best/04-kreisler-liebesfreud.mp3",
    duration: "3:32",
    icon: "Music"
  },
  {
    id: "classic-thais",
    title: "Massenet - Méditation from Thaïs (마스네 타이스의 명상곡)",
    artist: "Classic Best Masterpiece",
    category: "classical",
    categoryLabel: "클래식 명상 🎻",
    src: "/audio/classic-best/05-massenet-meditation-thais.mp3",
    duration: "5:01",
    icon: "Music"
  },

  // 2. Parisian Chanson & Acoustic Cafe
  {
    id: "chanson-paris-breeze",
    title: "Breeze of Paris (Chanson Accordion Cafe)",
    artist: "French Acoustic Ensemble",
    category: "chanson",
    categoryLabel: "파리지앵 샹송 ☕",
    src: "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=french-accordion-chanson-122941.mp3",
    duration: "3:10",
    icon: "Coffee"
  },
  {
    id: "chanson-acoustic-romance",
    title: "Montmartre Sunset (Warm Acoustic Guitar)",
    artist: "Acoustic Paris Trio",
    category: "chanson",
    categoryLabel: "어쿠스틱 카페 🎸",
    src: "https://cdn.pixabay.com/download/audio/2023/04/18/audio_d46429f52a.mp3?filename=french-cafe-acoustic-146603.mp3",
    duration: "3:25",
    icon: "Coffee"
  },

  // 3. Deep Meditation & 528Hz Solfeggio Healing
  {
    id: "meditation-528hz-healing",
    title: "528Hz DNA Repair & Mind Serenity",
    artist: "Solfeggio Healing Soundscape",
    category: "meditation",
    categoryLabel: "528Hz 딥 명상 🧘",
    src: "https://cdn.pixabay.com/download/audio/2022/11/06/audio_c97693998b.mp3?filename=528hz-healing-meditation-125867.mp3",
    duration: "5:00",
    icon: "Sparkles"
  },
  {
    id: "meditation-tibetan-bowl",
    title: "Tibetan Singing Bowl & Zen Breath",
    artist: "Himalayan Zen Master",
    category: "meditation",
    categoryLabel: "싱잉볼 이완 🌿",
    src: "https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1e01.mp3?filename=tibetan-singing-bowl-meditation-10940.mp3",
    duration: "4:45",
    icon: "Sparkles"
  },

  // 4. Therapeutic Nature White Noise
  {
    id: "nature-forest-rain",
    title: "Healing Forest Rain & Gentle Stream",
    artist: "Nature Acoustics Bio-Lab",
    category: "nature",
    categoryLabel: "치유의 숲 빗소리 🌧️",
    src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-rain-ambient-111154.mp3",
    duration: "6:10",
    icon: "CloudRain"
  },
  {
    id: "nature-ocean-waves",
    title: "Peaceful Pacific Ocean Tide",
    artist: "Coastal Calming Sound",
    category: "nature",
    categoryLabel: "온화한 파도소리 🌊",
    src: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_82315b9468.mp3?filename=ocean-waves-ambient-8247.mp3",
    duration: "5:30",
    icon: "Waves"
  }
];
