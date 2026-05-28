/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, MapPin, Copy, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import floralBg from './assets/images/floral_wedding_background_1779948377135.png';

const FloralBackground = () => (
  <>
    <div 
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        backgroundImage: `url(${floralBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    />
    <div className="absolute inset-0 z-0 bg-white/60 pointer-events-none" />
  </>
);

const Separator = () => (
  <div className="flex flex-row items-center justify-center my-4 opacity-70">
    <div className="h-px bg-rose w-8"></div>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-rose)" className="mx-2 shrink-0">
      <path d="M12 2L4 12l8 10 8-10z"/>
    </svg>
    <div className="h-px bg-rose w-8"></div>
  </div>
);

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ Hari: 0, Jam: 0, Min: 0, Det: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const distance = new Date(targetDate).getTime() - new Date().getTime();
      if (distance < 0) {
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        Hari: Math.floor(distance / (1000 * 60 * 60 * 24)),
        Jam: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        Min: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        Det: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 w-full mt-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="bg-blush rounded-lg p-2 text-center flex flex-col justify-center">
          <span className="text-xl md:text-2xl font-black text-rose leading-none">{value.toString().padStart(2, '0')}</span>
          <span className="text-[10px] uppercase text-dusty tracking-wider mt-1">{unit}</span>
        </div>
      ))}
    </div>
  );
};

const generateCalendarLink = (title: string, dateStr: string, location: string) => {
  const startDate = "20260626T080000Z";
  const endDate = "20260626T110000Z";
  const details = encodeURIComponent(`Acara ${title} Usman & Dinda`);
  const loc = encodeURIComponent(location);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${details}&location=${loc}`;
};

function RekeningCard({ bank, noRek, name }: { bank: string; noRek: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(noRek);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-center flex flex-col items-center">
      <p className="text-[12px] font-bold text-[#4A2D3A] uppercase">{bank}</p>
      <div className="flex items-center gap-2 justify-center my-1 text-[#4A2D3A]">
        <p className="text-sm font-bold tracking-widest translate-y-[1px]">
          {show ? noRek : noRek.replace(/./g, '•')}
        </p>
        <button 
          onClick={() => setShow(!show)} 
          className="text-gray-400 hover:text-rose cursor-pointer flex-shrink-0"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
      <p className="text-[10px] text-[#9B6E82] mb-2">{name}</p>
      
      <button 
        onClick={handleCopy}
        className="flex items-center justify-center gap-1 px-3 py-1 border border-rose text-rose rounded text-[10px] hover:bg-rose hover:text-white transition-colors"
      >
        {copied ? (
          <>
            <CheckCircle2 size={12} />
            Disalin
          </>
        ) : (
          <>
            <Copy size={12} />
            Salin
          </>
        )}
      </button>
    </div>
  );
}

function AddressCard({ address, name }: { address: string; name: string }) {
  const [copied, setCopied] = useState(false);
  const fullAddress = `${address} (Atas Nama: ${name})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/50 rounded-xl p-4 border border-rose/30 max-w-xs mx-auto w-full text-center">
      <div className="flex justify-center mb-2">
        <MapPin size={18} className="text-rose" />
      </div>
      <p className="text-xs font-bold text-[#4A2D3A] mb-1">Alamat Pengiriman</p>
      <p className="text-[10px] text-[#9B6E82] mb-3 leading-relaxed">
        {address}<br/>
        (Atas Nama: {name})
      </p>
      <button 
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-rose text-rose rounded text-[10px] hover:bg-rose hover:text-white transition-colors cursor-pointer"
      >
        {copied ? (
          <>
            <CheckCircle2 size={12} />
            Disalin
          </>
        ) : (
          <>
            <Copy size={12} />
            Salin Alamat
          </>
        )}
      </button>
    </div>
  );
}

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoScrollInterval = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  
  const searchParams = new window.URLSearchParams(window.location.search);
  const guestParam = searchParams.get('to');
  const guestName = guestParam ? guestParam.replace(/-/g, ' ') : null;

  const startAutoScroll = () => {
    autoScrollInterval.current = window.setInterval(() => {
      // On desktop, scroll the right container. On mobile, scroll the main view.
      if (window.innerWidth >= 768 && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += 1;
      } else if (mainRef.current) {
        mainRef.current.scrollTop += 1;
      }
    }, 24);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  };

  useEffect(() => {
    const handleUserInteraction = () => {
      stopAutoScroll();
    };

    const container = mainRef.current;
    const scrollContainer = scrollContainerRef.current;
    
    if (container) {
      container.addEventListener('wheel', handleUserInteraction, { passive: true });
      container.addEventListener('touchstart', handleUserInteraction, { passive: true });
    }
    if (scrollContainer) {
      scrollContainer.addEventListener('wheel', handleUserInteraction, { passive: true });
      scrollContainer.addEventListener('touchstart', handleUserInteraction, { passive: true });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleUserInteraction);
        container.removeEventListener('touchstart', handleUserInteraction);
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener('wheel', handleUserInteraction);
        scrollContainer.removeEventListener('touchstart', handleUserInteraction);
      }
      stopAutoScroll();
    };
  }, []);

  const handleOpen = () => {
    setIsOpening(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio autoplay blocked', e));
      setIsPlaying(true);
    }
    setTimeout(() => {
      setIsOpened(true);
      setTimeout(() => {
        if (window.innerWidth < 768 && mainRef.current) {
          // on mobile, jump scroll to top since hero is hidden
          mainRef.current.scrollTo(0, 0);
        }
        setTimeout(() => {
          startAutoScroll();
        }, 2000);
      }, 100);
    }, 1000);
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Play blocked', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const audioUrl = "https://raw.githubusercontent.com/anantawidy/wedding-music/main/YTDown_YouTube_NUCA-MASA-INI-NANTI-DAN-MASA-INDAH-LAINN_Media_xnrFiwjyr-o_009_128k.mp3"; 

  return (
    <div 
      ref={mainRef} 
      className={`h-[100dvh] w-full bg-white font-sans text-gray-700 selection:bg-rose selection:text-white flex flex-col md:flex-row relative ${isOpened ? 'overflow-y-auto' : 'overflow-hidden'} md:overflow-hidden`}
    >
      <audio ref={audioRef} loop src={audioUrl} />

      {/* Floating Audio Button */}
      {isOpened && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-rose text-white rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform flex items-center justify-center cursor-pointer"
        >
          {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      )}

      {/* HERO SECTION / SIDEBAR */}
      <section className={`relative h-[100dvh] w-full md:w-[380px] shrink-0 flex-col items-center justify-center p-8 text-center bg-blush md:border-r border-rose overflow-hidden ${isOpened ? 'hidden' : 'flex'}`}>
        <FloralBackground />
        
        <div className="relative z-10 flex flex-col items-center w-full">
          <p className="text-xs tracking-widest text-rose uppercase mb-2 font-bold bg-white/70 px-3 py-1 rounded-full">The Wedding of</p>
          
          <h1 className="font-serif font-bold italic text-rose my-2 leading-tight text-5xl md:text-6xl drop-shadow-sm">
            Danty &<br/>Usman
          </h1>
          
          <Separator />
          
          <p className="text-sm font-bold tracking-[0.2em] mb-6 text-[#C48FAA] bg-white/70 px-4 py-1 rounded-full">26 . 06 . 2026</p>
          
          {guestName && (
            <div className="mb-6 w-full max-w-xs mx-auto bg-white/60 p-4 rounded-xl border border-white/50 backdrop-blur-sm">
              <p className="font-serif text-xs opacity-80 mb-1 italic text-gray-700">Specially invited for:</p>
              <p className="text-lg font-bold capitalize text-gray-900">{guestName}</p>
            </div>
          )}
          
          {!isOpened && (
            <button 
              onClick={handleOpen}
              disabled={isOpening}
              className={`px-8 py-3 bg-rose text-white rounded-full tracking-wide text-sm font-bold hover:scale-105 hover:bg-dusty transition-all shadow-[0_4px_10px_rgba(40,0,0,0.2)] mt-4 flex items-center justify-center gap-2 cursor-pointer ${isOpening ? 'opacity-50 pointer-events-none' : ''}`}
            >
              {isOpening ? (
                <>Membuka...</>
              ) : (
                <><Volume2 size={16} /> Buka Undangan</>
              )}
            </button>
          )}

          <p className="text-[10px] text-white bg-rose/60 px-3 py-1 rounded-full mt-12 tracking-widest font-semibold backdrop-blur-sm">#SuperMANforDANTY</p>
        </div>
      </section>

      {/* CONTENT AREA */}
      {isOpened && (
        <div 
          ref={scrollContainerRef}
          id="content-area"
          className="flex-1 min-h-[100dvh] h-auto md:h-screen md:overflow-y-auto bg-white p-6 md:p-10 animate-fade-in relative z-10 w-full"
        >
          <div className="relative h-full max-w-3xl mx-auto">
            <div className="fixed inset-0 md:absolute md:inset-0 z-0">
               <FloralBackground />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 relative z-10 pb-20 pt-4">
              
              {/* SECTION: QUOTE */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl md:col-span-2 text-center flex flex-col items-center justify-center">
                <p className="font-serif text-lg italic text-[#4A2D3A] leading-relaxed">
                  "Dan Kami jadikan kamu berpasang-pasangan"
                </p>
                <p className="text-[10px] text-[#9B6E82] italic mt-1 font-bold">An-Naba 78:8</p>
                <Separator />
                <p className="text-xs text-gray-600 leading-relaxed px-4">
                  Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.
                </p>
                <p className="text-[10px] mt-3 font-bold opacity-60 uppercase text-gray-500">
                  (QS. Ar-Rum: 21)
                </p>
              </div>

              {/* SECTION: COUNTDOWN */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center">
                <h3 className="font-serif text-xl mb-2 text-rose">Menuju Hari Istimewa</h3>
                <Countdown targetDate="2026-06-26T15:00:00" />
              </div>

              {/* SECTION: BRIDE & GROOM */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl flex flex-col justify-center">
                <h3 className="font-serif text-xl mb-4 text-rose text-center">Mempelai</h3>
                <div className="mb-4 text-center">
                  <p className="font-bold text-sm text-[#4A2D3A]">Stefyana Dinda Pramadanty</p>
                  <p className="text-[10px] text-[#9B6E82] mt-1 leading-snug">Putri dari Alm. Winky Septyagraha<br/>& Ibu Agustina Mardiana</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm text-[#4A2D3A]">Usman Ohoiwuy</p>
                  <p className="text-[10px] text-[#9B6E82] mt-1 leading-snug">Putra dari Alm. Fitra Ohoiwuy<br/>& Ibu Aliya Raharusun</p>
                </div>
              </div>

              {/* SECTION: AKAD */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl md:col-span-2 flex flex-col items-center text-center justify-center">
                <h4 className="font-bold text-rose text-sm mb-3 uppercase tracking-wide">Akad Nikah</h4>
                <p className="text-xs font-bold text-[#4A2D3A]">Jum'at, 26 Juni 2026</p>
                <p className="text-[10px] my-1 text-[#9B6E82]">15.00 - 18.00 WIB</p>
                <p className="text-[10px] italic leading-tight mb-4 text-[#9B6E82]">Saung Apung Villa Nusa Indah, Kec. Gunung Putri, Kab. Bogor</p>
                <a 
                  href={generateCalendarLink("Akad Nikah", "2026-06-26T15:00:00", "Saung Apung Villa Nusa Indah")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] border border-rose bg-white px-4 py-2 rounded text-rose hover:bg-rose hover:text-white transition-colors"
                >
                  Simpan Kalender
                </a>
              </div>

              {/* SECTION: PETA LOKASI */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl md:col-span-2 flex flex-col items-center">
                <h3 className="font-serif text-xl mb-3 text-rose">Lokasi Acara</h3>
                <p className="text-xs mb-4 text-gray-600 text-center">
                  Saung Apung Villa Nusa Indah<br/>
                  Kec. Gunung Putri, Kab. Bogor 16969
                </p>
                <div className="w-full h-48 md:h-64 rounded-xl shadow-sm bg-gray-100 overflow-hidden border border-blush mb-4">
                  <iframe 
                    src="https://maps.google.com/maps?q=Saung%20Apung%20Villa%20Nusa%20Indah,%20Bogor&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi Acara"
                  />
                </div>
                <a 
                  href="https://maps.app.goo.gl/ef9vPRthrwXakDiT6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-rose text-rose rounded text-[10px] hover:bg-rose hover:text-white transition-colors"
                >
                  <MapPin size={14} />
                  Buka di Google Maps
                </a>
              </div>

              {/* SECTION: WEDDING GIFT */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 shadow-xl md:col-span-2 text-center pb-8">
                <h3 className="font-serif text-xl mb-4 text-rose">Love Gift</h3>
                <p className="text-xs text-[#9B6E82] mb-6 max-w-xl mx-auto">
                  Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless atau mengirimkan kado fisik ke alamat berikut.
                </p>
                <div className="flex flex-row justify-around items-center flex-wrap gap-8 mb-8">
                  <RekeningCard 
                    bank="BCA" 
                    noRek="5725492275" 
                    name="Stefyana Dinda P." 
                  />
                  <RekeningCard 
                    bank="BRI" 
                    noRek="028101007928534" 
                    name="Usman Ohoiwuy" 
                  />
                </div>
                <AddressCard 
                  address="Villa Nusa Indah 2 Blok W21/17" 
                  name="Danty/Usman" 
                />
              </div>
              
              {/* FOOTER */}
              <footer className="md:col-span-2 text-center py-8">
                <Separator />
                <p className="font-serif italic text-2xl font-bold text-rose mb-1">Danty & Usman</p>
                <p className="text-[10px] text-[#9B6E82] tracking-widest uppercase font-bold mb-4">Thank you</p>
                <p className="text-[10px] text-rose tracking-widest font-semibold backdrop-blur-sm">#SuperMANforDANTY</p>
              </footer>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}


