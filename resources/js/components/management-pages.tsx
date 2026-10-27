import { useState, type FormEvent } from 'react';
import { Ban, BadgeCheck, Camera, Database, Download, History, Moon, Save, ScanLine } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ActionButton, FilterSelect, Panel, PanelHeading, PageHeading } from '@/components/workspace-ui';
import { captureDate, exportRecords } from '@/lib/detections';
import type { Detection } from '@/types';

export function Reports({ records }: { records: Detection[] }) {
    const reports = [{ type:'all',icon:ScanLine,title:'Plate detection',description:'Export recognised plates and detection evidence.' },{ type:'verified',icon:BadgeCheck,title:'Verified evidence',description:'Export verified captures and saved review decisions.' }];
    function submit(event: FormEvent<HTMLFormElement>, type: string) {
        event.preventDefault();
        const form = new FormData(event.currentTarget), from = String(form.get('from')), to = String(form.get('to'));
        if (from > to) { toast.error('The From date must be on or before the To date.'); return; }
        const selected = records.filter(record => captureDate(record) >= from && captureDate(record) <= to && (type !== 'verified' || record.status === 'Verified'));
        exportRecords(selected,type) ? toast.success(`Exported ${selected.length} sample records.`) : toast.info('No records to export.');
    }
    return <><PageHeading label="Management" title="Reports" description="Choose a report and export only the records within your selected date range." /><div className="report-grid">{reports.map(report => <Panel className="report-card grid grid-cols-1 items-center gap-5 min-[1200px]:grid-cols-[minmax(0,1fr)_auto]" key={report.type}><div className="report-card__heading min-w-0"><span className="report-icon"><report.icon className="size-6" /></span><div><h2>{report.title}</h2><p>{report.description}</p></div></div><form className="report-export-form flex flex-col items-stretch gap-3 sm:flex-row sm:items-end" onSubmit={event => submit(event, report.type)}><div className="report-date-range grid grid-cols-1 gap-3 sm:grid-cols-2"><Label className="grid gap-1"><span>From</span><Input className="field h-11 min-w-0 w-full sm:w-[154px]" name="from" type="date" defaultValue="2026-10-19" required /></Label><Label className="grid gap-1"><span>To</span><Input className="field h-11 min-w-0 w-full sm:w-[154px]" name="to" type="date" defaultValue="2026-10-25" required /></Label></div><ActionButton primary type="submit"><Download /> Export</ActionButton></form></Panel>)}</div></>;
}

export function ReviewActivity({ records, onEvidence, onExport }: { records: Detection[]; onEvidence: (record: Detection) => void; onExport: () => void }) {
    const reviewed = records.filter(record => record.status !== 'Pending').sort((a,b) => b.updated_at.localeCompare(a.updated_at));
    return <><PageHeading label="Management" title="Review activity" description="Saved evidence decisions and review notes." onExport={onExport} /><Panel><PanelHeading icon={History} title="Review decisions" description="Current saved decisions, ordered by latest update. Not a full audit trail." /><div className="activity-list">{reviewed.map(record => <button className="activity-item" key={record.id} onClick={() => onEvidence(record)}><span className={`activity-icon ${record.status === 'Verified' ? 'green' : 'amber'}`}>{record.status === 'Verified' ? <BadgeCheck /> : <Ban />}</span><div><strong>{record.plate} · {record.status}</strong><small className="activity-notes">{record.notes || 'No notes recorded.'}</small></div><span className="activity-time">{new Date(record.updated_at).toLocaleDateString('en-GB',{ timeZone:'Asia/Kuala_Lumpur' })}</span></button>)}{!reviewed.length && <p className="empty-state">No decisions have been saved yet.</p>}</div></Panel></>;
}

export function Settings({ dark, onDarkChange, defaultCamera, onSaveCamera, onResetDemo }: { dark: boolean; onDarkChange: (dark: boolean) => void; defaultCamera: string; onSaveCamera: (camera: string) => void; onResetDemo?: () => void }) {
    const [camera, setCamera] = useState(defaultCamera);
    function save() { try { onSaveCamera(camera); toast.success('Dashboard preferences saved.'); } catch { toast.error('Browser storage is unavailable.'); } }
    return <><PageHeading label="Management" title="Settings" description="Configure your dashboard appearance and preferences." /><div className="settings-grid"><Panel className="settings-card flex-row"><div className="settings-card__copy"><span className="settings-icon"><Moon /></span><div><h2>Dark mode</h2><p>Use a darker colour scheme throughout the dashboard.</p></div></div><div className="flex items-center gap-3"><Switch id="dark-mode" aria-label="Dark mode" checked={dark} onCheckedChange={onDarkChange} /><Label htmlFor="dark-mode" className="theme-switch__state">{dark ? 'On' : 'Off'}</Label></div></Panel><Panel className="settings-card flex-row"><div className="settings-card__copy"><span className="settings-icon"><Camera /></span><div><h2>Default camera</h2><p>Choose a camera to preselect when opening plate detection.</p></div></div><div className="w-44"><FilterSelect label="Default camera" value={camera} onChange={setCamera} placeholder="All cameras" options={['CAM-01','CAM-02','CAM-03','CAM-04']} /></div></Panel><Panel className="settings-card flex-row"><div className="settings-card__copy"><span className="settings-icon"><Database /></span><div><h2>OCR & evidence storage</h2><p>{onResetDemo ? 'Sample captures and review notes are saved in this browser only. Changes are not shared between devices.' : 'Demo captures and review notes are stored in SQLite. Live OCR and cameras are not connected.'}</p></div></div><span className="review-pill">Demo</span></Panel><div className="flex gap-3">{onResetDemo && <ActionButton onClick={() => { if (window.confirm('Reset all sample evidence and review notes in this browser?')) { try { onResetDemo(); toast.success('Demo data reset.'); } catch { toast.error('Browser storage is unavailable.'); } } }}>Reset demo data</ActionButton>}<ActionButton primary onClick={save}><Save /> Save preferences</ActionButton></div></div></>;
}
