import React, { useEffect, useRef, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Award, Search, X, RotateCcw, Users, BookOpen, Trash2, CheckCircle, ShieldCheck, Eye, Upload, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const DEFAULT_FIELD_LAYOUT = {
    studentName: { enabled: true, x: 50, y: 41.8 },
    programName: { enabled: true, x: 50, y: 55.5 },
    issueDate: { enabled: true, x: 26, y: 69.5 },
    completionDate: { enabled: true, x: 74, y: 69.5 },
    grade: { enabled: true, x: 50, y: 75 },
    certificateId: { enabled: true, x: 25, y: 87.5 },
    qrCode: { enabled: true, x: 82, y: 85, size: 15.5 }
};

const FIELD_LABELS = {
    studentName: "Name",
    programName: "Program",
    issueDate: "Issue Date",
    completionDate: "Completion Date",
    grade: "Grade",
    certificateId: "Certificate ID",
    qrCode: "QR"
};

const createViewScaleDefaults = () => ({
    studentName: 1,
    programName: 1,
    issueDate: 1,
    completionDate: 1,
    grade: 1,
    certificateId: 1,
    qrCode: 1
});

const FIELD_VISUALS = {
    studentName: {
        anchor: "center",
        fontFamily: "'Great Vibes', cursive",
        fontWeight: 400,
        fontStyle: "normal",
        sizeRatio: 0.065,
        color: "#161616"
    },
    programName: {
        anchor: "center",
        fontFamily: "'Playfair Display', serif",
        fontWeight: 600,
        fontStyle: "normal",
        sizeRatio: 0.026,
        color: "#161616"
    },
    issueDate: {
        anchor: "left",
        fontFamily: "'Times New Roman', serif",
        fontWeight: 600,
        fontStyle: "normal",
        sizeRatio: 0.016,
        color: "#161616"
    },
    completionDate: {
        anchor: "right",
        fontFamily: "'Times New Roman', serif",
        fontWeight: 600,
        fontStyle: "normal",
        sizeRatio: 0.016,
        color: "#161616"
    },
    grade: {
        anchor: "center",
        fontFamily: "'Times New Roman', serif",
        fontWeight: 600,
        fontStyle: "normal",
        sizeRatio: 0.028,
        color: "#161616"
    },
    certificateId: {
        anchor: "left",
        fontFamily: "'Times New Roman', serif",
        fontWeight: 500,
        fontStyle: "normal",
        sizeRatio: 0.015,
        color: "#161616"
    }
};

const createDefaultFieldLayout = () =>
    Object.fromEntries(
        Object.entries(DEFAULT_FIELD_LAYOUT).map(([key, value]) => [key, { ...value }])
    );

const mergeFieldLayout = (...layouts) => {
    const merged = createDefaultFieldLayout();

    layouts.forEach((layout) => {
        if (!layout || typeof layout !== "object") return;

        Object.entries(layout).forEach(([key, value]) => {
            if (!value || typeof value !== "object" || Array.isArray(value)) return;
            merged[key] = {
                ...(merged[key] || {}),
                ...value
            };
        });
    });

    return merged;
};

const normalizeTemplateUrl = (template) => {
    const rawUrl = String(template?.url || "").trim();
    return rawUrl ? resolveImageUrl(rawUrl) : "";
};

const getResolvedCertificateLayout = (certificate, templateDefaults) => {
    if (TEMPLATE_LOCKED) {
        return mergeFieldLayout(SYSTEM_TEMPLATE.fieldLayout);
    }

    const defaultLayout = mergeFieldLayout(templateDefaults?.fieldLayout);
    const certificateLayout = mergeFieldLayout(certificate?.fieldLayout);
    const certificateTemplateUrl = normalizeTemplateUrl(certificate?.template);
    const defaultTemplateUrl = normalizeTemplateUrl(templateDefaults?.template);

    if (certificateTemplateUrl && defaultTemplateUrl && certificateTemplateUrl === defaultTemplateUrl) {
        return defaultLayout;
    }

    return certificateLayout;
};

const POSITION_OFFSET = {
    y: -4
};

const getContainMetrics = (container, naturalWidth, naturalHeight) => {
    if (!container || !naturalWidth || !naturalHeight) return null;

    const containerWidth = container.clientWidth || 0;
    const containerHeight = container.clientHeight || 0;
    if (!containerWidth || !containerHeight) return null;

    const scale = Math.min(containerWidth / naturalWidth, containerHeight / naturalHeight);
    const width = naturalWidth * scale;
    const height = naturalHeight * scale;

    return {
        left: (containerWidth - width) / 2,
        top: (containerHeight - height) / 2,
        width,
        height,
        naturalWidth,
        naturalHeight
    };
};

const getFieldPositionStyle = (cfg, metrics, anchor = "center") => {
    if (!cfg) return {};

    const translateX =
        anchor === "left" ? "0%" :
        anchor === "right" ? "-100%" :
        "-50%";
    const translateY = "-50%";

    if (!metrics) {
        return {
            left: `${cfg.x || 50}%`,
            top: `${cfg.y || 50}%`,
            transform: `translate(${translateX}, ${translateY})`
        };
    }

    const x = metrics.left + (Number(cfg.x || 0) / 100) * metrics.width;
    const y = metrics.top + (Number(cfg.y || 0) / 100) * metrics.height + POSITION_OFFSET.y;

    return {
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(${translateX}, ${translateY})`
    };
};

const getMetricDimensions = (metrics) => ({
    width: metrics?.width || metrics?.naturalWidth || 620,
    height: metrics?.height || metrics?.naturalHeight || 900
});

const getFieldFontSize = (key, metrics, cfg) => {
    const visual = FIELD_VISUALS[key] || FIELD_VISUALS.programName;
    const { height } = getMetricDimensions(metrics);
    const scale = Number(cfg?.scale || 1);

    return Math.max(12, Math.round(height * (visual.sizeRatio || 0.018) * scale));
};

const getFieldDomStyle = (key, cfg, metrics) => {
    const visual = FIELD_VISUALS[key] || FIELD_VISUALS.programName;
    const { width } = getMetricDimensions(metrics);

    return {
        ...getFieldPositionStyle(cfg, metrics, visual.anchor),
        color: visual.color,
        fontFamily: visual.fontFamily,
        fontWeight: visual.fontWeight,
        fontStyle: visual.fontStyle || "normal",
        fontSize: `${getFieldFontSize(key, metrics, cfg)}px`,
        lineHeight: 1,
        textAlign: visual.anchor === "left" ? "left" : visual.anchor === "right" ? "right" : "center",
        textShadow: "none",
        maxWidth: `${width * 0.7}px`,
        whiteSpace: "normal",
        wordBreak: "break-word"
    };
};

const getQrSizePx = (cfg, metrics) => {
    const { width } = getMetricDimensions(metrics);
    return Math.max(42, Math.round(width * (Number(cfg?.size || 12) / 100)));
};

const TEMPLATE_LOCKED = false;
const DEBUG_GRID = false;
const SYSTEM_TEMPLATE = {
    template: {
        url: "/images/system-certificate-template.svg",
        fileName: "system-certificate-template.svg",
        mimeType: "image/svg+xml"
    },
    fieldLayout: {
        studentName: { enabled: true, x: 50, y: 41.8 },
        programName: { enabled: true, x: 50, y: 55.5 },
        issueDate: { enabled: true, x: 26, y: 69.5 },
        completionDate: { enabled: true, x: 74, y: 69.5 },
        grade: { enabled: true, x: 50, y: 75 },
        certificateId: { enabled: true, x: 25, y: 87.5 },
        qrCode: { enabled: true, x: 82, y: 85, size: 15.5 }
    }
};

const CertificateManagement = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("issue");
    const [searchTerm, setSearchTerm] = useState("");
    const [viewingCert, setViewingCert] = useState(null);

    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [internships, setInternships] = useState([]);
    const [formData, setFormData] = useState({
        userId: "",
        courseId: "",
        internshipId: "",
        type: "Course",
        customName: "",
        customProgramName: "",
        grade: "",
        completionDate: "",
        template: { url: "", fileName: "", mimeType: "" },
        fieldLayout: createDefaultFieldLayout()
    });
    const [uploadingTemplate, setUploadingTemplate] = useState(false);
    const [savingTemplateDefaults, setSavingTemplateDefaults] = useState(false);
    const [defaultTemplate, setDefaultTemplate] = useState({
        template: { url: "", fileName: "", mimeType: "" },
        fieldLayout: createDefaultFieldLayout()
    });
    const [dragField, setDragField] = useState(null);
    const templateCanvasRef = useRef(null);
    const templateImageRef = useRef(null);
    const certificateSurfaceRef = useRef(null);
    const certificateImageRef = useRef(null);
    const defaultTemplateBackfillAttemptedRef = useRef(false);
    const activeViewCertIdRef = useRef(null);
    const [templateMetrics, setTemplateMetrics] = useState(null);
    const [certificateMetrics, setCertificateMetrics] = useState(null);
    const [isViewAdjustMode, setIsViewAdjustMode] = useState(false);
    const [viewLayoutOverride, setViewLayoutOverride] = useState(null);
    const [viewFieldScale, setViewFieldScale] = useState(createViewScaleDefaults());
    const [selectedViewField, setSelectedViewField] = useState("studentName");
    const [previewDragField, setPreviewDragField] = useState(null);

    const toast = useToast();

    const fetchData = async () => {
        try {
            const [certRes, userRes, courseRes, internshipRes, settingsRes] = await Promise.all([
                api.get("/certificates"),
                api.get("/users"),
                api.get("/courses"),
                api.get("/internships"),
                api.get("/settings")
            ]);
            setCertificates(certRes.data || []);
            setUsers(userRes.data?.filter(u => u.role !== 'admin') || []);
            setCourses(courseRes.data || []);
            setInternships(internshipRes.data || []);

            const settingsTemplate = settingsRes.data?.certificateTemplate;
            const hasSettingsTemplateUrl = Boolean(String(settingsTemplate?.template?.url || "").trim());

            if (settingsTemplate) {
                setDefaultTemplate({
                    template: {
                        url: settingsTemplate.template?.url || "",
                        fileName: settingsTemplate.template?.fileName || "",
                        mimeType: settingsTemplate.template?.mimeType || ""
                    },
                    fieldLayout: mergeFieldLayout(settingsTemplate.fieldLayout)
                });
            }

            // One-time backfill: if global default template is empty, adopt oldest issued certificate template.
            if (!hasSettingsTemplateUrl && !defaultTemplateBackfillAttemptedRef.current) {
                defaultTemplateBackfillAttemptedRef.current = true;
                const oldestWithTemplate = [...(certRes.data || [])]
                    .reverse()
                    .find((cert) => String(cert?.template?.url || "").trim());

                if (oldestWithTemplate?.template?.url) {
                    const backfillPayload = {
                        certificateTemplate: {
                            template: {
                                url: oldestWithTemplate.template.url || "",
                                fileName: oldestWithTemplate.template.fileName || "default-certificate-template",
                                mimeType: oldestWithTemplate.template.mimeType || "image/jpeg"
                            },
                            fieldLayout: mergeFieldLayout(oldestWithTemplate.fieldLayout)
                        }
                    };

                    try {
                        await api.put("/settings", backfillPayload);
                        setDefaultTemplate({
                            template: { ...backfillPayload.certificateTemplate.template },
                            fieldLayout: mergeFieldLayout(backfillPayload.certificateTemplate.fieldLayout)
                        });
                    } catch (backfillErr) {
                        console.error("Default certificate template backfill failed", backfillErr);
                    }
                }
            }
        } catch (err) {
            console.error("Certificate fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!formData.userId) return;
        const selected = users.find((u) => u._id === formData.userId);
        if (!selected) return;
        if (!formData.customName) {
            setFormData((prev) => ({
                ...prev,
                customName: selected.name || selected.email || prev.customName
            }));
        }
    }, [formData.userId, users]);

    useEffect(() => {
        const updateMetrics = () => {
            setTemplateMetrics(
                getContainMetrics(
                    templateCanvasRef.current,
                    templateImageRef.current?.naturalWidth,
                    templateImageRef.current?.naturalHeight
                )
            );

            setCertificateMetrics(
                getContainMetrics(
                    certificateSurfaceRef.current,
                    certificateImageRef.current?.naturalWidth,
                    certificateImageRef.current?.naturalHeight
                )
            );
        };

        updateMetrics();
        window.addEventListener("resize", updateMetrics);
        return () => window.removeEventListener("resize", updateMetrics);
    }, [formData.template?.url, viewingCert?.template?.url, viewingCert?.certificateId]);

    useEffect(() => {
        const certId = viewingCert?._id || viewingCert?.certificateId || null;

        if (!certId) {
            activeViewCertIdRef.current = null;
            setIsViewAdjustMode(false);
            setViewLayoutOverride(null);
            setViewFieldScale(createViewScaleDefaults());
            setSelectedViewField("studentName");
            setPreviewDragField(null);
            return;
        }

        if (activeViewCertIdRef.current === certId) return;
        activeViewCertIdRef.current = certId;

        const initialLayout = mergeFieldLayout(getResolvedCertificateLayout(viewingCert, defaultTemplate));
        setViewLayoutOverride(initialLayout);
        setViewFieldScale({
            ...createViewScaleDefaults(),
            ...Object.fromEntries(
                Object.entries(initialLayout).map(([key, cfg]) => [key, Number(cfg?.scale || 1)])
            )
        });
        setSelectedViewField("studentName");
        setPreviewDragField(null);
    }, [viewingCert?._id, viewingCert?.certificateId, defaultTemplate]);

    const openIssueModal = () => {
        setModalMode("issue");
        setFormData({
            userId: "",
            courseId: "",
            internshipId: "",
            type: "Course",
            customName: "",
            customProgramName: "",
            grade: "",
            completionDate: "",
            template: { ...defaultTemplate.template },
            fieldLayout: mergeFieldLayout(defaultTemplate.fieldLayout)
        });
        setIsModalOpen(true);
    };

    const openTemplateModal = () => {
        setModalMode("template");
        setFormData((prev) => ({
            ...prev,
            template: { ...defaultTemplate.template },
            fieldLayout: mergeFieldLayout(defaultTemplate.fieldLayout)
        }));
        setIsModalOpen(true);
    };

    const applyDefaultTemplateToForm = () => {
        setFormData((prev) => ({
            ...prev,
            template: { ...defaultTemplate.template },
            fieldLayout: mergeFieldLayout(defaultTemplate.fieldLayout)
        }));
        toast.success("Default template applied");
    };

    const applySystemTemplate = () => {
        setFormData((prev) => ({
            ...prev,
            template: { ...SYSTEM_TEMPLATE.template },
            fieldLayout: mergeFieldLayout(SYSTEM_TEMPLATE.fieldLayout)
        }));
        toast.success("System template applied");
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/certificates/generate", {
                userId: formData.userId || undefined,
                courseId: formData.type === "Course" ? (formData.courseId || undefined) : undefined,
                internshipId: formData.type === "Internship" ? (formData.internshipId || undefined) : undefined,
                type: formData.type,
                customName: formData.customName,
                customProgramName: formData.customProgramName,
                grade: formData.grade || undefined,
                completionDate: formData.completionDate || undefined,
                template: formData.template,
                fieldLayout: mergeFieldLayout(formData.fieldLayout)
            });
            await saveTemplateDefaults({ showToast: false });
            toast.success("Credential generated successfully");
            setIsModalOpen(false);
            setFormData({
                userId: "",
                courseId: "",
                internshipId: "",
                type: "Course",
                customName: "",
                customProgramName: "",
                grade: "",
                completionDate: "",
                template: { ...formData.template },
                fieldLayout: mergeFieldLayout(formData.fieldLayout)
            });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Generation failed");
        }
    };

    const handleTemplateUpload = async (file) => {
        if (TEMPLATE_LOCKED) {
            toast.error("Template upload is disabled. Single default template mode is enabled.");
            return;
        }
        if (!file) return;
        setUploadingTemplate(true);
        try {
            const body = new FormData();
            body.append("file", file);
            const { data } = await api.post("/upload/template", body, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setFormData((prev) => ({
                ...prev,
                template: {
                    url: data.fileUrl || "",
                    fileName: data.fileName || file.name,
                    mimeType: data.mimeType || file.type
                }
            }));
            toast.success("Template uploaded");
        } catch (err) {
            toast.error(err.response?.data?.message || "Template upload failed");
        } finally {
            setUploadingTemplate(false);
        }
    };

    const saveTemplateDefaults = async ({ showToast = true } = {}) => {
        if (!formData.template?.url) {
            if (showToast) toast.error("Upload a template before saving defaults");
            return;
        }

        setSavingTemplateDefaults(true);
        try {
            await api.put("/settings", {
                certificateTemplate: {
                    template: formData.template,
                    fieldLayout: mergeFieldLayout(formData.fieldLayout)
                }
            });
            setDefaultTemplate({
                template: { ...formData.template },
                fieldLayout: mergeFieldLayout(formData.fieldLayout)
            });
            if (showToast) toast.success("Template saved for future certificates");
        } catch (err) {
            if (showToast) toast.error(err.response?.data?.message || "Failed to save template defaults");
        } finally {
            setSavingTemplateDefaults(false);
        }
    };

    const setLayoutValue = (key, prop, value) => {
        setFormData((prev) => ({
            ...prev,
            fieldLayout: {
                ...prev.fieldLayout,
                [key]: {
                    ...prev.fieldLayout[key],
                    [prop]: value
                }
            }
        }));
    };

    const updateFieldPosition = (fieldKey, clientX, clientY) => {
        const canvas = templateCanvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const metrics = templateMetrics || getContainMetrics(
            canvas,
            templateImageRef.current?.naturalWidth,
            templateImageRef.current?.naturalHeight
        );

        if (!metrics) return;

        const imageLeft = rect.left + metrics.left;
        const imageTop = rect.top + metrics.top;
        const rawX = ((clientX - imageLeft) / metrics.width) * 100;
        const rawY = ((clientY - imageTop) / metrics.height) * 100;
        const x = Math.max(2, Math.min(98, Math.round(rawX * 10) / 10));
        const y = Math.max(2, Math.min(98, Math.round(rawY * 10) / 10));
        setLayoutValue(fieldKey, "x", x);
        setLayoutValue(fieldKey, "y", y);
    };

    const startDraggingField = (fieldKey, event) => {
        event.preventDefault();
        setDragField(fieldKey);
        updateFieldPosition(fieldKey, event.clientX, event.clientY);
    };

    useEffect(() => {
        if (!dragField) return undefined;

        const handleMove = (event) => {
            updateFieldPosition(dragField, event.clientX, event.clientY);
        };
        const stopDragging = () => setDragField(null);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", stopDragging, { once: true });

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", stopDragging);
        };
    }, [dragField]);

    const updatePreviewFieldPosition = (fieldKey, clientX, clientY) => {
        const surface = certificateSurfaceRef.current;
        if (!surface) return;

        const rect = surface.getBoundingClientRect();
        const metrics = certificateMetrics || getContainMetrics(
            surface,
            certificateImageRef.current?.naturalWidth,
            certificateImageRef.current?.naturalHeight
        );
        if (!metrics) return;

        const imageLeft = rect.left + metrics.left;
        const imageTop = rect.top + metrics.top;
        const rawX = ((clientX - imageLeft) / metrics.width) * 100;
        const rawY = ((clientY - imageTop) / metrics.height) * 100;
        const x = Math.max(2, Math.min(98, Math.round(rawX * 10) / 10));
        const y = Math.max(2, Math.min(98, Math.round(rawY * 10) / 10));

        setViewLayoutOverride((prev) => {
            const base = mergeFieldLayout(prev);
            return {
                ...base,
                [fieldKey]: {
                    ...base[fieldKey],
                    x,
                    y
                }
            };
        });
    };

    const startPreviewFieldDrag = (fieldKey, event) => {
        if (!isViewAdjustMode) return;
        event.preventDefault();
        setPreviewDragField(fieldKey);
        setSelectedViewField(fieldKey);
        updatePreviewFieldPosition(fieldKey, event.clientX, event.clientY);
    };

    useEffect(() => {
        if (!previewDragField) return undefined;

        const handleMove = (event) => {
            updatePreviewFieldPosition(previewDragField, event.clientX, event.clientY);
        };
        const stopDragging = () => setPreviewDragField(null);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", stopDragging, { once: true });

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", stopDragging);
        };
    }, [previewDragField, certificateMetrics, isViewAdjustMode]);

    const adjustSelectedViewFieldScale = (delta) => {
        setViewFieldScale((prev) => {
            const current = Number(prev[selectedViewField] || 1);
            const next = Math.max(0.5, Math.min(2.5, Number((current + delta).toFixed(2))));
            setViewLayoutOverride((layoutPrev) => {
                const merged = mergeFieldLayout(layoutPrev);
                return {
                    ...merged,
                    [selectedViewField]: {
                        ...merged[selectedViewField],
                        scale: next
                    }
                };
            });
            return {
                ...prev,
                [selectedViewField]: next
            };
        });
    };

    const handleSaveViewLayout = async () => {
        if (!viewingCert) return;
        try {
            const baseLayout = mergeFieldLayout(
                viewLayoutOverride || getResolvedCertificateLayout(viewingCert, defaultTemplate)
            );
            const layoutWithScale = Object.fromEntries(
                Object.entries(baseLayout).map(([key, cfg]) => [
                    key,
                    {
                        ...cfg,
                        scale: Number(viewFieldScale[key] || cfg?.scale || 1)
                    }
                ])
            );

            const templateToSave = viewingCert?.template?.url
                ? {
                    url: viewingCert.template.url || "",
                    fileName: viewingCert.template.fileName || "certificate-template",
                    mimeType: viewingCert.template.mimeType || "image/svg+xml"
                }
                : { ...defaultTemplate.template };

            await api.put("/settings", {
                certificateTemplate: {
                    template: templateToSave,
                    fieldLayout: layoutWithScale
                }
            });

            setDefaultTemplate({
                template: { ...templateToSave },
                fieldLayout: mergeFieldLayout(layoutWithScale)
            });
            setViewLayoutOverride(mergeFieldLayout(layoutWithScale));
            setViewingCert((prev) => (prev ? { ...prev, fieldLayout: layoutWithScale } : prev));
            setCertificates((prev) =>
                prev.map((cert) =>
                    cert._id === viewingCert._id ? { ...cert, fieldLayout: layoutWithScale } : cert
                )
            );
            toast.success("Layout saved as default template.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save layout.");
        }
    };

    const handleRevoke = async (id) => {
        if (!window.confirm("Rescind this digital credential?")) return;
        try {
            await api.put(`/certificates/${id}/revoke`);
            toast.success("Credential revoked");
            setCertificates(certificates.map(c => c._id === id ? { ...c, status: 'Revoked' } : c));
        } catch {
            toast.error("Revocation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Purge certificate record?")) return;
        try {
            await api.delete(`/certificates/${id}`);
            toast.success("Registry entry removed");
            setCertificates((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            toast.error("Deletion failed");
        }
    };

    const filteredCerts = certificates.filter(c =>
        c.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.certificateId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getSafeCertificateFileName = (receiverName) => {
        const rawName = String(receiverName || "certificate").trim();
        const cleaned = rawName
            .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
            .replace(/\s+/g, " ")
            .trim();

        return `${cleaned || "certificate"}.pdf`;
    };

    const handleDownloadCert = async () => {
        try {
            const certSurface = document.querySelector("#certificate-node [data-certificate-surface='true']");
            if (!certSurface) {
                toast.error("Certificate preview not ready");
                return;
            }

            const rect = certSurface.getBoundingClientRect();
            const pageWidth = Math.max(1, Math.ceil(rect.width));
            const pageHeight = Math.max(1, Math.ceil(rect.height));

            const styleEl = document.createElement("style");
            styleEl.setAttribute("data-print-cert-style", "true");
            styleEl.textContent = `
                @media print {
                    body * { visibility: hidden !important; }
                    #certificate-node [data-certificate-surface='true'],
                    #certificate-node [data-certificate-surface='true'] * {
                        visibility: visible !important;
                    }
                    #certificate-node [data-certificate-surface='true'] {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: ${pageWidth}px !important;
                        height: ${pageHeight}px !important;
                        max-width: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        border: none !important;
                        border-radius: 0 !important;
                        background: #ffffff !important;
                        box-shadow: none !important;
                        overflow: hidden !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    @page {
                        size: ${pageWidth}px ${pageHeight}px;
                        margin: 0;
                    }
                }
            `;
            document.head.appendChild(styleEl);

            const cleanup = () => {
                const existing = document.querySelector('style[data-print-cert-style="true"]');
                if (existing) existing.remove();
                window.removeEventListener("afterprint", cleanup);
            };

            window.addEventListener("afterprint", cleanup);
            toast.success("Print dialog opened. Choose 'Save as PDF'.");
            window.print();
        } catch (err) {
            console.error("Certificate download error:", err);
            toast.error(`Failed to generate PDF: ${err?.message || "unknown error"}`);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="bg-[#0b1120]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <ShieldCheck size={28} className="text-emerald-400" />
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Credential Registry</h2>
                            <span className="ml-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 text-xs font-bold">
                                {certificates.length} Issued Tokens
                            </span>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">Automated certification and academic credential management.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="bg-[#1e293b] border border-white/10 rounded-xl pr-6 flex items-center w-full lg:w-auto group focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                            <Search className="text-slate-400 ml-4 group-focus-within:text-emerald-400 transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Verify certificate ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-transparent text-white placeholder:text-slate-400 focus:outline-none py-4 px-4 w-full lg:w-64 font-bold text-sm tracking-tight"
                            />
                        </div>
                        <button
                            onClick={openTemplateModal}
                            className="bg-[#1e293b] text-cyan-300 hover:bg-[#243449] px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 border border-cyan-500/30 text-[10px] uppercase tracking-widest justify-center"
                        >
                            <FileText size={18} />
                            <span>Template Setup</span>
                        </button>
                        <button
                            onClick={openIssueModal}
                            className="bg-emerald-600 text-white hover:bg-emerald-500 px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-[10px] uppercase tracking-widest justify-center"
                        >
                            <Award size={18} />
                            <span>Issue Credential</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Certificates Table */}
            <div className="bg-[#0b1120]/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#1e293b] border-b border-white/10">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Recipient Identity</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Academic Domain</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Credential Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 text-right">Registry Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredCerts.map((cert) => (
                                <motion.tr
                                    key={cert._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="hover:bg-[#1e293b] transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-bold text-white text-sm tracking-tight">{cert.studentName}</div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                <Users size={12} className="text-emerald-400" />
                                                ID: {cert.certificateId}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-bold text-white text-xs uppercase tracking-wider">{cert.courseName}</div>
                                            <div className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <BookOpen size={12} />
                                                Grade: {cert.grade || 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${cert.status === 'Revoked' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                            {cert.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-3">
                                            {cert.status !== 'Revoked' && (
                                                <button
                                                    onClick={() => handleRevoke(cert._id)}
                                                    className="p-3 rounded-xl bg-[#1e293b] text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/20 transition-all"
                                                    title="Revoke Credential"
                                                >
                                                    <RotateCcw size={16} />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(cert._id)}
                                                className="p-3 rounded-xl bg-[#1e293b] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 transition-all"
                                                title="Delete Record"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => setViewingCert(cert)}
                                                className="p-3 rounded-xl bg-[#1e293b] text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/20 transition-all"
                                                title="View & Download Certificate"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl ${modalMode === "template" ? "lg:pl-[17rem]" : ""}`}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className={`relative w-full ${modalMode === "template" ? "max-w-[84vw]" : "max-w-xl"} max-h-[92vh] bg-[#0b1120] border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl flex flex-col overflow-hidden`}
                        >
                            <div className="flex items-start justify-between gap-6 mb-6 shrink-0">
                                <div>
                                    <h3 className="text-2xl md:text-[2rem] font-black text-white tracking-tight uppercase">
                                        {modalMode === "template" ? "Template Studio" : "Credential Generation"}
                                    </h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                                        {modalMode === "template" ? "Configure Reusable Certificate Layout" : "Issue Digital Academic Token"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3.5 rounded-2xl bg-[#1e293b] hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form
                                id="certificate-form"
                                onSubmit={modalMode === "issue" ? handleGenerate : (e) => e.preventDefault()}
                                className={`flex-1 min-h-0 overflow-y-auto pr-4 -mr-4 custom-scrollbar ${modalMode === "template" ? "space-y-5" : "space-y-8"}`}
                            >
                                {modalMode === "issue" && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Recipient Name (Mandatory)</label>
                                    <input
                                        required
                                        value={formData.customName}
                                        onChange={e => setFormData({ ...formData, customName: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400"
                                        placeholder="Enter recipient full name"
                                    />
                                </div>
                                )}

                                {modalMode === "issue" && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Linked User (Optional)</label>
                                    <select
                                        value={formData.userId}
                                        onChange={e => setFormData({ ...formData, userId: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-[#1e293b]">No linked user</option>
                                        {users.map(u => (
                                            <option key={u._id} value={u._id} className="bg-[#1e293b]">{u.name || u.email}</option>
                                        ))}
                                    </select>
                                </div>
                                )}

                                {modalMode === "issue" && (
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Credential Type (Optional)</label>
                                    <div className="flex gap-4">
                                        <label className={`flex-1 flex items-center justify-center p-4 rounded-xl border cursor-pointer font-bold text-sm transition-all ${formData.type === 'Course' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-[#1e293b] border-white/10 text-slate-400 opacity-60 hover:opacity-100'}`}>
                                            <input type="radio" name="type" className="hidden" value="Course" checked={formData.type === 'Course'} onChange={() => setFormData({ ...formData, type: 'Course', internshipId: '' })} />
                                            Course
                                        </label>
                                        <label className={`flex-1 flex items-center justify-center p-4 rounded-xl border cursor-pointer font-bold text-sm transition-all ${formData.type === 'Internship' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-[#1e293b] border-white/10 text-slate-400 opacity-60 hover:opacity-100'}`}>
                                            <input type="radio" name="type" className="hidden" value="Internship" checked={formData.type === 'Internship'} onChange={() => setFormData({ ...formData, type: 'Internship', courseId: '' })} />
                                            Internship
                                        </label>
                                    </div>
                                </div>
                                )}

                                {modalMode === "issue" && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Program Name (Optional)</label>
                                    <input
                                        value={formData.customProgramName}
                                        onChange={e => setFormData({ ...formData, customProgramName: e.target.value })}
                                        className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400"
                                        placeholder="Course/Internship display name"
                                    />
                                </div>
                                )}

                                {modalMode === "issue" && (formData.type === 'Course' ? (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Linked Course (Optional)</label>
                                        <select
                                            value={formData.courseId}
                                            onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#1e293b]">No linked course</option>
                                            {courses.map(c => (
                                                <option key={c._id} value={c._id} className="bg-[#1e293b]">{c.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Linked Internship (Optional)</label>
                                        <select
                                            value={formData.internshipId}
                                            onChange={e => setFormData({ ...formData, internshipId: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-6 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#1e293b]">No linked internship</option>
                                            {internships.map(i => (
                                                <option key={i._id} value={i._id} className="bg-[#1e293b]">{i.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}

                                {modalMode === "issue" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Grade (Optional)</label>
                                        <input
                                            value={formData.grade}
                                            onChange={e => setFormData({ ...formData, grade: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all placeholder:text-slate-400"
                                            placeholder="A+, Pass, etc."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Completion Date (Optional)</label>
                                        <input
                                            type="date"
                                            value={formData.completionDate}
                                            onChange={e => setFormData({ ...formData, completionDate: e.target.value })}
                                            className="w-full bg-[#1e293b] border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all"
                                        />
                                    </div>
                                </div>
                                )}

                                {modalMode === "template" ? (
                                    <>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Template File</label>
                                            <div className="text-[11px] font-bold text-slate-300/90 truncate">
                                                {formData.template.fileName || "No template file selected"}
                                            </div>
                                            {TEMPLATE_LOCKED && (
                                                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-amber-300">
                                                    Single Template Mode Enabled
                                                </div>
                                            )}
                                            <div className="flex flex-wrap lg:flex-nowrap lg:justify-end gap-2.5">
                                                <button
                                                    type="button"
                                                    onClick={applySystemTemplate}
                                                    className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-blue-300"
                                                >
                                                    System Template
                                                </button>
                                                {!TEMPLATE_LOCKED && (
                                                    <label className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-[#1e293b] px-4 py-2.5 cursor-pointer hover:border-emerald-500/40 transition-colors">
                                                        <FileText size={16} className="text-emerald-400 shrink-0" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                                                            {uploadingTemplate ? "Uploading..." : "Upload"}
                                                        </span>
                                                        <Upload size={13} className="text-emerald-300" />
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                                                            className="hidden"
                                                            onChange={(e) => handleTemplateUpload(e.target.files?.[0])}
                                                        />
                                                    </label>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => saveTemplateDefaults({ showToast: true })}
                                                    disabled={savingTemplateDefaults || !formData.template?.url}
                                                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300 disabled:opacity-50"
                                                >
                                                    {savingTemplateDefaults ? "Saving..." : "Save Layout"}
                                                </button>
                                                {!TEMPLATE_LOCKED && (
                                                    <button
                                                        type="button"
                                                        onClick={applyDefaultTemplateToForm}
                                                        disabled={!defaultTemplate.template?.url}
                                                        className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300 disabled:opacity-50"
                                                    >
                                                        Use Default
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                                Drag labels to set exact positions on template. Name is always mandatory.
                                            </div>
                                            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_150px] rounded-2xl border border-white/10 overflow-hidden">
                                                <div className="p-4 md:p-5 bg-[#0f172a] border-r border-white/10 space-y-3">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                        Drag & Drop fields onto template.
                                                    </p>
                                                    <div
                                                        ref={templateCanvasRef}
                                                        className="relative w-full max-w-[420px] mx-auto certificate-container rounded-xl border border-white/10 bg-[#111827] overflow-hidden"
                                                    >
                                                        {formData.template?.url ? (
                                                            formData.template.mimeType?.startsWith("image/") ? (
                                                                <img
                                                                    ref={templateImageRef}
                                                                    src={resolveImageUrl(formData.template.url)}
                                                                    alt="Certificate Template"
                                                                    crossOrigin="anonymous"
                                                                    onLoad={() => {
                                                                        setTemplateMetrics(
                                                                            getContainMetrics(
                                                                                templateCanvasRef.current,
                                                                                templateImageRef.current?.naturalWidth,
                                                                                templateImageRef.current?.naturalHeight
                                                                            )
                                                                        );
                                                                    }}
                                                                    className="absolute inset-0 w-full h-full object-contain"
                                                                />
                                                            ) : (
                                                                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs font-bold uppercase tracking-widest text-slate-300">
                                                                    Document template attached. Drag preview works best with image templates.
                                                                </div>
                                                            )
                                                        ) : (
                                                            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
                                                                Upload a template to start drag-and-drop placement.
                                                            </div>
                                                        )}
                                                        {Object.entries(formData.fieldLayout).map(([fieldKey, cfg]) => {
                                                            if (!cfg?.enabled) return null;
                                                            return (
                                                                <button
                                                                    key={fieldKey}
                                                                    type="button"
                                                                    onMouseDown={(e) => startDraggingField(fieldKey, e)}
                                                                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg cursor-move ${fieldKey === "studentName" ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-200" : "bg-emerald-500/20 border-emerald-400/40 text-emerald-200"}`}
                                                                    style={getFieldPositionStyle(cfg, templateMetrics, "center")}
                                                                >
                                                                    {FIELD_LABELS[fieldKey] || fieldKey}
                                                                </button>
                                                            );
                                                        })}
                                                        {DEBUG_GRID && (
                                                            <div className="absolute inset-0 pointer-events-none opacity-20">
                                                                {Array.from({ length: 10 }).map((_, i) => (
                                                                    <div
                                                                        key={`grid-template-${i}`}
                                                                        style={{
                                                                            position: "absolute",
                                                                            top: `${i * 10}%`,
                                                                            width: "100%",
                                                                            borderTop: "1px dashed red"
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-2.5 bg-[#1e293b] space-y-2">
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-tight text-white">Fields List</p>
                                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Toggle</p>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        {Object.entries(formData.fieldLayout).map(([key, config]) => {
                                                            const label = key.replace(/_/g, "").toUpperCase();
                                                            return (
                                                                <div key={key} className="flex items-center justify-between gap-2 py-0.5">
                                                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-200">
                                                                        {label}
                                                                    </span>
                                                                    <label className="inline-flex items-center cursor-pointer">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="sr-only peer"
                                                                            checked={!!config.enabled}
                                                                            onChange={(e) => setLayoutValue(key, "enabled", e.target.checked)}
                                                                            disabled={key === "studentName"}
                                                                        />
                                                                        <span className="w-9 h-5 bg-slate-600/80 rounded-full peer peer-checked:bg-emerald-500/80 transition-colors relative after:content-[''] after:absolute after:w-4 after:h-4 after:bg-white after:rounded-full after:top-0.5 after:left-0.5 peer-checked:after:translate-x-4 after:transition-transform" />
                                                                    </label>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                            Certificate Preview
                                        </div>
                                        <div className="rounded-2xl border border-white/10 bg-[#0f172a] p-4">
                                            <div className="relative w-full max-w-[420px] mx-auto certificate-container rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
                                                {formData.template?.url ? (
                                                    formData.template.mimeType?.startsWith("image/") ? (
                                                        <img
                                                            src={resolveImageUrl(formData.template.url)}
                                                            alt="Certificate Preview"
                                                            crossOrigin="anonymous"
                                                            className="absolute inset-0 w-full h-full object-contain"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs font-bold uppercase tracking-widest text-slate-300">
                                                            Document template attached.
                                                        </div>
                                                    )
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
                                                        No template found. Configure one in Template Studio.
                                                    </div>
                                                )}
                                                {DEBUG_GRID && (
                                                    <div className="absolute inset-0 pointer-events-none opacity-20">
                                                        {Array.from({ length: 10 }).map((_, i) => (
                                                            <div
                                                                key={`grid-issue-${i}`}
                                                                style={{
                                                                    position: "absolute",
                                                                    top: `${i * 10}%`,
                                                                    width: "100%",
                                                                    borderTop: "1px dashed red"
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                            <div className="p-5 border-t border-white/5 flex justify-end items-center gap-3 shrink-0 -mx-10 -mb-10 mt-6 bg-[#1e293b]">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3.5 rounded-2xl bg-[#1e293b] text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/10 border border-white/10 transition-all"
                                >
                                    Dismiss
                                </button>
                                {modalMode === "template" ? (
                                    <button
                                        type="button"
                                        onClick={() => saveTemplateDefaults({ showToast: true })}
                                        disabled={savingTemplateDefaults || !formData.template?.url}
                                        className="flex-2 py-3.5 rounded-2xl bg-cyan-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                    >
                                        <CheckCircle size={18} strokeWidth={3} />
                                        <span>{savingTemplateDefaults ? "Saving..." : "Save As Default Template"}</span>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        form="certificate-form"
                                        className="flex-2 py-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                                    >
                                        <CheckCircle size={18} strokeWidth={3} />
                                        <span>Issue Credential</span>
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Certificate Preview Modal */}
            <AnimatePresence>
                {viewingCert && (
                    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pt-6 md:pt-10 pb-6 bg-black/90 backdrop-blur-xl">
                        <div className="absolute inset-0" onClick={() => setViewingCert(null)} />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-4xl flex flex-col gap-4 mt-2"
                        >
                            <div className="flex justify-end gap-3 z-10 w-full mb-2 pr-1">
                                <button
                                    onClick={handleDownloadCert}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shadow-lg flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <FileText size={16} />
                                    Download PDF
                                </button>
                                <button
                                    onClick={() => setViewingCert(null)}
                                    className="p-2.5 rounded-xl bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white transition-all border border-slate-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="z-10 w-full mb-2">
                                <div className="rounded-2xl border border-white/10 bg-[#111827]/90 p-3 flex flex-wrap items-center gap-2 md:gap-3">
                                    <button
                                        onClick={() => setIsViewAdjustMode((prev) => !prev)}
                                        className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all border ${isViewAdjustMode
                                            ? "bg-cyan-600 text-white border-cyan-400"
                                            : "bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700"}`}
                                    >
                                        {isViewAdjustMode ? "Adjust On" : "Adjust Off"}
                                    </button>
                                    <select
                                        value={selectedViewField}
                                        onChange={(e) => setSelectedViewField(e.target.value)}
                                        className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 text-sm"
                                    >
                                        {Object.entries(FIELD_LABELS).map(([key, label]) => (
                                            <option key={`view-field-${key}`} value={key}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => adjustSelectedViewFieldScale(-0.05)}
                                        className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 text-sm hover:bg-slate-700"
                                    >
                                        A-
                                    </button>
                                    <button
                                        onClick={() => adjustSelectedViewFieldScale(0.05)}
                                        className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 text-sm hover:bg-slate-700"
                                    >
                                        A+
                                    </button>
                                    <button
                                        onClick={() => {
                                            setViewLayoutOverride(mergeFieldLayout(getResolvedCertificateLayout(viewingCert, defaultTemplate)));
                                            setViewFieldScale(createViewScaleDefaults());
                                        }}
                                        className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-100 text-[11px] font-bold uppercase tracking-wider hover:bg-slate-700"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleSaveViewLayout}
                                        className="px-3 py-2 rounded-lg bg-emerald-600 border border-emerald-400 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-emerald-500"
                                    >
                                        Save Layout
                                    </button>
                                    <div className="ml-auto text-[11px] text-slate-300 font-semibold">
                                        {isViewAdjustMode ? "Drag any field on certificate to move it" : "Turn on Adjust to move/resize fields"}
                                    </div>
                                </div>
                            </div>

                            <div
                                id="certificate-node"
                                className="relative bg-[#0b1120] border-2 border-[#1e293b] rounded-3xl p-4 md:p-6 shadow-2xl overflow-hidden self-center w-full max-w-3xl flex flex-col items-center text-center mx-auto"
                            >
                                <div className="relative z-10 w-full">
                                    <div
                                        ref={certificateSurfaceRef}
                                        data-certificate-surface="true"
                                        className="relative w-full max-w-[520px] mx-auto certificate-container rounded-2xl border border-[#334155] bg-[#0f172a] overflow-hidden"
                                    >
                                        {viewingCert?.template?.url && (
                                            <>
                                                {viewingCert.template.mimeType?.startsWith("image/") ? (
                                                    <img
                                                        ref={certificateImageRef}
                                                        src={resolveImageUrl(viewingCert.template.url)}
                                                        alt="Certificate Template"
                                                        crossOrigin="anonymous"
                                                        onLoad={() => {
                                                            setCertificateMetrics(
                                                                getContainMetrics(
                                                                    certificateSurfaceRef.current,
                                                                    certificateImageRef.current?.naturalWidth,
                                                                    certificateImageRef.current?.naturalHeight
                                                                )
                                                            );
                                                        }}
                                                        className="absolute inset-0 w-full h-full object-contain opacity-90"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-[#0f172a]/70 text-[#cbd5e1] text-xs font-bold uppercase tracking-widest px-6 text-center">
                                                        Template file attached: {viewingCert.template.fileName || "Document"}
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {(() => {
                                            const layout = mergeFieldLayout(
                                                viewLayoutOverride || getResolvedCertificateLayout(viewingCert, defaultTemplate)
                                            );
                                            const issueDateText = new Date(viewingCert.issueDate || viewingCert.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                                            const completionDateText = viewingCert.completionDate
                                                ? new Date(viewingCert.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                                : '';

                                            const renderTextField = (key, text) => {
                                                const cfg = layout[key];
                                                if (!cfg?.enabled || !text) return null;
                                                const baseStyle = getFieldDomStyle(key, cfg, certificateMetrics);
                                                const fieldScale = Number(viewFieldScale[key] || cfg?.scale || 1);
                                                const rawSize = parseFloat(String(baseStyle.fontSize || "16"));
                                                const nextSize = Number.isFinite(rawSize) ? Math.max(8, Math.round(rawSize * fieldScale)) : rawSize;
                                                return (
                                                    <div
                                                        key={key}
                                                        className={`absolute ${isViewAdjustMode ? "pointer-events-auto cursor-move select-none" : "pointer-events-none"}`}
                                                        style={{
                                                            ...baseStyle,
                                                            fontSize: `${nextSize}px`
                                                        }}
                                                        onMouseDown={(event) => startPreviewFieldDrag(key, event)}
                                                    >
                                                        {text}
                                                    </div>
                                                );
                                            };

                                            return (
                                                <>
                                                    {renderTextField("studentName", viewingCert.studentName)}
                                                    {renderTextField("programName", viewingCert.courseName)}
                                                    {renderTextField("issueDate", issueDateText)}
                                                    {renderTextField("completionDate", completionDateText || "")}
                                                    {renderTextField("grade", viewingCert.grade || "")}
                                                    {renderTextField("certificateId", viewingCert.certificateId)}
                                                    {layout.qrCode?.enabled && (
                                                        <div
                                                            className={`absolute bg-white p-1 ${isViewAdjustMode ? "cursor-move" : ""}`}
                                                            style={{
                                                                ...getFieldPositionStyle(layout.qrCode, certificateMetrics, "center"),
                                                                width: `${Math.max(24, Math.round(getQrSizePx(layout.qrCode, certificateMetrics) * Number(viewFieldScale.qrCode || 1)))}px`,
                                                                height: `${Math.max(24, Math.round(getQrSizePx(layout.qrCode, certificateMetrics) * Number(viewFieldScale.qrCode || 1)))}px`,
                                                                pointerEvents: isViewAdjustMode ? "auto" : "none"
                                                            }}
                                                            onMouseDown={(event) => startPreviewFieldDrag("qrCode", event)}
                                                        >
                                                            <QRCodeSVG
                                                                data-qr="true"
                                                                value={`https://www.mentriqtechnologies.in/verify-certificate?id=${viewingCert.certificateId}`}
                                                                size={Math.max(16, Math.round(getQrSizePx(layout.qrCode, certificateMetrics) * Number(viewFieldScale.qrCode || 1)) - 8)}
                                                                level="H"
                                                                includeMargin={false}
                                                            />
                                                        </div>
                                                    )}
                                                    {DEBUG_GRID && (
                                                        <div className="absolute inset-0 pointer-events-none opacity-20">
                                                            {Array.from({ length: 10 }).map((_, i) => (
                                                                <div
                                                                    key={`grid-preview-${i}`}
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: `${i * 10}%`,
                                                                        width: "100%",
                                                                        borderTop: "1px dashed red"
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CertificateManagement;
