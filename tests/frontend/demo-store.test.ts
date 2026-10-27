import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasDemoSession, loadDemoRecords, resetDemoRecords, sampleDetections, saveDemoReview, signInDemo, signOutDemo } from '../../resources/js/lib/demo-store.ts';

function storage() {
    const values = new Map<string, string>();
    return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
}

test('sample dataset has twelve distinct plates, four cameras and two watchlist matches', () => {
    const records = sampleDetections();
    assert.equal(new Set(records.map(record => record.plate)).size, 12);
    assert.equal(new Set(records.map(record => record.camera)).size, 4);
    assert.equal(records.filter(record => record.status === 'Pending').length, 4);
    assert.equal(records.filter(record => record.watchlisted).length, 2);
});

test('reviews survive reload and reset restores original sample evidence', () => {
    const saved = storage();
    const result = saveDemoReview(saved, 3, { status: 'Dismissed', notes: 'Plate obscured.' });
    assert.equal(loadDemoRecords(saved)[2].notes, 'Plate obscured.');
    assert.equal(loadDemoRecords(saved)[2].status, 'Dismissed');
    assert.equal(result.updated_at, loadDemoRecords(saved)[2].updated_at);
    resetDemoRecords(saved);
    assert.deepEqual(loadDemoRecords(saved), sampleDetections());
});

test('corrupt or tampered storage falls back to fixed sample captures', () => {
    const saved = storage();
    saved.setItem('design-demo-records-v1', '{broken');
    assert.deepEqual(loadDemoRecords(saved), sampleDetections());
    const modified = sampleDetections();
    modified[0].plate = 'CHANGED';
    saved.setItem('design-demo-records-v1', JSON.stringify(modified));
    assert.equal(loadDemoRecords(saved)[0].plate, 'NDF 8214');
    modified[1].id = modified[0].id;
    saved.setItem('design-demo-records-v1', JSON.stringify(modified));
    assert.deepEqual(loadDemoRecords(saved), sampleDetections());
});

test('invalid reviews cannot modify saved evidence and write failures are reported', () => {
    const saved = storage();
    assert.throws(() => saveDemoReview(saved, 999, { status: 'Verified', notes: '' }));
    assert.throws(() => saveDemoReview(saved, 1, { status: 'Verified', notes: 'x'.repeat(2001) }));
    assert.deepEqual(loadDemoRecords(saved), sampleDetections());
    assert.throws(() => saveDemoReview({ ...saved, setItem: () => { throw new Error('Storage full'); } }, 1, { status: 'Dismissed', notes: 'test' }), /Storage full/);
});

test('simulated login rejects incorrect credentials, supports remember and clears both sessions on logout', () => {
    const session = storage(), persistent = storage();
    assert.equal(signInDemo(session, persistent, 'admin', 'wrong', false), false);
    assert.equal(hasDemoSession(session, persistent), false);
    assert.equal(signInDemo(session, persistent, 'admin', 'admin123', false), true);
    assert.equal(hasDemoSession(session, persistent), true);
    assert.equal(hasDemoSession(storage(), persistent), false);
    signInDemo(session, persistent, 'admin', 'admin123', true);
    assert.equal(hasDemoSession(storage(), persistent), true);
    signOutDemo(session, persistent);
    assert.equal(hasDemoSession(session, persistent), false);
});
