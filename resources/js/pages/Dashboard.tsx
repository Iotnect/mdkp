import { router } from '@inertiajs/react';
import { DashboardView } from '@/components/dashboard-view';
import { saveReviewToServer } from '@/lib/review-api';
import type { DashboardProps } from '@/types';

export default function Dashboard({ detections, urls }: DashboardProps) {
    return <DashboardView
        detections={detections}
        onLogout={() => router.post(urls.logout)}
        onSaveReview={(record, input) => saveReviewToServer(urls.updates[String(record.id)], input)}
    />;
}
