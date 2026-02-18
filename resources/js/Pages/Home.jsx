import { useState, useEffect } from 'react'; // Tambah useEffect
import { Head, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ArrowUp } from 'lucide-react';

export default function Home({ quotes, moods, selectedMood }) {
    // 1. Local state untuk menampung semua quotes yang sudah di-load
    const [allQuotes, setAllQuotes] = useState(quotes.data);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Efek scroll halus
        });
    };

    // Reset quotes jika user ganti filter mood
    useEffect(() => {
        // Hanya reset jika ini halaman pertama (filter baru atau reload)
        // Jika current_page > 1, berarti ini hasil pagination/loadMore yang di-manage manual
        if (quotes.current_page === 1) {
            setAllQuotes(quotes.data);
        }
    }, [quotes.data]);

    // Handle mood selection
    const handleMoodSelect = (slug) => {
        const newMood = selectedMood === slug ? null : slug;

        router.get('/', { mood: newMood }, {
            preserveState: true,
            preserveScroll: true,
            only: ['quotes', 'selectedMood'],
        });
    };

    // 2. Fungsi untuk load data halaman berikutnya
    const loadMore = () => {
        if (!quotes.next_page_url || isLoading) return;

        setIsLoading(true);

        // Inertia visit secara internal (partial reload)
        router.get(quotes.next_page_url, { mood: selectedMood }, {
            preserveState: true,
            preserveScroll: true,
            only: ['quotes'],
            onSuccess: (page) => {
                // Gabungkan data lama dengan data baru yang baru datang
                setAllQuotes(prev => [...prev, ...page.props.quotes.data]);
                setIsLoading(false);
            },
            onError: () => {
                setIsLoading(false);
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    // 3. Unified Scroll Listener (Back to Top + Infinite Scroll)
    useEffect(() => {
        const handleScroll = () => {
            // Logic 1: Back to Top Button Visibility
            if (window.pageYOffset > 400) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }

            // Logic 2: Infinite Scroll Trigger
            // Gunakan buffer 100px sebelum mentok bawah
            // Gunakan document.documentElement.scrollHeight untuk total tinggi dokumen yang lebih akurat
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;

            if (windowHeight + scrollTop >= fullHeight - 100) {
                loadMore();
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Panggil sekali saat mount/update untuk cek apakah perlu load data (misal konten terlalu pendek)
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [quotes.next_page_url, isLoading, allQuotes]); // Tambahkan allQuotes agar dicek ulang saat data bertambah

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Head title="VibeQuote - How's your vibe today?" />

            <main className="max-w-4xl mx-auto px-4 py-12">

                {/* Header & Mood Selector */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-6">
                        How's your vibe today?
                    </h1>

                    <p className="text-sm text-gray-500 mb-6 font-medium">
                        Made by Norizna &copy; {new Date().getFullYear()} VibeQuote
                    </p>


                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {moods.map((mood) => {
                            const isSelected = selectedMood === mood.slug;
                            return (
                                <button
                                    key={mood.id}
                                    onClick={() => handleMoodSelect(mood.slug)}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm
                                        ${isSelected
                                            ? 'ring-4 ring-offset-2 scale-105'
                                            : 'hover:bg-gray-100 hover:scale-105 bg-white'
                                        }`}
                                    style={{
                                        backgroundColor: isSelected ? mood.color_hex : 'white',
                                        color: isSelected ? 'white' : '#374151',
                                        borderColor: isSelected ? mood.color_hex : '#E5E7EB',
                                        borderWidth: '1px'
                                    }}
                                >
                                    <span className="text-xl">{mood.emoji}</span>
                                    {mood.name}
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* Quotes Grid / List */}
                <section className="grid gap-6 md:grid-cols-2">
                    <AnimatePresence mode="popLayout">
                        {/* Ganti quotes.map menjadi allQuotes.map */}
                        {allQuotes.map((quote) => (
                            <motion.div
                                key={quote.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between"
                            >
                                <blockquote className="text-xl font-medium text-gray-800 mb-6 italic">
                                    "{quote.content}"
                                </blockquote>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-500">— {quote.author}</span>
                                    <Link href={`/studio/${quote.id}`} className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors">
                                        Create Post ✨
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </section>

                {/* Tombol Kembali ke Atas dengan Animasi Framer Motion */}
                <AnimatePresence>
                    {showTopBtn && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: 20 }}
                            onClick={scrollToTop}
                            className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
                            title="Kembali ke atas"
                        >
                            <ArrowUp className="w-6 h-6" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Loading Indicator */}
                {quotes.next_page_url && (
                    <div className="text-center mt-12 text-gray-400 animate-pulse">
                        Menarik quote lainnya...
                    </div>
                )}
            </main>
        </div>
    );
}