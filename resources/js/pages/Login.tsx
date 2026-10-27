import { useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { LoginView } from '@/components/login-view';

export default function Login({ status, urls }: { status: string | null; urls: { login: string } }) {
    const form = useForm({ username: '', password: '', remember: false });
    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post(urls.login, { onFinish: () => form.reset('password') });
    }
    return <LoginView data={form.data} onChange={form.setData} onSubmit={submit} processing={form.processing} status={status} error={Object.values(form.errors)[0]} />;
}
