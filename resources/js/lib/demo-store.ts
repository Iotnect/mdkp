import type { Detection, ReviewInput } from '../types.ts';

type BrowserStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const recordsKey = 'design-demo-records-v1';
const sessionKey = 'design-demo-session-v1';
const statuses = ['Pending', 'Verified', 'Dismissed'];

export function sampleDetections(): Detection[] {
    const plates = ['NDF 8214', 'VKL 3098', 'NCW 5521', 'WXY 1806', 'JTR 7290', 'NDA 4682', 'BQM 9012', 'NCK 2338', 'VBP 6571', 'NCS 1184', 'WTD 8823', 'NDL 4509'];
    return plates.map((plate, index) => {
        const captured = new Date(Date.UTC(2026, 9, 23, 2, 42 - index * 3, (index * 7 + 16) % 60)).toISOString();
        return { id: index + 1, plate, camera: `CAM-0${index % 4 + 1}`, location: ['Jalan Dato Undang', 'Dataran Kuala Pilah', 'Jalan Seremban', 'Pasar Awam Kuala Pilah'][index % 4], vehicle: ['Sedan', 'SUV', 'Hatchback', 'Sedan'][index % 4], confidence: [99.2, 98.7, 87.4, 99.6, 96.8, 99.1][index % 6], status: index % 3 === 2 ? 'Pending' : 'Verified', watchlisted: index === 1 || index === 7, captured_at: captured, updated_at: captured, notes: 'Illustrative demo capture. No live camera or OCR service connected.' };
    });
}

export function loadDemoRecords(storage: BrowserStorage): Detection[] {
    const samples = sampleDetections();
    try {
        const saved: unknown = JSON.parse(storage.getItem(recordsKey) || 'null');
        if (!Array.isArray(saved) || saved.length !== samples.length) { return samples; }
        return samples.map(sample => {
            const matching = saved.filter(item => item && item.id === sample.id);
            if (matching.length !== 1) { throw new Error('Invalid demo data.'); }
            const review = matching[0];
            if (!statuses.includes(review.status) || !(review.notes === null || typeof review.notes === 'string' && review.notes.length <= 2000) || typeof review.updated_at !== 'string' || !Number.isFinite(Date.parse(review.updated_at))) { throw new Error('Invalid demo review.'); }
            return { ...sample, status: review.status, notes: review.notes, updated_at: review.updated_at };
        });
    } catch { return samples; }
}

export function saveDemoReview(storage: BrowserStorage, id: number, input: ReviewInput): Detection {
    if (!statuses.includes(input.status) || typeof input.notes !== 'string' || input.notes.length > 2000) { throw new Error('Choose a valid decision and keep notes within 2,000 characters.'); }
    const records = loadDemoRecords(storage);
    const record = records.find(item => item.id === id);
    if (!record) { throw new Error('This evidence record could not be found.'); }
    const updated = { ...record, ...input, updated_at: new Date().toISOString() };
    storage.setItem(recordsKey, JSON.stringify(records.map(item => item.id === id ? updated : item)));
    return updated;
}

export function resetDemoRecords(storage: BrowserStorage): Detection[] {
    const records = sampleDetections();
    storage.setItem(recordsKey, JSON.stringify(records));
    return records;
}

export function hasDemoSession(session: BrowserStorage, persistent: BrowserStorage): boolean {
    return session.getItem(sessionKey) === 'active' || persistent.getItem(sessionKey) === 'active';
}

export function signOutDemo(session: BrowserStorage, persistent: BrowserStorage): void {
    session.removeItem(sessionKey);
    persistent.removeItem(sessionKey);
}

// This is a public design-demo gate, not server-side authentication.
export function signInDemo(session: BrowserStorage, persistent: BrowserStorage, username: string, password: string, remember: boolean): boolean {
    if (username !== 'admin' || password !== 'admin123') { return false; }
    signOutDemo(session, persistent);
    (remember ? persistent : session).setItem(sessionKey, 'active');
    return true;
}
