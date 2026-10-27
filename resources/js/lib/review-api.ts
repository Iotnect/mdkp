import type { ReviewInput, Detection } from '@/types';

export async function saveReviewToServer(url: string, input: ReviewInput): Promise<Detection> {
    const tokenCookie = document.cookie.split('; ').find(cookie => cookie.startsWith('XSRF-TOKEN='));
    const token = tokenCookie ? decodeURIComponent(tokenCookie.slice('XSRF-TOKEN='.length)) : '';
    const response = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': token },
        body: JSON.stringify(input),
    });
    if (response.status === 401 || response.status === 419) throw new Error('Your session has expired. Refresh the page and sign in again.');
    const result = await response.json();
    if (!response.ok) throw new Error(Object.values(result.errors || {}).flat().join(' ') || 'Unable to save the review.');
    return result as Detection;
}
