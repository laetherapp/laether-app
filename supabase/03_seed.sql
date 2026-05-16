-- ════════════════════════════════════════
-- SEED — FRAGMENTS L. AETHER
-- Inspirés du manuscrit "Là où tout devient léger"
-- Traduction émotionnelle, pas littérale
-- ════════════════════════════════════════

INSERT INTO fragments (language, content, mood, is_premium, is_active, sort_order) VALUES

-- ─── FRANÇAIS — Gratuits (sort_order 1-3) ───────────────

('fr',
'Il y a des moments où quelque chose
ne suit plus tout à fait.

Pas de manière visible.
Pas de manière audible.

Juste ce léger décalage
entre toi
et ce que tu es en train de vivre.',
'presence', false, true, 1),

('fr',
'Tu pourrais ignorer ça.
Tu l''as déjà fait.

Mais cette fois,
quelque chose reste.

Discret.
Silencieux.
Là.',
'stillness', false, true, 2),

('fr',
'Ralentir n''est pas s''arrêter.

C''est juste assez
pour ne pas passer à côté
de ce qui est déjà là.',
'gentleness', false, true, 3),

-- ─── FRANÇAIS — Premium (sort_order 4+) ─────────────────

('fr',
'Ce que tu traverses
a un nom que tu ne trouveras pas
dans les dictionnaires.

Il vit dans la sensation.
Juste là,
dans ta poitrine.',
'tenderness', true, true, 4),

('fr',
'Tu n''es pas absent.
Tu n''es pas détaché.

Tu es simplement
légèrement en retrait
de toi-même.

Et ce retrait
n''est pas une perte.
C''est un espace.',
'acceptance', true, true, 5),

('fr',
'Quelque chose s''est ouvert
sans que tu le décides.

Sans bruit.
Sans annonce.

Et tu le sens encore.',
'opening', true, true, 6),

('fr',
'Cette fatigue que tu ressens
n''est pas l''effort.

C''est la distance
entre toi
et ce que tu es en train de vivre.

Quand elle se réduit,
tout devient plus léger.',
'healing', true, true, 7),

('fr',
'Tu n''as rien à comprendre ici.

Juste reconnaître
que quelque chose en toi
a répondu.

C''est suffisant.',
'trust', true, true, 8),

('fr',
'Il n''y a pas de moment précis.
Pas de bascule nette.

Quelque chose a commencé à changer
depuis longtemps déjà.

Tu commences seulement
à le voir.',
'passage', true, true, 9),

('fr',
'Ce que tu as touché
ne disparaît pas.

Même quand le rythme revient.
Même quand tu reprends le mouvement.

C''est là.
Plus silencieux.
Mais présent.',
'continuity', true, true, 10),

('fr',
'Tu n''es pas en retard.

Tu es exactement
à l''endroit
où quelque chose d''important
commence.',
'trust', true, true, 11),

('fr',
'Certaines choses n''ont pas besoin
d''être comprises.

Elles ont besoin
d''être traversées.

Lentement.
Sans forcer.',
'acceptance', true, true, 12),

-- ─── ENGLISH — Free (sort_order 1-3) ────────────────────

('en',
'There are moments when something
no longer quite follows.

Not visibly.
Not out loud.

Just that slight gap
between you
and what you''re living.',
'presence', false, true, 1),

('en',
'You could ignore it.
You have before.

But this time,
something stays.

Quiet.
Silent.
Here.',
'stillness', false, true, 2),

('en',
'Slowing down isn''t stopping.

It''s just enough
to not miss
what is already here.',
'gentleness', false, true, 3),

-- ─── ENGLISH — Premium (sort_order 4+) ──────────────────

('en',
'What you''re moving through
has a name you won''t find
in any dictionary.

It lives in the feeling.
Right there,
in your chest.',
'tenderness', true, true, 4),

('en',
'You''re not absent.
You''re not detached.

You''re simply
slightly behind yourself.

And that distance
isn''t a loss.
It''s a space.',
'acceptance', true, true, 5),

('en',
'Something opened
without you deciding it.

Without noise.
Without warning.

And you can still feel it.',
'opening', true, true, 6),

('en',
'The tiredness you feel
isn''t the effort.

It''s the distance
between you
and what you''re living.

When it closes,
everything becomes lighter.',
'healing', true, true, 7),

('en',
'There''s nothing to understand here.

Just recognize
that something in you
responded.

That''s enough.',
'trust', true, true, 8),

('en',
'There''s no precise moment.
No clear shift.

Something began changing
a long time ago.

You''re only now
starting to see it.',
'passage', true, true, 9),

('en',
'What you touched
doesn''t disappear.

Even as the pace returns.
Even as you move forward.

It''s there.
Quieter.
But present.',
'continuity', true, true, 10),

('en',
'You''re not late.

You''re exactly
where something important
is beginning.',
'trust', true, true, 11),

('en',
'Some things don''t need
to be understood.

They need
to be moved through.

Slowly.
Without forcing.',
'acceptance', true, true, 12);
