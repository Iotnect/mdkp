import type { Detection } from '@/types';

export function evidenceImage(record: Detection): string {
    return `/cctv_demo/evidence-${(record.id - 1) % 2 + 1}.png`;
}

export function captureDate(record: Detection) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kuala_Lumpur', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(record.captured_at));
}

export function captureTime(record: Detection) {
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(new Date(record.captured_at));
}

export function dateLabel(record: Detection) {
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuala_Lumpur', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(record.captured_at));
}

export function averageConfidence(records: Detection[]) {
    return records.length ? (records.reduce((sum, record) => sum + record.confidence, 0) / records.length).toFixed(1) : '0.0';
}

export function buildDetectionCsv(records: Detection[]) {
    const cell = (value: unknown) => `"${String(value ?? '').replace(/^[=+@\-\t\r]/, "'$&").replace(/"/g, '""')}"`;
    const rows: unknown[][] = [['Evidence ID', 'Plate', 'Camera', 'Location', 'Vehicle', 'Confidence (%)', 'Status', 'Watchlist', 'Captured at (MYT)', 'Review notes']];
    records.forEach((record) => rows.push([record.id, record.plate, record.camera, record.location, record.vehicle, record.confidence, record.status, record.watchlisted ? 'Yes' : 'No', `${captureDate(record)} ${captureTime(record)}`, record.notes]));
    return '\uFEFF' + rows.map(row => row.map(cell).join(',')).join('\r\n');
}

export function exportRecords(records: Detection[], name = 'detections') {
    if (!records.length) return false;
    const link = document.createElement('a');
    const url = URL.createObjectURL(new Blob([buildDetectionCsv(records)], { type: 'text/csv;charset=utf-8;' }));
    link.href = url;
    link.download = `${name}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
}
