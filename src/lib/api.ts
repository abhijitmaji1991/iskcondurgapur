/**
 * Central API client for the ISKCON Durgapur Laravel backend.
 * All frontend pages use these helpers instead of raw fetch calls.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// ── Generic fetch helper ──────────────────────────────────────────────────
async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(err.message || `HTTP ${res.status}`);
    }

    return res.json();
}

// ── Events ────────────────────────────────────────────────────────────────
export interface ApiEvent {
    _id: string;
    title: string;
    date: string;
    time?: string;
    location?: string;
    description?: string;
    image?: string;
    category?: string;
    isFeatured?: boolean;
    organizer?: string;
}

export async function getEvents(params: Record<string, string> = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch<{ status: string; data: ApiEvent[]; meta?: object }>(`/events${qs ? `?${qs}` : ''}`);
}

export async function getEvent(id: string) {
    return apiFetch<{ status: string; data: ApiEvent }>(`/events/${id}`);
}

// ── Courses ───────────────────────────────────────────────────────────────
export interface ApiCourse {
    _id: string;
    title: string;
    tagline?: string;
    description?: string;
    image?: string;
    banner_color?: string;
    duration?: string;
    schedule?: string;
    start_date?: string;
    end_date?: string;
    instructor?: string;
    instructor_title?: string;
    level?: string;
    category?: string;
    rating?: number;
    enrolled_count?: number;
    max_seats?: number;
    featured?: boolean;
    price?: number | string;
    language?: string;
    location?: string;
    mode?: string;
    certificate?: boolean;
    status?: string;
    outcomes?: string[];
    prerequisites?: string[];
    curriculum?: object[];
    faqs?: { q: string; a: string }[];
}

export async function getCourses(params: Record<string, string> = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch<{ status: string; data: ApiCourse[]; meta?: object }>(`/courses${qs ? `?${qs}` : ''}`);
}

export async function getCourse(id: string) {
    return apiFetch<{ status: string; data: ApiCourse }>(`/courses/${id}`);
}

export async function registerForCourse(courseId: string, body: object) {
    return apiFetch(`/courses/${courseId}/register`, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

// ── Contact ───────────────────────────────────────────────────────────────
export async function submitContact(body: {
    name: string; email: string; phone?: string; subject: string; message: string;
}) {
    return apiFetch('/contact', { method: 'POST', body: JSON.stringify(body) });
}

// ── Donations ─────────────────────────────────────────────────────────────
export async function recordDonation(body: object) {
    return apiFetch('/donations', { method: 'POST', body: JSON.stringify(body) });
}

// ── Temples ───────────────────────────────────────────────────────────────
export interface ApiTemple {
    _id: string;
    name: string;
    location: string;
    country: string;
    description?: string;
    image?: string;
    phone?: string;
    website?: string;
}

export async function getTemples(params: Record<string, string> = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch<{ status: string; data: ApiTemple[] }>(`/temples${qs ? `?${qs}` : ''}`);
}

// ── Resources ─────────────────────────────────────────────────────────────
export interface ApiResource {
    _id: string;
    title: string;
    type: string;
    category: string;
    description?: string;
    url?: string;
    image?: string;
}

export async function getResources(params: Record<string, string> = {}) {
    const qs = new URLSearchParams(params).toString();
    return apiFetch<{ status: string; data: ApiResource[]; meta?: object }>(`/resources${qs ? `?${qs}` : ''}`);
}

// ── Dashboard (admin) ─────────────────────────────────────────────────────
export async function getDashboardStats() {
    return apiFetch<{ status: string; data: object }>('/dashboard/stats');
}

// ── Auth ──────────────────────────────────────────────────────────────────
export async function loginUser(username: string, password: string) {
    return apiFetch<{ status: string; token: string; user: object }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
}

export function logoutUser() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
}

export function getStoredUser() {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
}
