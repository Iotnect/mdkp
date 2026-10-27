import { useEffect, useState } from 'react';
import { BadgeCheck, Ban, ScanLine } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ActionButton } from '@/components/workspace-ui';
import { captureTime, dateLabel } from '@/lib/detections';
import type { Detection, ReviewStatus } from '@/types';

export function EvidenceDialog({ record, url, onClose, onSaved }: { record: Detection | null; url?: string; onClose: () => void; onSaved: (record: Detection) => void }) {
    const [notes, setNotes] = useState(''), [error, setError] = useState(''), [saving, setSaving] = useState(false);
    useEffect(() => { setNotes(record?.notes || ''); setError(''); }, [record?.id]);
    async function save(status: ReviewStatus) {
        if (!record || !url) return;
        setSaving(true); setError('');
        try {
            const tokenCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('XSRF-TOKEN='));
            const token = tokenCookie ? decodeURIComponent(tokenCookie.slice('XSRF-TOKEN='.length)) : '';
            const response = await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': token }, body: JSON.stringify({ status, notes }) });
            if (response.status === 401 || response.status === 419) throw new Error('Your session has expired. Refresh the page and sign in again.');
            const result = await response.json();
            if (!response.ok) throw new Error(Object.values(result.errors || {}).flat().join(' ') || 'Unable to save the review.');
            onSaved(result as Detection); onClose(); toast.success(`${record.plate} ${status.toLowerCase()}. Review saved.`);
        } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to save this review.'); }
        finally { setSaving(false); }
    }
    return <Dialog open={!!record} onOpenChange={open => { if (!open && !saving) onClose(); }}><DialogContent className="react-dialog max-h-[calc(100svh-32px)] overflow-y-auto rounded-3xl border-border bg-[var(--surface)] p-[26px]" onInteractOutside={event => { if (saving) event.preventDefault(); }} onEscapeKeyDown={event => { if (saving) event.preventDefault(); }}><DialogHeader><div className="modal-title-row"><span className="monitor-icon"><ScanLine /></span><div><DialogTitle className="text-2xl">{record?.plate}</DialogTitle><DialogDescription>Plate detection · supporting evidence</DialogDescription></div></div></DialogHeader>{record && <><div className="detail-grid"><div className="evidence"><img className="evidence-image" src="/assets/vehicle-demo.jpg" alt="Illustrative vehicle photograph, not actual camera evidence" /><div className="evidence-overlay"><div className="evidence-tags"><span>DEMO IMAGE</span><span>{record.camera}</span></div><div className="ocr-frame"><span>PLATE RECOGNITION SAMPLE</span><strong>{record.plate}</strong></div><span>Illustrative preview · no live OCR connected</span></div></div><div className="detail-stack"><div className="detail-block"><h3>Detection details</h3><div className="detail-list">{[['Evidence ID',`MDKP-${String(record.id).padStart(5,'0')}`],['Review status',record.status],['Location',record.location],['Camera',record.camera],['Captured at',`${dateLabel(record)} ${captureTime(record)} MYT`],['OCR confidence',`${record.confidence}%`]].map(([label,value]) => <div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div></div><div className="detail-block"><Label htmlFor="review-notes" className="mb-3">Review notes</Label><Textarea id="review-notes" className="field notes" maxLength={2000} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Add your review notes..." disabled={saving} /></div></div></div>{error && <p className="review-error" role="alert">{error}</p>}<div className="modal-actions"><ActionButton primary disabled={saving} onClick={() => save('Verified')}><BadgeCheck />{saving ? 'Saving…' : 'Verify & save evidence'}</ActionButton><ActionButton className="text-destructive" disabled={saving} onClick={() => save('Dismissed')}><Ban />Dismiss detection</ActionButton></div></>}</DialogContent></Dialog>;
}
