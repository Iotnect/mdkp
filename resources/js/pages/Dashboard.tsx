import { Head, router } from '@inertiajs/react';
import { useEffect, useState, type ReactNode } from 'react';
import { Bell, Camera, ChartNoAxesCombined, FolderCheck, History, LayoutDashboard, LogOut, Menu, ScanLine, Settings2, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Toaster } from '@/components/ui/sonner';
import { usePreferences } from '@/hooks/use-preferences';
import { Overview, RecentAlerts } from '@/components/overview';
import { DetectionTable } from '@/components/detection-table';
import { EvidenceLibrary } from '@/components/evidence-library';
import { CameraMonitoring } from '@/components/camera-monitoring';
import { EvidenceDialog } from '@/components/evidence-dialog';
import { Reports, ReviewActivity, Settings } from '@/components/management-pages';
import { exportRecords } from '@/lib/detections';
import type { DashboardProps, Detection, WorkspacePage } from '@/types';

const titles: Record<WorkspacePage, string> = { overview:'Command overview',detections:'Plate detection',evidence:'Evidence review',cameras:'Camera monitoring',watchlist:'Vehicle watchlist',activity:'Review activity',reports:'Reports',settings:'Settings' };
const navigation = [
    { section:'Workspace',items:[{ page:'overview' as const,label:'Overview',icon:LayoutDashboard }] },
    { section:'Monitoring',items:[{ page:'detections' as const,label:'Plate Detection',icon:ScanLine },{ page:'evidence' as const,label:'Evidence Review',icon:FolderCheck },{ page:'cameras' as const,label:'Camera Monitoring',icon:Camera },{ page:'watchlist' as const,label:'Vehicle Watchlist',icon:ShieldAlert }] },
    { section:'Management',items:[{ page:'activity' as const,label:'Review Activity',icon:History },{ page:'reports' as const,label:'Reports',icon:ChartNoAxesCombined },{ page:'settings' as const,label:'Settings',icon:Settings2 }] },
];
function readPage(): WorkspacePage { const hash = window.location.hash.slice(1); return Object.hasOwn(titles,hash) ? hash as WorkspacePage : 'overview'; }

export default function Dashboard({ detections, urls }: DashboardProps) {
    const [records, setRecords] = useState(detections), [page, setPage] = useState<WorkspacePage>(readPage), [mobileOpen, setMobileOpen] = useState(false), [notificationsOpen, setNotificationsOpen] = useState(false), [selectedId, setSelectedId] = useState<number | null>(null);
    const preferences = usePreferences();
    const pending = records.filter(record => record.status === 'Pending').length;
    const selected = records.find(record => record.id === selectedId) || null;
    useEffect(() => setRecords(detections),[detections]);
    useEffect(() => { const handle = () => setPage(readPage()); window.addEventListener('hashchange',handle); return () => window.removeEventListener('hashchange',handle); },[]);
    function navigate(next: WorkspacePage) { setPage(next); window.history.pushState(null,'',`#${next}`); setMobileOpen(false); setNotificationsOpen(false); window.scrollTo({ top:0 }); }
    function openEvidence(record: Detection) { setSelectedId(record.id); setNotificationsOpen(false); }
    function exportAll() { exportRecords(records) ? toast.success('Report exported.') : toast.info('No records to export.'); }
    const sidebar = <><a className="brand" href="#overview" onClick={event => { event.preventDefault(); navigate('overview'); }} aria-label="Majlis Daerah Kuala Pilah dashboard"><span className="brand-mark brand-mark--logo"><img src="/assets/mdkp-logo.png" alt="Majlis Daerah Kuala Pilah crest" /></span><span><strong className="council-name">Majlis Daerah<br />Kuala Pilah</strong></span></a><nav className="nav" aria-label="Primary navigation">{navigation.map(group => <div key={group.section}><p className="nav-label">{group.section}</p>{group.items.map(item => <Button key={item.page} variant="ghost" className={`nav-link h-auto justify-start rounded-[13px] p-0 px-3 hover:bg-[var(--purple-pale)] ${page === item.page ? 'active' : ''}`} aria-current={page === item.page ? 'page' : undefined} onClick={() => navigate(item.page)}><item.icon /><span>{item.label}</span>{item.page === 'detections' && <b className="nav-count">{records.length}</b>}{item.page === 'evidence' && <b className="nav-count amber">{pending}</b>}</Button>)}</div>)}</nav><div className="system-card"><div className="system-card__head"><span>System health</span><span className="live-dot" /></div><strong>Demo workspace operational</strong><div className="health-bar"><i /></div><small>4 sample cameras · no live feeds</small></div><Button variant="ghost" className="profile-mini h-auto w-full justify-start text-[var(--ink)]" aria-label="Sign out" onClick={() => router.post(urls.logout)}><img className="avatar" src="/assets/user-avatar.svg" alt="User profile" /><span><strong>Admin</strong><small>Enforcement Officer</small></span><LogOut className="size-5" /></Button></>;
    let content: ReactNode;
    switch (page) {
        case 'detections': content = <DetectionTable key="detections" records={records} defaultCamera={preferences.camera} onEvidence={openEvidence} />; break;
        case 'watchlist': content = <DetectionTable key="watchlist" records={records} watchlist defaultCamera="" onEvidence={openEvidence} />; break;
        case 'evidence': content = <EvidenceLibrary records={records} onEvidence={openEvidence} onExport={exportAll} />; break;
        case 'cameras': content = <CameraMonitoring records={records} onEvidence={openEvidence} onDetections={() => navigate('detections')} onExport={exportAll} />; break;
        case 'activity': content = <ReviewActivity records={records} onEvidence={openEvidence} onExport={exportAll} />; break;
        case 'reports': content = <Reports records={records} />; break;
        case 'settings': content = <Settings dark={preferences.dark} onDarkChange={preferences.setDark} defaultCamera={preferences.camera} onSaveCamera={preferences.saveCamera} />; break;
        default: content = <Overview records={records} onNavigate={navigate} onEvidence={openEvidence} onExport={exportAll} />;
    }
    return <><Head title={titles[page]} /><div className="app-shell"><aside className="sidebar">{sidebar}</aside><div className="workspace"><header className="topbar"><Sheet open={mobileOpen} onOpenChange={setMobileOpen}><SheetTrigger asChild><Button variant="outline" className="shell-mobile-trigger icon-button" aria-label="Toggle menu"><Menu /></Button></SheetTrigger><SheetContent side="left" className="w-[264px] gap-0 border-r bg-[var(--surface)] px-[18px] py-6"><SheetHeader className="sr-only"><SheetTitle>Navigation</SheetTitle><SheetDescription>Municipal command centre workspace navigation.</SheetDescription></SheetHeader><div className="flex h-full min-h-0 flex-col">{sidebar}</div></SheetContent></Sheet><div className="topbar-title"><span className="eyebrow">MDKP · Kuala Pilah</span><strong>{titles[page]}</strong></div><div className="topbar-actions"><div className="shift-chip"><span className="live-dot" /><span><small>Demo snapshot</small><strong>23 Oct · 10:42 MYT</strong></span></div><Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}><PopoverTrigger asChild><Button variant="outline" className="icon-button notification-button" aria-label="Notifications"><Bell className="size-6" /><i>{pending}</i></Button></PopoverTrigger><PopoverContent align="end" className="w-[min(390px,calc(100vw-32px))] rounded-[20px] bg-[var(--surface)] p-5"><h2 className="mb-4 font-bold">Recent alerts</h2><RecentAlerts records={records} onEvidence={openEvidence} /></PopoverContent></Popover><span className="date-chip">{new Date().toLocaleDateString('en-GB',{ timeZone:'Asia/Kuala_Lumpur',weekday:'short',day:'2-digit',month:'short',year:'numeric' })}</span></div></header><main id="workspace-content"><section className="page" key={page}>{content}</section></main></div></div><EvidenceDialog record={selected} url={selected ? urls.updates[String(selected.id)] : undefined} onClose={() => setSelectedId(null)} onSaved={updated => setRecords(current => current.map(record => record.id === updated.id ? updated : record))} /><Toaster theme={preferences.dark ? 'dark' : 'light'} richColors closeButton position="bottom-right" /></>;
}
