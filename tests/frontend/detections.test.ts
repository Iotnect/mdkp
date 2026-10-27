import { test } from 'node:test';
import assert from 'node:assert/strict';
import { averageConfidence, buildDetectionCsv, captureDate, captureTime } from '../../resources/js/lib/detections.ts';
import type { Detection } from '../../resources/js/types.ts';

function detection(overrides: Partial<Detection> = {}): Detection {
    return { id: 1, plate: 'NDF 8214', camera: 'CAM-01', location: 'Test location', vehicle: 'Sedan', confidence: 99.2, status: 'Pending', watchlisted: false, captured_at: '2026-10-23T02:42:16.000000Z', notes: null, updated_at: '2026-10-23T02:42:16.000000Z', ...overrides };
}

test('capture times use Malaysia time across the UTC date boundary', () => {
    const record = detection({ captured_at: '2026-10-23T18:05:09.000000Z' });
    assert.equal(captureDate(record), '2026-10-24');
    assert.equal(captureTime(record), '02:05:09');
});

test('confidence averages are formatted consistently for empty and populated datasets', () => {
    assert.equal(averageConfidence([]), '0.0');
    assert.equal(averageConfidence([detection({ confidence: 98 }), detection({ confidence: 99 })]), '98.5');
});

test('CSV includes review state and captures in Malaysia time', () => {
    const csv = buildDetectionCsv([detection({ status: 'Verified', watchlisted: true })]);
    assert.ok(csv.includes('"Verified","Yes","2026-10-23 10:42:16"'));
    assert.equal(csv.split('\r\n').length, 2);
});

test('CSV escapes quotes and neutralises spreadsheet formulas in review notes', () => {
    const csv = buildDetectionCsv([detection({ notes: '=SUM(1,2)', location: 'Gate "A"' })]);
    assert.ok(csv.includes('"Gate ""A"""'));
    assert.ok(csv.includes('"\'=SUM(1,2)"'));
});
