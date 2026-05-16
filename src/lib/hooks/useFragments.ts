'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Fragment, Locale } from '@/lib/supabase/types';

const FALLBACK: Record<Locale, Fragment[]> = {
  fr: [
    { id: 'f1', language: 'fr', content: 'Il y a des moments où quelque chose\nne suit plus tout à fait.\n\nPas de manière visible.\nPas de manière audible.\n\nJuste ce léger décalage\nentre toi\net ce que tu es en train de vivre.', mood: 'presence', is_premium: false, is_active: true, reaction_count: 0, sort_order: 1, created_at: '' },
    { id: 'f2', language: 'fr', content: 'Tu pourrais ignorer ça.\nTu l\'as déjà fait.\n\nMais cette fois,\nquelque chose reste.\n\nDiscret.\nSilencieux.\nLà.', mood: 'stillness', is_premium: false, is_active: true, reaction_count: 0, sort_order: 2, created_at: '' },
    { id: 'f3', language: 'fr', content: 'Ralentir n\'est pas s\'arrêter.\n\nC\'est juste assez\npour ne pas passer à côté\nde ce qui est déjà là.', mood: 'gentleness', is_premium: false, is_active: true, reaction_count: 0, sort_order: 3, created_at: '' },
  ],
  en: [
    { id: 'e1', language: 'en', content: 'There are moments when something\nno longer quite follows.\n\nNot visibly.\nNot out loud.\n\nJust that slight gap\nbetween you\nand what you\'re living.', mood: 'presence', is_premium: false, is_active: true, reaction_count: 0, sort_order: 1, created_at: '' },
    { id: 'e2', language: 'en', content: 'You could ignore it.\nYou have before.\n\nBut this time,\nsomething stays.\n\nQuiet.\nSilent.\nHere.', mood: 'stillness', is_premium: false, is_active: true, reaction_count: 0, sort_order: 2, created_at: '' },
    { id: 'e3', language: 'en', content: 'Slowing down isn\'t stopping.\n\nIt\'s just enough\nto not miss\nwhat is already here.', mood: 'gentleness', is_premium: false, is_active: true, reaction_count: 0, sort_order: 3, created_at: '' },
  ],
};

export function useFragments(locale: Locale) {
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('fragments')
        .select('*')
        .eq('language', locale)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFragments(data ?? []);
    } catch {
      setFragments(FALLBACK[locale]);
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => { load(); }, [load]);

  return { fragments, loading };
}
