import { API_BASE_URL } from "./apiClient";

/**
 * Resolves the image URL for a course.
 * @param {Object} course - The course object.
 * @returns {string} - The resolved image URL.
 */
export const resolveImageUrl = (path, fallback = "") => {
    if (!path || typeof path !== "string") return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("data:image/")) return path;

    const serverRoot = API_BASE_URL.replace(/\/api\/?$/, "");

    // Fix: Treat /images as frontend static assets (public folder), not backend
    if (path.startsWith("/images/")) return path;

    // Clean leading slashes and construct URL to avoid double slashes
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    const cleanRoot = serverRoot.endsWith("/") ? serverRoot.slice(0, -1) : serverRoot;

    return `${cleanRoot}/${cleanPath}`;
};

export const getCourseImageUrl = (course) => {
    if (!course) return "/images/learning4.jpg";

    const imagePath =
        course.thumbnailUrl ||
        course.thumbnail ||
        course.image ||
        course.imageUrl ||
        "";

    if (typeof imagePath === "string" && imagePath.trim()) {
        return resolveImageUrl(imagePath.trim(), "/images/learning4.jpg");
    }

    return "/images/learning4.jpg";
};
