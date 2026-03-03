import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ChevronRight, MapPin, Phone, GraduationCap, Briefcase, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div;
const MotionButton = motion.button;

const WELCOME_MESSAGE = "Namaste! Welcome to MentriQ Technologies. I can help with courses, training, contact, and quick guidance.";

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, type: 'bot', text: WELCOME_MESSAGE }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showOptions, setShowOptions] = useState(true);
    const chatEndRef = useRef(null);
    const nextMessageId = useRef(2);

    const initialOptions = [
        { id: 'path', label: 'Where to go?', icon: MapPin },
        { id: 'contact', label: 'Whom to contact?', icon: Phone },
        { id: 'faq', label: 'Common Questions', icon: MessageCircle }
    ];

    const faqOptions = [
        { q: 'Do you provide placements?', a: 'Yes! We have a dedicated placement cell and strong partnerships with leading industry giants. We provide 100% placement assistance.' },
        { q: 'What technologies do you teach?', a: 'We specialize in Full Stack Development (MERN), AI/ML, Data Science, and DevOps using industry-standard tools.' },
        { q: 'Is there a student handbook?', a: 'Yes, you can find the student handbook in the footer under the Support section.' },
        { q: 'Where are you located?', a: 'Our office is located at Mentriq Technologies, 2nd floor, 34/501, Haldighati Marg E, Sector 3, Pratap Nagar, Sanganer, Jaipur, 302033. You can find the exact map on our Contact page.' }
    ];

    const contactOptions = [
        { label: 'WhatsApp Support', value: '+91 8890301264', link: 'https://wa.me/918890301264' },
        { label: 'Email Us', value: 'support@mentriqtechnologies.in', link: 'mailto:support@mentriqtechnologies.in' },
        { label: 'Call Office', value: '+91 8890301264', link: 'tel:+918890301264' }
    ];

    const navigationOptions = [
        { label: 'Explore Courses', path: '/courses', icon: GraduationCap },
        { label: 'Professional Training', path: '/training', icon: Briefcase },
        { label: 'About MentriQ', path: '/about', icon: Calendar }
    ];

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        const onEsc = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', onEsc);
        return () => window.removeEventListener('keydown', onEsc);
    }, []);

    const handleOptionClick = (optionId) => {
        setShowOptions(false);
        if (optionId === 'path') {
            addMessage('bot', "I can guide you to our main sections:", navigationOptions, 'nav');
        } else if (optionId === 'contact') {
            addMessage('bot', "Here are our official contact channels:", contactOptions, 'contact');
        } else if (optionId === 'faq') {
            addMessage('bot', "What would you like to know?", faqOptions, 'faq');
        }
    };

    const addMessage = (type, text, choices = null, choiceType = null) => {
        const id = nextMessageId.current++;
        const newMessage = {
            id,
            type,
            text,
            choices,
            choiceType
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const containsAny = (text, keywords) => keywords.some((keyword) => text.includes(keyword));

    const getBotResponse = (input) => {
        const query = input.toLowerCase().trim();

        if (containsAny(query, ['hello', 'hi', 'hey', 'namaste'])) {
            return "Hello! I can quickly guide you to Courses, Training, Contact, Placements, and Fees details.";
        }

        if (containsAny(query, ['course', 'courses', 'class', 'classes', 'learn', 'study'])) {
            return "You can explore all programs on our Courses page. Open: /courses";
        }

        if (containsAny(query, ['training', 'internship', 'intern', 'professional', 'job'])) {
            return "Our Training tracks and internship-focused programs are listed here: /training";
        }

        if (containsAny(query, ['placement', 'hiring', 'job support', 'career'])) {
            return "Yes, MentriQ provides dedicated placement assistance with interview prep and hiring support.";
        }

        if (containsAny(query, ['fee', 'fees', 'price', 'cost'])) {
            return "Fee depends on the selected program. Share the course name and we will help you with exact details.";
        }

        if (containsAny(query, ['duration', 'time', 'month', 'months'])) {
            return "Program duration varies by track. You can check exact duration inside each course on /courses.";
        }

        if (containsAny(query, ['contact', 'support', 'help', 'phone', 'email', 'whatsapp'])) {
            return "You can contact our support team at +91 8890301264 or support@mentriqtechnologies.in. For location/details: /contact";
        }

        if (containsAny(query, ['about', 'who', 'mentriq', 'mission', 'company'])) {
            return "You can learn about MentriQ, our mission, and team on: /about";
        }

        return "I can help with Courses, Training, Placements, Fees, or Contact support. Ask me one of these and I’ll guide you quickly.";
    };

    const simulateBotReply = (botText, delay = 900) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            addMessage('bot', botText);
        }, delay);
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userText = inputValue;
        setInputValue('');
        setShowOptions(false);
        addMessage('user', userText);
        simulateBotReply(getBotResponse(userText), 1000);
    };

    const resetChat = () => {
        setMessages([{ id: 1, type: 'bot', text: WELCOME_MESSAGE }]);
        nextMessageId.current = 2;
        setShowOptions(true);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <MotionDiv
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        className="absolute bottom-16 right-0 w-[350px] md:w-[380px] h-[520px] bg-[#0b1220]/95 backdrop-blur-2xl rounded-[2rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-5 bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-between shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                            <div className="flex items-center space-x-3 relative z-10">
                                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/30">
                                    <div className="text-white">
                                        <MessageCircle size={18} />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-base tracking-tight leading-none mb-1">Happy Assistant</h3>
                                    <div className="flex items-center space-x-1.5">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,1)]" />
                                        <span className="text-indigo-100 text-[9px] font-black uppercase tracking-widest">Online Now</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors bg-black/20 p-2 rounded-lg relative z-10">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className="space-y-4">
                                    <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] p-4 rounded-2xl shadow-xl ${msg.type === 'user'
                                            ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-tr-none'
                                            : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/10'
                                            }`}>
                                            <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                                        </div>
                                    </div>

                                    {/* Choice Rendering */}
                                    {msg.choices && (
                                        <MotionDiv
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="grid gap-2"
                                        >
                                            {msg.choiceType === 'nav' && msg.choices.map((c, idx) => (
                                                <Link
                                                    key={idx}
                                                    to={c.path}
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-indigo-300 transition-all text-sm font-bold group"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <c.icon size={16} />
                                                        <span>{c.label}</span>
                                                    </div>
                                                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            ))}

                                            {msg.choiceType === 'contact' && msg.choices.map((c, idx) => (
                                                <a
                                                    key={idx}
                                                    href={c.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex flex-col p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all group"
                                                >
                                                    <span className="text-[10px] font-black uppercase text-gray-500 mb-0.5">{c.label}</span>
                                                    <span className="text-sm font-bold text-cyan-400">{c.value}</span>
                                                </a>
                                            ))}

                                            {msg.choiceType === 'faq' && msg.choices.map((c, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        addMessage('user', c.q);
                                                        simulateBotReply(c.a, 700);
                                                    }}
                                                    className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-gray-300 text-sm font-bold transition-all group"
                                                >
                                                    <span>{c.q}</span>
                                                    <ChevronRight size={14} className="text-indigo-500 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            ))}
                                        </MotionDiv>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none border border-white/10 flex space-x-1">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}

                            {showOptions && (
                                <div className="grid grid-cols-1 gap-3 pt-4">
                                    {initialOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleOptionClick(opt.id)}
                                            className="flex items-center space-x-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all text-left group"
                                        >
                                            <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/5">
                                                <opt.icon size={20} />
                                            </div>
                                            <span className="text-sm font-black text-gray-200 tracking-tight">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {!showOptions && !isTyping && (
                                <button
                                    onClick={resetChat}
                                    className="w-full py-4 text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl border border-dashed border-white/10 mt-4"
                                >
                                    New Consultation
                                </button>
                            )}

                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Footer */}
                        <form onSubmit={handleSend} className="p-5 bg-black/20 border-t border-white/5">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask anything..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 pr-12 text-sm text-white placeholder-gray-500 outline-none focus:bg-white/10 focus:border-indigo-500/50 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-indigo-400 hover:text-white disabled:text-gray-700 transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </MotionDiv>
                )}
            </AnimatePresence>

            <MotionButton
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`group relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${isOpen
                    ? 'bg-white text-indigo-600 rotate-90'
                    : ''
                    }`}
            >
                {isOpen ? (
                    <X size={24} strokeWidth={2.5} />
                ) : (
                    <div className="relative w-12 h-14 flex items-center justify-center pt-1.5">
                        {/* Waving Robot Character */}
                        <div className="relative scale-[0.55] transition-transform duration-500 group-hover:scale-[0.6]">
                            {/* Antenna */}
                            <div className="absolute -top-9 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <div className="w-0.5 h-4 bg-indigo-300" />
                                <MotionDiv
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-3 h-3 bg-cyan-400 rounded-full blur-[1px] -mt-1 shadow-[0_0_10px_rgba(34,211,238,1)]"
                                />
                            </div>

                            {/* Head */}
                            <div className="w-20 h-16 bg-white rounded-[2rem] relative border-[2px] border-indigo-100 flex items-center justify-center shadow-xl">
                                {/* Faceplate */}
                                <div className="w-[4.2rem] h-12 bg-[#0f172a] rounded-[1.2rem] flex flex-col items-center justify-center p-2 border border-white/10">
                                    <div className="flex space-x-3 mb-1">
                                        <MotionDiv
                                            animate={{ scaleY: [1, 0.1, 1] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                            className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                        />
                                        <MotionDiv
                                            animate={{ scaleY: [1, 0.1, 1] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                                            className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                                        />
                                    </div>
                                    <div className="w-5 h-1.5 border-b-2 border-cyan-400 rounded-full" />
                                </div>
                                {/* Ears */}
                                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-6 bg-indigo-50 rounded-full border border-indigo-100" />
                                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-6 bg-indigo-50 rounded-full border border-indigo-100" />
                            </div>

                            {/* Body */}
                            <div className="w-16 h-20 bg-white rounded-[2.5rem] mt-1 relative mx-auto border-[2px] border-indigo-100 shadow-lg flex flex-col items-center pt-3 overflow-hidden">
                                {/* Chest Badge */}
                                <div className="w-10 h-6 bg-[#0f172a] rounded-lg flex items-center justify-center shadow-inner mb-2 border border-white/5">
                                    <span className="text-[7px] font-black text-cyan-400 animate-pulse tracking-widest">HI!</span>
                                </div>
                                {/* Body Stripes */}
                                <div className="w-14 h-[2px] bg-cyan-400/20 mb-2" />
                                <div className="w-14 h-[2px] bg-cyan-400/20 mb-2" />
                                <div className="w-14 h-[2px] bg-cyan-400/20" />
                            </div>

                            {/* Arms */}
                            <MotionDiv
                                animate={{ rotate: [0, 20, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                style={{ originX: 0, originY: 0 }}
                                className="absolute top-18 -right-6 w-10 h-4 bg-white border-[2px] border-indigo-100 rounded-full shadow-md z-[-1]"
                            />
                            <MotionDiv
                                animate={{ rotate: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                style={{ originX: 1, originY: 0 }}
                                className="absolute top-18 -left-6 w-10 h-4 bg-white border-[2px] border-indigo-100 rounded-full shadow-md z-[-1]"
                            />
                        </div>
                    </div>
                )}

                {/* Subtle Hover Glow */}
                {!isOpen && (
                    <div className="absolute inset-0 rounded-2xl bg-indigo-400/20 scale-100 group-hover:scale-125 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                )}
            </MotionButton>
        </div>
    );
};

export default Chatbot;
