import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter, ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient as api } from '../../utils/apiClient';

const Footer = () => {
    const MotionA = motion.a;
    const MotionSpan = motion.span;
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Platform",
            links: [
                { name: "All Courses", path: "/courses" },
                { name: "Services", path: "/services" },
                { name: "Training", path: "/training" },
                { name: "Internship", path: "/recruit" },
            ]
        },
        {
            title: "Company",
            links: [
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
                { name: "Privacy Policy", path: "/privacy" },
                { name: "Terms of Service", path: "/terms" },
            ]
        },
        {
            title: "Support",
            links: [
                { name: "Verify Certificate", path: "/verify-certificate" },
                { name: "Help Center", path: "/contact" },
                { name: "FAQ", path: "/about" },
                { name: "Community", path: "/" },
            ]
        },
    ];

    const [settings, setSettings] = React.useState({
        email: "support@mentriqtechnologies.in",
        phone: "+918890301264",
        address: "2nd floor, 34/501, Haldighati Marg E, Sanganer, Sector 3, Pratap Nagar,302033",
        mapLink: "https://www.google.com/maps/place/MentriQ+Technologies/@26.8032657,75.8052318,17z/data=!4m14!1m7!3m6!1s0x396dcb785ab8c2cb:0x4bac0e52b5e07df!2s2nd+floor,+34%2F57,+Haldighati+Marg+E,+Sanganer,+Sector+3,+Pratap+Nagar,+Jaipur,+Rajasthan+302033!3b1!8m2!3d26.8032657!4d75.8052318!3m5!1s0x396dcb31ccbce14d:0x9f153a03ffb8fdd0!8m2!3d26.8023101!4d75.8047414!16s%2Fg%2F11yy2ld3gd?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D",
        socialLinks: {
            instagram: "https://www.instagram.com/mentriqtechnologies/",
            linkedin: "https://www.linkedin.com/company/mentriqtechnologies/",
            twitter: "https://x.com/MentriqT51419",
            whatsapp: "https://wa.me/918890301264"
        }
    });

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                setSettings(prev => ({
                    ...prev,
                    email: data.email || prev.email,
                    phone: data.phone || prev.phone,
                    address: data.address || prev.address,
                    mapLink: data.mapLink || prev.mapLink,
                    socialLinks: {
                        instagram: data.socialLinks?.instagram || prev.socialLinks.instagram,
                        linkedin: data.socialLinks?.linkedin || prev.socialLinks.linkedin,
                        twitter: data.socialLinks?.twitter || prev.socialLinks.twitter,
                        whatsapp: data.socialLinks?.whatsapp || prev.socialLinks.whatsapp
                    }
                }));
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };
        fetchSettings();
    }, []);

    const socialLinks = [
        { icon: Instagram, href: settings.socialLinks.instagram, label: "Instagram" },
        { icon: Linkedin, href: settings.socialLinks.linkedin, label: "LinkedIn" },
        { icon: Twitter, href: settings.socialLinks.twitter, label: "Twitter" },
        { icon: MessageCircle, href: settings.socialLinks.whatsapp, label: "WhatsApp" },
    ];

    const emailAddress = settings.email;
    const phoneNumber = settings.phone;
    const mapsLink = settings.mapLink;

    return (
        <footer className="relative bg-slate-950 border-t border-slate-800 overflow-hidden pt-12 pb-8 mt-6">
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.08]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(148,163,184,0.35) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}
            />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px]" />
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-12">
                    <div className="lg:col-span-4">
                        <Link to="/" className="inline-block mb-6">
                            <img
                                src="/images/logo.jpg"
                                alt="MentriQ Technologies"
                                className="h-14 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-slate-300 text-sm font-medium leading-relaxed mb-6 max-w-sm">
                            Empowering the next generation of tech leaders through industry-expert mentorship and elite skill-architecting programs.
                        </p>

                        <div className="flex gap-4">
                            {socialLinks.map((social, idx) => {
                                const Icon = social.icon;
                                return (
                                    <MotionA
                                        key={idx}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-300 group shadow-sm shadow-black/40 overflow-hidden"
                                        aria-label={social.label}
                                    >
                                        <motion.div
                                            whileHover={{ y: -3, scale: 1.15 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        >
                                            <Icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                                        </motion.div>
                                    </MotionA>
                                );
                            })}
                        </div>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-3 gap-8">
                        {footerSections.map((section, idx) => (
                            <div key={idx}>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 mb-4 px-1 border-l-2 border-indigo-400 py-1">
                                    {section.title}
                                </h4>
                                <ul className="space-y-3">
                                    {section.links.map((link, lIdx) => (
                                        <li key={lIdx}>
                                            <Link
                                                to={link.path}
                                                className="text-xs font-semibold text-slate-300 hover:text-indigo-300 transition-colors duration-300 flex items-center group/link"
                                            >
                                                <MotionSpan whileHover={{ x: 5 }}>
                                                    {link.name}
                                                </MotionSpan>
                                                <ArrowRight className="w-3 h-3 ml-2 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 text-indigo-300" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-3">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-100 mb-4 px-1 border-l-2 border-cyan-400 py-1">
                            Connect
                        </h4>
                        <div className="space-y-5">
                            <a href={`mailto:${emailAddress}`} className="flex items-start gap-4 group/contact">
                                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-indigo-500/10 border border-indigo-400/30 flex items-center justify-center text-indigo-300 group-hover/contact:bg-indigo-600 group-hover/contact:text-white transition-all duration-300">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Email Us</p>
                                    <p className="text-sm font-bold text-slate-100">{emailAddress}</p>
                                </div>
                            </a>
                            <a href={`tel:${phoneNumber}`} className="flex items-start gap-4 group/contact">
                                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover/contact:bg-cyan-600 group-hover/contact:text-white transition-all duration-300">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Call Us</p>
                                    <p className="text-sm font-bold text-slate-100">{phoneNumber}</p>
                                </div>
                            </a>
                            <a
                                href={mapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-4 group/contact"
                            >
                                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover/contact:bg-emerald-600 group-hover/contact:text-white transition-all duration-300">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="pt-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Location</p>
                                    <p className="text-sm font-bold text-slate-100">{settings.address}</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <Link to="/" className="text-xs font-medium text-slate-400 hover:text-indigo-300 transition-colors">
                        &copy; {currentYear} MentriQ. All rights reserved.
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
