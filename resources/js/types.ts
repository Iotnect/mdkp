export type ReviewStatus = 'Pending' | 'Verified' | 'Dismissed';

export interface Detection {
    id: number;
    plate: string;
    camera: string;
    location: string;
    vehicle: string;
    confidence: number;
    status: ReviewStatus;
    watchlisted: boolean;
    captured_at: string;
    notes: string | null;
    updated_at: string;
}

export type WorkspacePage = 'overview' | 'detections' | 'evidence' | 'cameras' | 'watchlist' | 'activity' | 'reports' | 'settings';

export interface DashboardProps {
    detections: Detection[];
    urls: { logout: string; updates: Record<string, string> };
}

export interface ReviewInput {
    status: ReviewStatus;
    notes: string;
}

export type SaveReview = (record: Detection, input: ReviewInput) => Promise<Detection>;
