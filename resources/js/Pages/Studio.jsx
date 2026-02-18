import { useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { toPng } from 'html-to-image';
import { Download, ArrowLeft, Image as ImageIcon, Palette, Type, Loader2 } from 'lucide-react';

export default function Studio({ quote }) {
    const cardRef = useRef(null);

    // States
    const [aspectRatio, setAspectRatio] = useState('aspect-square');
    const [background, setBackground] = useState('bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500');

    // State Tipografi & Loading
    const [fontStyle, setFontStyle] = useState('font-sans');
    const [isFetchingBg, setIsFetchingBg] = useState(false);

    const handleDownload = async () => {
        if (cardRef.current === null) return;
        try {
            const dataUrl = await toPng(cardRef.current, {
                pixelRatio: 2,
                skipFonts: true
            });
            const link = document.createElement('a');
            link.download = `vibequote-${quote.id}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Gagal memproses gambar:', err);
            alert(`Gagal Export: ${err.message}`);
        }
    };

    // Fungsi Baru: 100% Gratis menggunakan Picsum Photos (Jauh lebih estetik)
    const fetchFreeRandomImage = () => {
        setIsFetchingBg(true);

        // Menggunakan Picsum Photos. Dijamin resolusi tinggi dan estetik (kebanyakan pemandangan/alam)
        const randomId = Math.floor(Math.random() * 1000);

        // Opsi Clean Code: Kita tambahkan parameter random agar browser tidak men-cache gambar yang sama
        const imageUrl = `https://picsum.photos/seed/${randomId}/1080/1080`;

        // Preload gambar di memori browser
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
            setBackground(`url(${imageUrl})`);
            setIsFetchingBg(false);
        };

        img.onerror = () => {
            alert("Gagal memuat gambar gratis. Coba lagi.");
            setIsFetchingBg(false);
        };
    };

    const setGradient = (classes) => setBackground(classes);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            <Head title="VibeQuote Studio" />

            {/* Sidebar Controls */}
            <aside className="w-full md:w-80 bg-white p-6 shadow-lg z-10 flex flex-col gap-8 h-auto md:h-screen overflow-y-auto">
                <div>
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900">The Studio</h2>
                    <p className="text-sm text-gray-500 mt-1">Kustomisasi kutipanmu.</p>
                </div>

                {/* Kontrol Format Kanvas */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Palette className="w-4 h-4" /> Format Kanvas
                    </label>
                    <div className="flex gap-2">
                        <button onClick={() => setAspectRatio('aspect-square')} className={`flex-1 py-2 text-sm font-medium border rounded-lg ${aspectRatio === 'aspect-square' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>IG Feed</button>
                        <button onClick={() => setAspectRatio('aspect-[9/16]')} className={`flex-1 py-2 text-sm font-medium border rounded-lg ${aspectRatio === 'aspect-[9/16]' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>IG Story</button>
                    </div>
                </div>

                {/* Kontrol Tipografi */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Type className="w-4 h-4" /> Tipografi
                    </label>
                    <div className="flex gap-2">
                        <button onClick={() => setFontStyle('font-sans')} className={`flex-1 py-2 text-sm font-sans border rounded-lg ${fontStyle === 'font-sans' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Modern</button>
                        <button onClick={() => setFontStyle('font-serif')} className={`flex-1 py-2 text-sm font-serif border rounded-lg ${fontStyle === 'font-serif' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Puitis</button>
                        <button onClick={() => setFontStyle('font-mono')} className={`flex-1 py-2 text-sm font-mono border rounded-lg ${fontStyle === 'font-mono' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Klasik</button>
                    </div>
                </div>

                {/* Kontrol Background */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Background
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                        <button onClick={() => setGradient('bg-gray-900')} className="w-full aspect-square rounded-md bg-gray-900 ring-2 ring-offset-1 ring-transparent hover:ring-gray-400"></button>
                        <button onClick={() => setGradient('bg-gradient-to-r from-cyan-500 to-blue-500')} className="w-full aspect-square rounded-md bg-gradient-to-r from-cyan-500 to-blue-500"></button>
                        <button onClick={() => setGradient('bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500')} className="w-full aspect-square rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"></button>

                        {/* Tombol Random Image (Gratis) */}
                        <button
                            onClick={fetchFreeRandomImage}
                            disabled={isFetchingBg}
                            className="w-full aspect-square rounded-md bg-gray-100 flex items-center justify-center border border-dashed border-gray-300 hover:bg-gray-200 disabled:opacity-50 transition-all"
                            title="Random Free Image"
                        >
                            {isFetchingBg ? <Loader2 className="w-5 h-5 animate-spin text-gray-500" /> : '✨'}
                        </button>
                    </div>
                </div>

                {/* Download Button */}
                <div className="mt-auto pt-6 border-t">
                    <button
                        onClick={handleDownload}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                        <Download className="w-5 h-5" /> Export Image
                    </button>
                </div>
            </aside>

            {/* Canvas Area */}
            <main className="flex-1 flex items-center justify-center p-8 bg-gray-200 overflow-hidden">
                <div
                    ref={cardRef}
                    className={`relative flex flex-col justify-center items-center text-center p-12 transition-all duration-500 w-full max-w-md shadow-2xl overflow-hidden ${aspectRatio} ${background.startsWith('bg-') ? background : 'bg-cover bg-center'}`}
                    style={background.startsWith('url') ? { backgroundImage: background } : {}}
                >
                    {background.startsWith('url') && <div className="absolute inset-0 bg-black/50"></div>}

                    <div className={`relative z-10 text-white w-full ${fontStyle}`}>
                        <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight drop-shadow-md">
                            "{quote.content}"
                        </h1>
                        <p className="text-lg font-medium opacity-90 tracking-wide drop-shadow-md">
                            — {quote.author || 'Anonim'}
                        </p>
                    </div>

                    <div className="absolute bottom-6 left-0 right-0 text-center z-10">
                        <span className={`text-white/70 text-sm font-semibold tracking-widest uppercase ${fontStyle}`}>
                            VibeQuote
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
}