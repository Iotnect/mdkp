import { useState, type FormEvent } from 'react';
import { createRoot } from 'react-dom/client';
import { DashboardView } from '@/components/dashboard-view';
import { LoginView, type LoginData } from '@/components/login-view';
import { hasDemoSession, loadDemoRecords, resetDemoRecords, sampleDetections, saveDemoReview, signInDemo, signOutDemo } from '@/lib/demo-store';
import '../css/app.css';

function DemoApp() {
    const [authenticated, setAuthenticated] = useState(() => {
        try { return hasDemoSession(sessionStorage, localStorage); } catch { return false; }
    });
    const [records, setRecords] = useState(() => {
        try { return loadDemoRecords(localStorage); } catch { return sampleDetections(); }
    });
    const [data, setData] = useState<LoginData>({ username: '', password: '', remember: false });
    const [error, setError] = useState('');
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            if (!signInDemo(sessionStorage, localStorage, data.username, data.password, data.remember)) {
                setError('The username or password is incorrect.');
                setData(current => ({ ...current, password: '' }));
                return;
            }
            setData({ username: '', password: '', remember: false });
            setError('');
            window.history.replaceState(null, '', '/dashboard');
            setAuthenticated(true);
        } catch { setError('Enable browser storage to use this interactive demo.'); }
    }
    if (!authenticated) {
        return <LoginView data={data} onChange={(key, value) => setData(current => ({ ...current, [key]: value }))} onSubmit={submit} processing={false} error={error} status="Design demo. Login is simulated; sample evidence is saved in this browser only." />;
    }
    return <DashboardView detections={records} onSaveReview={async (record, input) => saveDemoReview(localStorage, record.id, input)} onResetDemo={() => setRecords(resetDemoRecords(localStorage))} onLogout={() => {
        signOutDemo(sessionStorage, localStorage);
        window.history.replaceState(null, '', '/login');
        setAuthenticated(false);
    }} />;
}

createRoot(document.getElementById('root')!).render(<DemoApp />);
