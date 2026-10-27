import type { ComponentProps, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Detection } from '@/types';

export function ActionButton({ primary, className, ...props }: ComponentProps<typeof Button> & { primary?: boolean }) {
    return <Button variant={primary ? 'default' : 'outline'} className={cn('button h-auto rounded-xl py-0', primary ? 'primary text-white' : 'bg-[var(--surface)] text-[var(--ink)]', className)} {...props} />;
}

export function Panel({ className, children, ...props }: ComponentProps<typeof Card>) {
    return <Card className={cn('panel gap-0 rounded-[20px] p-5 shadow-[var(--shadow)]', className)} {...props}>{children}</Card>;
}

export function PageHeading({ label = 'AI workspace', title, description, onExport }: { label?: string; title: string; description: string; onExport?: () => void }) {
    return <div className="page-head"><div><span className="status-label">{label}</span><h1>{title}</h1><p>{description}</p></div>{onExport && <ActionButton onClick={onExport}><Download /> Export report</ActionButton>}</div>;
}

export function PanelHeading({ icon: Icon, title, description, children }: { icon?: LucideIcon; title: string; description: string; children?: ReactNode }) {
    return <div className="panel-head"><div className="panel-title">{Icon && <Icon />}<div><h2>{title}</h2><p>{description}</p></div></div>{children}</div>;
}

export function Metric({ label, value, description, icon: Icon, tone = '' }: { label: string; value: ReactNode; description: string; icon: LucideIcon; tone?: 'good' | 'alert' | 'warn' | '' }) {
    return <Card className={cn('metric-card flex-row gap-3 rounded-[18px] p-[18px] shadow-[var(--shadow)]', tone)}><div><small>{label}</small><strong>{value}</strong><span className={cn('trend', tone === 'alert' && 'down')}>{description}</span></div><span className="metric-icon"><Icon /></span></Card>;
}

export function StatusBadge({ record }: { record: Detection }) {
    return <Badge variant="secondary" className={cn('review-pill border-0', record.status.toLowerCase())}>{record.status}</Badge>;
}

export function FilterSelect({ label, value, onChange, placeholder, options }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; options: string[] }) {
    return <Select value={value || '__all'} onValueChange={next => onChange(next === '__all' ? '' : next)}><SelectTrigger aria-label={label} className="field h-11 w-full rounded-xl"><SelectValue placeholder={placeholder} /></SelectTrigger><SelectContent><SelectItem value="__all">{placeholder}</SelectItem>{options.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent></Select>;
}
