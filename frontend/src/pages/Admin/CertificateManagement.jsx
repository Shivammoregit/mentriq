import React, { useEffect, useRef, useState } from "react";
import { apiClient as api } from "../../utils/apiClient";
import { Award, Search, X, RotateCcw, Users, BookOpen, Trash2, CheckCircle, ShieldCheck, Eye, Download, Upload, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl } from "../../utils/imageUtils";

const DEFAULT_FIELD_LAYOUT = {
    studentName: { enabled: true, x: 50, y: 43.5 },
    programName: { enabled: true, x: 50, y: 56 },
    issueDate: { enabled: true, x: 23.5, y: 70.5 },
    completionDate: { enabled: true, x: 76.5, y: 70.5 },
    grade: { enabled: true, x: 52, y: 82 },
    certificateId: { enabled: true, x: 26, y: 91.2 },
    qrCode: { enabled: true, x: 76.5, y: 90.2, size: 12.5 }
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

const FIELD_VISUALS = {
    studentName: {
        anchor: "center",
        fontFamily: "'Great Vibes', 'Lucida Handwriting', 'Brush Script MT', cursive",
        fontWeight: 400,
        fontStyle: "normal",
        sizeRatio: 0.063,
        color: "#161616"
    },
    programName: {
        anchor: "center",
        fontFamily: "'Times New Roman', serif",
        fontWeight: 600,
        fontStyle: "normal",
        sizeRatio: 0.019,
        color: "#161616"
    },
    issueDate: {
        anchor: "left",
        fontFamily: "'Times New Roman', serif",
        fontWeight: 600,
        fontStyle: "normal",
        sizeRatio: 0.0145,
        color: "#161616"
    },
    completionDate: {
        anchor: "right",
        fontFamily: "'Times New Roman', serif",
        fontWeight: 600,
        fontStyle: "normal",
        sizeRatio: 0.0145,
        color: "#161616"
    },
    grade: {
        anchor: "center",
        fontFamily: "'Times New Roman', serif",
        fontWeight: 600,
        fontStyle: "normal",
        sizeRatio: 0.017,
        color: "#161616"
    },
    certificateId: {
        anchor: "left",
        fontFamily: "'Times New Roman', serif",
        fontWeight: 500,
        fontStyle: "normal",
        sizeRatio: 0.013,
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
    const defaultLayout = mergeFieldLayout(templateDefaults?.fieldLayout);
    const certificateLayout = mergeFieldLayout(certificate?.fieldLayout);
    const certificateTemplateUrl = normalizeTemplateUrl(certificate?.template);
    const defaultTemplateUrl = normalizeTemplateUrl(templateDefaults?.template);

    if (certificateTemplateUrl && defaultTemplateUrl && certificateTemplateUrl === defaultTemplateUrl) {
        return defaultLayout;
    }

    return certificateLayout;
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

    const translateX = anchor === "left" ? "0%" : anchor === "right" ? "-100%" : "-50%";

    if (!metrics) {
        return {
            left: `${cfg.x || 50}%`,
            top: `${cfg.y || 50}%`,
            transform: `translate(${translateX}, -50%)`
        };
    }

    const x = metrics.left + (Number(cfg.x || 0) / 100) * metrics.width;
    const y = metrics.top + (Number(cfg.y || 0) / 100) * metrics.height;

    return {
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(${translateX}, -50%)`
    };
};

const getMetricDimensions = (metrics) => ({
    width: metrics?.width || metrics?.naturalWidth || 620,
    height: metrics?.height || metrics?.naturalHeight || 900
});

const getFieldFontSize = (key, metrics) => {
    const visual = FIELD_VISUALS[key] || FIELD_VISUALS.programName;
    const { height } = getMetricDimensions(metrics);

    return Math.max(12, Math.round(height * (visual.sizeRatio || 0.018)));
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
        fontSize: `${getFieldFontSize(key, metrics)}px`,
        lineHeight: 1,
        textAlign: visual.anchor === "left" ? "left" : visual.anchor === "right" ? "right" : "center",
        textShadow: "none",
        whiteSpace: key === "programName" ? "normal" : "nowrap",
        maxWidth: key === "programName" ? `${width * 0.62}px` : "none"
    };
};

const getCanvasFont = (key, metrics) => {
    const visual = FIELD_VISUALS[key] || FIELD_VISUALS.programName;
    const size = getFieldFontSize(key, metrics);
    return `${visual.fontStyle || "normal"} ${visual.fontWeight || 400} ${size}px ${visual.fontFamily}`;
};

const getQrSizePx = (cfg, metrics) => {
    const { width } = getMetricDimensions(metrics);
    return Math.max(42, Math.round(width * (Number(cfg?.size || 12) / 100)));
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
    const [templateMetrics, setTemplateMetrics] = useState(null);
    const [certificateMetrics, setCertificateMetrics] = useState(null);

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
        const x = Math.max(2, Math.min(98, Number(rawX.toFixed(2))));
        const y = Math.max(2, Math.min(98, Number(rawY.toFixed(2))));
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

    const toDataUrl = (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

    const waitForImage = (img) => new Promise((resolve) => {
        if (img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve();
    });

    const inlineImagesForCapture = async (root) => {
        const images = Array.from(root.querySelectorAll("img"));
        await Promise.all(images.map(async (img) => {
            const src = img.getAttribute("src") || "";
            if (!src || src.startsWith("data:")) return;

            try {
                const res = await fetch(src, { mode: "cors", credentials: "omit", cache: "no-store" });
                if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
                const blob = await res.blob();
                const dataUrl = await toDataUrl(blob);
                img.src = dataUrl;
                await waitForImage(img);
            } catch {
                // If image can't be CORS-fetched in production, remove it to avoid tainted canvas export.
                img.remove();
            }
        }));
    };

    const sanitizeUnsupportedColorsForCapture = (root) => {
        const hasUnsupportedColorFn = (value) =>
            typeof value === "string" && /(oklch|oklab|color\(|color-mix\()/i.test(value);

        const colorProbeCanvas = document.createElement("canvas");
        const colorProbeCtx = colorProbeCanvas.getContext("2d");

        const toSupportedColor = (value) => {
            if (!value || !hasUnsupportedColorFn(value) || !colorProbeCtx) return value;
            try {
                colorProbeCtx.fillStyle = "#000000";
                colorProbeCtx.fillStyle = value;
                return colorProbeCtx.fillStyle || "";
            } catch {
                return "";
            }
        };

        const colorProps = [
            "color",
            "background-color",
            "border-top-color",
            "border-right-color",
            "border-bottom-color",
            "border-left-color",
            "outline-color",
            "text-decoration-color",
            "caret-color",
            "column-rule-color",
            "fill",
            "stroke"
        ];

        const nodes = [root, ...Array.from(root.querySelectorAll("*"))];
        nodes.forEach((node) => {
            const computed = window.getComputedStyle(node);

            colorProps.forEach((prop) => {
                const raw = computed.getPropertyValue(prop);
                if (!hasUnsupportedColorFn(raw)) return;
                const safe = toSupportedColor(raw);
                if (safe) node.style.setProperty(prop, safe, "important");
            });

            const bgImage = computed.getPropertyValue("background-image");
            if (hasUnsupportedColorFn(bgImage)) {
                node.style.setProperty("background-image", "none", "important");
            }

            const boxShadow = computed.getPropertyValue("box-shadow");
            if (hasUnsupportedColorFn(boxShadow)) {
                node.style.setProperty("box-shadow", "none", "important");
            }

            const textShadow = computed.getPropertyValue("text-shadow");
            if (hasUnsupportedColorFn(textShadow)) {
                node.style.setProperty("text-shadow", "none", "important");
            }
        });
    };

    const captureCertificateCanvas = async (certElement) => {
        try {
            return await html2canvas(certElement, {
                scale: 3,
                useCORS: true,
                foreignObjectRendering: true,
                backgroundColor: null,
                logging: false,
                width: certElement.scrollWidth,
                height: certElement.scrollHeight
            });
        } catch (error) {
            const message = String(error?.message || "").toLowerCase();
            const needsSanitizedCapture =
                message.includes("tainted") ||
                message.includes("cross-origin") ||
                message.includes("securityerror") ||
                message.includes("unsupported color") ||
                message.includes("oklch") ||
                message.includes("oklab");

            if (!needsSanitizedCapture) throw error;

            const clone = certElement.cloneNode(true);
            clone.style.position = "fixed";
            clone.style.left = "-99999px";
            clone.style.top = "0";
            clone.style.pointerEvents = "none";
            clone.style.zIndex = "-1";
            clone.style.width = `${certElement.scrollWidth}px`;
            clone.style.height = `${certElement.scrollHeight}px`;
            document.body.appendChild(clone);

            try {
                await inlineImagesForCapture(clone);
                sanitizeUnsupportedColorsForCapture(clone);
                return await html2canvas(clone, {
                    scale: 3,
                    useCORS: true,
                    foreignObjectRendering: true,
                    backgroundColor: null,
                    logging: false,
                    width: certElement.scrollWidth,
                    height: certElement.scrollHeight
                });
            } finally {
                clone.remove();
            }
        }
    };

    const loadImageElement = (src, { useCors = true } = {}) =>
        new Promise((resolve, reject) => {
            const img = new Image();
            if (useCors) img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });

    const renderCertificateCanvasFromData = async (certElement) => {
        const surfaceEl = certElement?.querySelector('[data-certificate-surface="true"]');
        let nodeWidth = Math.max(700, Math.round(surfaceEl?.clientWidth || certElement?.scrollWidth || 900));
        let nodeHeight = Math.max(900, Math.round(surfaceEl?.clientHeight || certElement?.scrollHeight || 1200));
        let templateImage = null;

        const canvas = document.createElement("canvas");
        const scale = 2;

        if (viewingCert?.template?.url && viewingCert.template.mimeType?.startsWith("image/")) {
            try {
                const templateUrl = resolveImageUrl(viewingCert.template.url);
                templateImage = await loadImageElement(templateUrl, { useCors: true });
                nodeWidth = templateImage.naturalWidth || templateImage.width || nodeWidth;
                nodeHeight = templateImage.naturalHeight || templateImage.height || nodeHeight;
            } catch {
                templateImage = null;
            }
        }

        canvas.width = Math.floor(nodeWidth * scale);
        canvas.height = Math.floor(nodeHeight * scale);

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context unavailable");
        ctx.scale(scale, scale);
        if (document?.fonts?.ready) {
            await document.fonts.ready;
        }

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, nodeWidth, nodeHeight);

        if (templateImage) {
            ctx.drawImage(templateImage, 0, 0, nodeWidth, nodeHeight);
        }

        const layout = getResolvedCertificateLayout(viewingCert, defaultTemplate);
        const mapX = (pct) => (Number(pct || 0) / 100) * nodeWidth;
        const mapY = (pct) => (Number(pct || 0) / 100) * nodeHeight;

        const issueDateText = new Date(viewingCert?.issueDate || viewingCert?.createdAt || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        const completionDateText = viewingCert?.completionDate
            ? new Date(viewingCert.completionDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : "";

        const drawText = (key, text) => {
            const cfg = layout[key];
            if (!cfg?.enabled || !text) return;
            const visual = FIELD_VISUALS[key] || FIELD_VISUALS.programName;
            ctx.textAlign = visual.anchor || "center";
            ctx.textBaseline = "middle";
            ctx.font = getCanvasFont(key, { width: nodeWidth, height: nodeHeight });
            ctx.fillStyle = visual.color;
            ctx.fillText(text, mapX(cfg.x), mapY(cfg.y));
        };

        drawText("studentName", viewingCert?.studentName || "");
        drawText("programName", viewingCert?.courseName || "");
        drawText("issueDate", issueDateText);
        drawText("completionDate", completionDateText || "");
        drawText("grade", viewingCert?.grade || "");
        drawText("certificateId", viewingCert?.certificateId || "");

        if (layout.qrCode?.enabled) {
            const qrSize = getQrSizePx(layout.qrCode, { width: nodeWidth, height: nodeHeight });
            const qrCenterX = mapX(layout.qrCode.x);
            const qrCenterY = mapY(layout.qrCode.y);
            const qrX = qrCenterX - qrSize / 2;
            const qrY = qrCenterY - qrSize / 2;

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8);

            const qrSvg = certElement?.querySelector('[data-certificate-surface="true"] svg');
            if (qrSvg) {
                try {
                    const serialized = new XMLSerializer().serializeToString(qrSvg);
                    const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;
                    const qrImg = await loadImageElement(encoded, { useCors: false });
                    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
                } catch {
                    ctx.strokeStyle = "#0f172a";
                    ctx.lineWidth = 3;
                    ctx.strokeRect(qrX, qrY, qrSize, qrSize);
                }
            }
        }

        return canvas;
    };

    const handleDownloadCert = async (format = 'pdf') => {
        const certElement = document.getElementById('certificate-node');
        if (!certElement) return;
        
        try {
            toast.info(`Preparing ${format.toUpperCase()}...`);
            let canvas;
            try {
                canvas = await renderCertificateCanvasFromData(certElement);
            } catch {
                canvas = await captureCertificateCanvas(certElement);
            }
            const image = canvas.toDataURL("image/png", 1.0);
            const receiverName = viewingCert?.studentName || viewingCert?.name || "certificate";
            const safeName = getSafeCertificateFileName(receiverName);

            if (format === 'png') {
                const link = document.createElement('a');
                link.download = safeName.replace('.pdf', '.png');
                link.href = image;
                link.click();
                toast.success("Certificate PNG saved.");
            } else {
                const pdf = new jsPDF({
                    orientation: canvas.width >= canvas.height ? "landscape" : "portrait",
                    unit: "px",
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(image, "PNG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
                pdf.save(safeName);
                toast.success("Certificate PDF saved.");
            }
        } catch (err) {
            console.error("Certificate download error:", err);
            toast.error(`Failed to download certificate ${format.toUpperCase()}.`);
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
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Template File (PDF / DOC / DOCX / Image)</label>
                                            <div className="text-[11px] font-bold text-slate-300/90 truncate">
                                                {formData.template.fileName || "No template file selected"}
                                            </div>
                                            <div className="flex flex-wrap lg:flex-nowrap lg:justify-end gap-2.5">
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
                                                <button
                                                    type="button"
                                                    onClick={() => saveTemplateDefaults({ showToast: true })}
                                                    disabled={savingTemplateDefaults || !formData.template?.url}
                                                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300 disabled:opacity-50"
                                                >
                                                    {savingTemplateDefaults ? "Saving..." : "Save Template"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={applyDefaultTemplateToForm}
                                                    disabled={!defaultTemplate.template?.url}
                                                    className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300 disabled:opacity-50"
                                                >
                                                    Use Default
                                                </button>
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
                                                        className="relative w-full h-[48vh] min-h-[320px] max-h-[520px] rounded-xl border border-white/10 bg-[#111827] overflow-hidden"
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
                                            <div className="relative w-full h-[46vh] min-h-[320px] max-h-[520px] rounded-xl border border-white/10 bg-[#111827] overflow-hidden">
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
                                    onClick={() => handleDownloadCert('pdf')}
                                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all shadow-lg flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <FileText size={16} />
                                    Download PDF
                                </button>
                                <button
                                    onClick={() => handleDownloadCert('png')}
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition-all shadow-lg flex items-center gap-2 uppercase tracking-widest"
                                >
                                    <Download size={16} />
                                    Download PNG
                                </button>
                                <button
                                    onClick={() => setViewingCert(null)}
                                    className="p-2.5 rounded-xl bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white transition-all border border-slate-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div
                                id="certificate-node"
                                className="relative bg-[#0b1120] border-2 border-slate-800 rounded-3xl p-4 md:p-6 shadow-2xl overflow-hidden self-center w-full max-w-3xl flex flex-col items-center text-center mx-auto"
                            >
                                <div className="relative z-10 w-full">
                                    <div
                                        ref={certificateSurfaceRef}
                                        data-certificate-surface="true"
                                        className="relative w-full h-[46vh] min-h-[420px] max-h-[780px] rounded-2xl border border-slate-700 bg-[#0f172a] overflow-hidden"
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
                                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 text-slate-300 text-xs font-bold uppercase tracking-widest px-6 text-center">
                                                        Template file attached: {viewingCert.template.fileName || "Document"}
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {(() => {
                                            const layout = getResolvedCertificateLayout(viewingCert, defaultTemplate);
                                            const issueDateText = new Date(viewingCert.issueDate || viewingCert.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                                            const completionDateText = viewingCert.completionDate
                                                ? new Date(viewingCert.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                                                : '';

                                            const renderTextField = (key, text) => {
                                                const cfg = layout[key];
                                                if (!cfg?.enabled || !text) return null;
                                                return (
                                                    <div
                                                        key={key}
                                                        className="absolute pointer-events-none"
                                                        style={getFieldDomStyle(key, cfg, certificateMetrics)}
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
                                                            className="absolute -translate-x-1/2 -translate-y-1/2 bg-white p-1"
                                                            style={{
                                                                ...getFieldPositionStyle(layout.qrCode, certificateMetrics, "center"),
                                                                width: `${getQrSizePx(layout.qrCode, certificateMetrics)}px`,
                                                                height: `${getQrSizePx(layout.qrCode, certificateMetrics)}px`
                                                            }}
                                                        >
                                                            <QRCodeSVG
                                                                value={`https://www.mentriqtechnologies.in/verify-certificate?id=${viewingCert.certificateId}`}
                                                                size={getQrSizePx(layout.qrCode, certificateMetrics) - 8}
                                                                level="H"
                                                                includeMargin={false}
                                                            />
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
