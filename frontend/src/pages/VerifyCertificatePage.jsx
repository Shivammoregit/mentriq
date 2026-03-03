import React, { useState, useEffect } from 'react'
import { Shield, CheckCircle, XCircle, Search, QrCode, ArrowLeft, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiClient as api } from '../utils/apiClient'

const VerifyCertificatePage = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [certificateId, setCertificateId] = useState(searchParams.get('id') || '')
    const [verifying, setVerifying] = useState(false)
    const [result, setResult] = useState(null)

    // Auto-verify if ID is in URL
    useEffect(() => {
        const idFromUrl = searchParams.get('id')
        if (idFromUrl) {
            setCertificateId(idFromUrl)
            handleVerify(null, idFromUrl)
        }
    }, [])

    const handleVerify = async (e, idToVerify = null) => {
        if (e) e.preventDefault()
        const id = idToVerify || certificateId
        if (!id.trim()) return

        setVerifying(true)
        setResult(null)

        try {
            const { data } = await api.get(`/certificates/verify/${id}`)
            setResult(data)
        } catch (error) {
            setResult({
                valid: false,
                message: error.response?.data?.message || 'Certificate not found or invalid'
            })
        } finally {
            setVerifying(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] pt-24 pb-20 px-4">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors mx-auto"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>

                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-3xl border border-emerald-500/20 mb-6">
                        <Shield className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Certificate Verification
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Verify the authenticity of MentriQ certificates by scanning the QR code or entering the certificate ID
                    </p>
                </motion.div>

                {/* Verification Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 md:p-12 mb-8"
                >
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                                Certificate ID
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={certificateId}
                                    onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                                    placeholder="Enter certificate ID (e.g., CERT-2024-XXXXX)"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-gray-600 focus:border-emerald-500/50 outline-none transition-all text-lg font-mono"
                                />
                                <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={verifying || !certificateId.trim()}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {verifying ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <Shield size={20} />
                                        Verify Certificate
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => alert('QR Scanner feature coming soon!')}
                                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition flex items-center gap-2"
                            >
                                <QrCode size={20} />
                                Scan QR
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Verification Result */}
                <AnimatePresence mode="wait">
                    {result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`rounded-[3rem] p-10 border-2 ${result.valid
                                ? 'bg-emerald-600/10 border-emerald-500/30'
                                : 'bg-red-600/10 border-red-500/30'
                                }`}
                        >
                            <div className="text-center">
                                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 ${result.valid ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {result.valid ? <CheckCircle size={40} /> : <XCircle size={40} />}
                                </div>

                                <h3 className={`text-3xl font-black mb-6 ${result.valid ? 'text-emerald-400' : 'text-red-400'
                                    }`}>
                                    {result.valid ? 'Certificate Verified ✓' : 'Invalid Certificate ✗'}
                                </h3>

                                {result.valid ? (
                                    <div className="space-y-6 text-left">
                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Certificate Details</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Student Name</p>
                                                    <p className="text-white font-bold text-lg">{result.studentName || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Certificate ID</p>
                                                    <p className="text-emerald-400 font-mono font-bold">{result.certificateId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Issue Date</p>
                                                    <p className="text-white font-bold">{result.issueDate || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Grade</p>
                                                    <p className="text-white font-bold">{result.grade || 'Pass'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Course Information</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Course Name</p>
                                                    <p className="text-white font-bold text-xl">{result.courseName || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Duration</p>
                                                    <p className="text-white font-bold">{result.duration || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {result.modules && result.modules.length > 0 && (
                                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <BookOpen className="text-emerald-400" size={20} />
                                                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                                        Modules Covered ({result.modules.length})
                                                    </h4>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {result.modules.map((module, index) => (
                                                        <div
                                                            key={index}
                                                            className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-emerald-500/30 transition-colors"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 font-black text-sm shrink-0">
                                                                    {index + 1}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-white font-bold text-sm mb-1">
                                                                        {module.title || `Module ${index + 1}`}
                                                                    </p>
                                                                    {module.description && (
                                                                        <p className="text-gray-400 text-xs line-clamp-2">
                                                                            {module.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 max-w-md mx-auto">
                                        {result.message}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-8"
                >
                    <h3 className="text-xl font-black text-white mb-4">How to Verify</h3>
                    <ul className="space-y-3 text-gray-400">
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">1</div>
                            <span>Locate the certificate ID on your MentriQ certificate (format: CERT-YYYY-XXXXX)</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">2</div>
                            <span>Enter the certificate ID in the field above or scan the QR code</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">3</div>
                            <span>Click "Verify Certificate" to check authenticity</span>
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    )
}

export default VerifyCertificatePage
