import { ArrowUpRight, CarFront, Camera, ScanLine, ShieldAlert, BadgeCheck, ChartNoAxesCombined, BellRing, CircleAlert, Focus, FolderCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { ActionButton, Metric, Panel, PanelHeading, PageHeading } from '@/components/workspace-ui';
import { averageConfidence, captureDate, captureTime } from '@/lib/detections';
import type { Detection, WorkspacePage } from '@/types';

export function RecentAlerts({ records, onEvidence }: { records: Detection[]; onEvidence: (record: Detection) => void }) {
    const ordered = [...records].sort((a, b) => Number(b.watchlisted) - Number(a.watchlisted) || Number(b.status === 'Pending') - Number(a.status === 'Pending'));
    return <div className="activity-list">{ordered.slice(0, 4).map(record => <button type="button" key={record.id} className="activity-item" onClick={() => onEvidence(record)}><span className={`activity-icon ${record.watchlisted ? '' : record.status === 'Pending' ? 'amber' : 'green'}`}>{record.watchlisted ? <ShieldAlert /> : record.status === 'Pending' ? <ScanLine /> : <BadgeCheck />}</span><div><strong>{record.plate}</strong><small>{record.watchlisted ? 'Watchlist match' : record.status === 'Pending' ? 'Awaiting review' : 'Evidence verified'} · {record.location}</small></div><span className="activity-time">{captureTime(record).slice(0, 5)}</span></button>)}</div>;
}

export function DetectionChart({ records }: { records: Detection[] }) {
    const captured = Array<number>(7).fill(0), verified = Array<number>(7).fill(0);
    records.forEach(record => {
        const date = captureDate(record);
        if (date >= '2026-10-19' && date <= '2026-10-25') {
            const day = Number(date.slice(-2)) - 19;
            captured[day]++;
            if (record.status === 'Verified') verified[day]++;
        }
    });
    const max = Math.max(1, ...captured);
    function curve(values: number[]) {
        const points = values.map((value, index) => [index * 700 / 6, 165 - value / max * 120]);
        return points.slice(1).reduce((path, point, index) => {
            const previous = points[index], middle = (point[0] + previous[0]) / 2;
            return `${path} C${middle} ${previous[1]} ${middle} ${point[1]} ${point[0]} ${point[1]}`;
        }, `M${points[0][0]} ${points[0][1]}`);
    }
    return <><div className="chart react-chart"><svg viewBox="0 0 700 180" preserveAspectRatio="none" role="img" aria-label={`Sample week: ${captured.reduce((a,b) => a+b,0)} captures; ${verified.reduce((a,b) => a+b,0)} verified`}><defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7457d9" stopOpacity=".28" /><stop offset="1" stopColor="#7457d9" stopOpacity="0" /></linearGradient></defs><path d={`${curve(captured)} L700 180 L0 180Z`} fill="url(#chartFill)" /><path d={curve(captured)} fill="none" stroke="#7457d9" strokeWidth="4" strokeLinecap="round" /><path d={curve(verified)} fill="none" stroke="#d28b26" strokeWidth="3" strokeLinecap="round" strokeDasharray="7 7" /></svg></div><div className="chart-labels">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(day => <span key={day}>{day}</span>)}</div></>;
}

export function Overview({ records, onNavigate, onEvidence, onExport }: { records: Detection[]; onNavigate: (page: WorkspacePage) => void; onEvidence: (record: Detection) => void; onExport: () => void }) {
    const pending = records.filter(record => record.status === 'Pending').length;
    const verified = records.filter(record => record.status === 'Verified').length;
    const modules = [
        { page: 'detections' as const, icon: ScanLine, title: 'Plate detection', description: 'AI vehicle plate recognition', value: records.length, meta: `${pending} pending review` },
        { page: 'evidence' as const, icon: FolderCheck, title: 'Evidence review', description: 'Captured images and verification records', value: verified, meta: 'verified records' },
        { page: 'cameras' as const, icon: Focus, title: 'Camera monitoring', description: 'Camera zone plate recognition', value: 4, meta: 'sample cameras' },
        { page: 'watchlist' as const, icon: ShieldAlert, title: 'Vehicle watchlist', description: 'Flagged vehicles and detection matches', value: records.filter(record => record.watchlisted).length, meta: 'watchlist matches' },
    ];
    return <><PageHeading label="Demo operations" title="Hello, admin." description="Here's what is happening across Kuala Pilah in this demo workspace." onExport={onExport} /><div className="metric-grid"><Metric label="Plates captured" value={records.length} description="Stored in the database" icon={CarFront} tone="good" /><Metric label="Camera locations" value="4/4" description="Demo camera coverage" icon={Camera} /><Metric label="Pending review" value={pending} description="Requires verification" icon={CircleAlert} tone="alert" /><Metric label="OCR confidence" value={`${averageConfidence(records)}%`} description="Average sample confidence" icon={BadgeCheck} tone="good" /></div><div className="monitor-grid">{modules.map(module => <Card key={module.page} className="monitor-card gap-0 rounded-[19px] p-[19px] shadow-[var(--shadow)]"><button type="button" className="w-full cursor-pointer text-left" onClick={() => onNavigate(module.page)}><div className="monitor-card__top"><span className="monitor-icon"><module.icon /></span><span className="chevron"><ArrowUpRight className="size-6" /></span></div><h3>{module.title}</h3><p>{module.description}</p><div className="monitor-meta"><strong>{module.value}</strong><span>{module.meta}</span></div></button></Card>)}</div><div className="dashboard-grid"><Panel><PanelHeading icon={ChartNoAxesCombined} title="Detection activity" description="Sample week · 19–25 October 2026"><div className="legend"><span><i />Captured</span><span><i />Verified</span></div></PanelHeading><DetectionChart records={records} /></Panel><Panel><PanelHeading icon={BellRing} title="Recent alerts" description="Latest AI-detected events"><ActionButton className="small" onClick={() => onNavigate('detections')}>View all</ActionButton></PanelHeading><RecentAlerts records={records} onEvidence={onEvidence} /></Panel></div></>;
}
