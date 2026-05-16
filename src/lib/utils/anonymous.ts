'use client';

export function getAnonymousId(): string {
  if (typeof window === 'undefined') return 'ssr';
  let id = localStorage.getItem('aether_anon');
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    localStorage.setItem('aether_anon', id);
  }
  return id;
}

export function hasReactedTo(id: string): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`reacted_${id}`) === '1';
}

export function markReacted(id: string): void {
  if (typeof window !== 'undefined') localStorage.setItem(`reacted_${id}`, '1');
}
