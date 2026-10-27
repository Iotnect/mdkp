import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export interface LoginData {
    username: string;
    password: string;
    remember: boolean;
}

interface LoginViewProps {
    data: LoginData;
    onChange: <Key extends keyof LoginData>(key: Key, value: LoginData[Key]) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    processing: boolean;
    error?: string;
    status?: string | null;
}

export function LoginView({ data, onChange, onSubmit, processing, error, status }: LoginViewProps) {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        document.title = 'Sign in · Majlis Daerah Kuala Pilah';
        document.documentElement.dataset.theme = 'light';
        document.documentElement.classList.remove('dark');
        document.body.classList.add('login-body');
        return () => document.body.classList.remove('login-body');
    }, []);
    return <main className="login-shell"><section className="login-card">
        <div className="login-logo-panel"><img src="/assets/mdkp-logo.png" alt="Majlis Daerah Kuala Pilah crest" /></div>
        <div className="login-form-panel"><div className="login-form-heading login-form-heading--simple"><h1>Welcome back</h1><p>Sign in to continue to your dashboard.</p></div>
            <form onSubmit={onSubmit} className="login-form">
                {status && <p className="login-message" role="status">{status}</p>}
                {error && <p className="login-error" role="alert">{error}</p>}
                <div className="login-field"><Label htmlFor="username">Username</Label><div className="login-input-wrap"><UserRound className="size-5 shrink-0 text-muted-foreground" /><Input id="username" aria-label="Username" autoComplete="username" placeholder="Enter your username" maxLength={100} required autoFocus value={data.username} onChange={event => onChange('username', event.target.value)} aria-invalid={!!error} className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" /></div></div>
                <div className="login-field"><Label htmlFor="password">Password</Label><div className="login-input-wrap"><LockKeyhole className="size-5 shrink-0 text-muted-foreground" /><Input id="password" aria-label="Password" type={visible ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" maxLength={255} required value={data.password} onChange={event => onChange('password', event.target.value)} className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" /><Button type="button" variant="ghost" size="icon-sm" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff /> : <Eye />}</Button></div></div>
                <div className="remember-control"><Checkbox id="remember" checked={data.remember} onCheckedChange={checked => onChange('remember', checked === true)} /><Label htmlFor="remember" className="cursor-pointer font-normal">Remember me</Label></div>
                <Button type="submit" className="login-submit h-auto rounded-[13px] text-white" disabled={processing}>{processing ? 'Signing in…' : 'Sign in'}<ArrowRight className="size-[19px]" /></Button>
            </form>
        </div>
    </section></main>;
}
