import React from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#020817] via-[#06214a] to-[#020817] text-white font-sans overflow-x-hidden">
            {/* Navbar */}
            <nav className="w-full px-6 py-4 flex justify-between items-center border-b border-white/10 bg-[#020817]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <img src="/Logo3.png" alt="Mehfil Logo" className="h-10 w-10 object-contain" />
                    <span className="text-xl font-bold tracking-tight text-white">Mehfil</span>
                </div>
                <div className="flex gap-4">
                    <Link to="/auth">
                        <Button className="rounded-full bg-white hover:bg-gray-100 text-[#06214a] px-6 shadow-md transition-all hover:scale-105">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden min-h-[700px]">
                {/* Modern Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#06214a]/40 via-[#020817] to-[#020817] -z-10" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10"></div>

                {/* Floating Elements for "Life" */}
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"
                />
                <motion.div
                    animate={{ y: [0, 30, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
                />

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 max-w-5xl z-10 text-white drop-shadow-sm"
                >
                    Connect. Share.{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                        Belong.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl z-10"
                >
                    A calm space to connect and share with your community in real-time. Experience
                    the future of communication.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                    className="z-10"
                >
                    <Link to="/auth">
                        <Button
                            size="lg"
                            className="rounded-full text-lg px-10 py-7 bg-white text-[#06214a] hover:bg-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 font-bold"
                        >
                            Get Started Now
                        </Button>
                    </Link>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold text-center mb-20 tracking-tight text-white"
                    >
                        Why Choose Mehfil?
                    </motion.h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="group bg-white/5 backdrop-blur-lg p-10 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl hover:-translate-y-2"
                        >
                            <div className="h-14 w-14 bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Real-time Chat</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Experience seamless, instant messaging with friends and communities
                                without any lag.
                            </p>
                        </motion.div>
                        {/* Feature 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="group bg-white/5 backdrop-blur-lg p-10 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl hover:-translate-y-2"
                        >
                            <div className="h-14 w-14 bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 rounded-2xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Video Calls</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Crystal clear video and audio calls to keep you connected with your
                                loved ones anywhere.
                            </p>
                        </motion.div>
                        {/* Feature 3 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="group bg-white/5 backdrop-blur-lg p-10 border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl hover:-translate-y-2"
                        >
                            <div className="h-14 w-14 bg-green-500/20 text-green-400 flex items-center justify-center mb-6 rounded-2xl group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <svg
                                    className="w-7 h-7"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Secure & Private</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Your conversations are private and secure. We prioritize your data
                                privacy above all.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section - Draggable/Scrollable */}
            <section className="py-24 px-6 overflow-hidden">
                <div className="max-w-full mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold text-center mb-16 tracking-tight text-white"
                    >
                        Loved by Thousands
                    </motion.h2>

                    {/* Scroll Container */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-12 px-6 md:px-20 no-scrollbar cursor-grab active:cursor-grabbing">
                        {[
                            {
                                name: 'Sarah Ahmed',
                                role: 'Designer',
                                initial: 'SA',
                                text: "Mehfil has completely changed how I stay in touch with my family. The video quality is amazing and it's so easy to use!",
                            },
                            {
                                name: 'Rahul Verma',
                                role: 'Developer',
                                initial: 'RV',
                                text: "I love the simplicity of the interface. It's not cluttered like other apps. Just pure connection. Highly recommended.",
                            },
                            {
                                name: 'Emily Chen',
                                role: 'Product Manager',
                                initial: 'EC',
                                text: 'The best platform for our remote team standups. Zero latency and the UI is just gorgeous.',
                            },
                            {
                                name: 'Michael Brown',
                                role: 'Musician',
                                initial: 'MB',
                                text: 'Audio quality is top-notch for my jam sessions. I can hear every note clearly.',
                            },
                            {
                                name: 'Lisa Wang',
                                role: 'Student',
                                initial: 'LW',
                                text: 'Perfect for study groups. The whiteboard feature is a lifesaver during exam season.',
                            },
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="snap-center shrink-0 w-[350px] md:w-[450px] bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-xl border border-white/10 hover:shadow-2xl transition-all duration-300 select-none"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                        {testimonial.initial}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-blue-400 font-medium">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic text-lg leading-relaxed">
                                    "{testimonial.text}"
                                </p>
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-center text-gray-400 text-sm mt-4">
                        Swipe to see more stories
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#020817]/50 border-t border-white/10 text-white py-16 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <img src="/Logo3.png" alt="Mehfil Logo" className="h-10 w-10 opacity-90" />
                        <span className="text-2xl font-bold tracking-tight">Mehfil</span>
                    </div>
                    <div className="text-gray-400">
                        &copy; {new Date().getFullYear()} Mehfil. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-gray-400">
                        <a href="#" className="hover:text-white transition-colors hover:underline">
                            Privacy
                        </a>
                        <a href="#" className="hover:text-white transition-colors hover:underline">
                            Terms
                        </a>
                        <a href="#" className="hover:text-white transition-colors hover:underline">
                            Contact
                        </a>
                    </div>
                </div>
            </footer>

            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
