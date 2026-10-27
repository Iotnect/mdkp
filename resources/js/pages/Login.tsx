import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

export default function Login({ status, urls }: { status: string | null; urls: { login: string } }) {
    const [visible, setVisible] = useState(false);
    const form = useForm({ username: '', password: '', remember: false });
    useEffect(() => {
        document.documentElement.dataset.theme = 'light';
        document.documentElement.classList.remove('dark');
        document.body.classList.add('login-body');
        return () => document.body.classList.remove('login-body');
    }, []);
    function submit(event: FormEvent) {
        event.preventDefault();
        form.post(urls.login, { onFinish: () => form.reset('password') });
    }
    return <><Head title="Sign in" /><main className="login-shell"><section className="login-card"><div className="login-logo-panel"><img src="/assets/mdkp-logo.png" alt="Majlis Daerah Kuala Pilah crest" /></div><div className="login-form-panel"><div className="login-form-heading login-form-heading--simple"><h1>Welcome back</h1><p>Sign in to continue to your dashboard.</p></div><form onSubmit={submit} className="login-form">{status && <p className="login-message" role="status">{status}</p>}{Object.values(form.errors).length > 0 && <p className="login-error" role="alert">{Object.values(form.errors)[0]}</p>}<div className="login-field"><Label htmlFor="username">Username</Label><div className="login-input-wrap"><UserRound className="size-5 shrink-0 text-muted-foreground" /><Input id="username" aria-label="Username" autoComplete="username" placeholder="Enter your username" maxLength={100} required autoFocus value={form.data.username} onChange={event => form.setData('username', event.target.value)} aria-invalid={!!form.errors.username} className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" /></div></div><div className="login-field"><Label htmlFor="password">Password</Label><div className="login-input-wrap"><LockKeyhole className="size-5 shrink-0 text-muted-foreground" /><Input id="password" aria-label="Password" type={visible ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" maxLength={255} required value={form.data.password} onChange={event => form.setData('password', event.target.value)} className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" /><Button type="button" variant="ghost" size="icon-sm" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff /> : <Eye />}</Button></div></div><div className="remember-control"><Checkbox id="remember" checked={form.data.remember} onCheckedChange={checked => form.setData('remember', checked === true)} /><Label htmlFor="remember" className="cursor-pointer font-normal">Remember me</Label></div><Button type="submit" className="login-submit h-auto rounded-[13px] text-white" disabled={form.processing}>{form.processing ? 'Signing in…' : 'Sign in'}<ArrowRight className="size-[19px]" /></Button></form></div></section></main></>;
}
