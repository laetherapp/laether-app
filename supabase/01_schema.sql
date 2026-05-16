-- ════════════════════════════════════════
-- SCHÉMA L. AETHER v2
-- ════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── fragments ───────────────────────────
CREATE TABLE IF NOT EXISTS fragments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language        VARCHAR(5)  NOT NULL CHECK (language IN ('fr','en')),
  content         TEXT        NOT NULL,
  mood            VARCHAR(50),
  is_premium      BOOLEAN     NOT NULL DEFAULT false,
  is_active       BOOLEAN     NOT NULL DEFAULT true,
  reaction_count  INTEGER     NOT NULL DEFAULT 0,
  sort_order      INTEGER     NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_frag_lang ON fragments (language, is_active, sort_order);

-- ─── community_posts ─────────────────────
CREATE TABLE IF NOT EXISTS community_posts (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language          VARCHAR(5)  NOT NULL CHECK (language IN ('fr','en')),
  content           TEXT        NOT NULL CHECK (char_length(content) BETWEEN 15 AND 300),
  status            VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  moderation_score  FLOAT,
  reaction_count    INTEGER     NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_posts_status ON community_posts (status, created_at DESC);

-- ─── reactions ───────────────────────────
CREATE TABLE IF NOT EXISTS reactions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fragment_id   UUID        REFERENCES fragments(id) ON DELETE CASCADE,
  post_id       UUID        REFERENCES community_posts(id) ON DELETE CASCADE,
  type          VARCHAR(50) NOT NULL DEFAULT 'feather',
  language      VARCHAR(5)  NOT NULL,
  anonymous_id  VARCHAR(100),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_react_frag ON reactions (fragment_id);
CREATE INDEX IF NOT EXISTS idx_react_post ON reactions (post_id);

-- Trigger reaction count on fragments
CREATE OR REPLACE FUNCTION fn_increment_fragment_reaction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fragment_id IS NOT NULL THEN
    UPDATE fragments SET reaction_count = reaction_count + 1 WHERE id = NEW.fragment_id;
  END IF;
  IF NEW.post_id IS NOT NULL THEN
    UPDATE community_posts SET reaction_count = reaction_count + 1 WHERE id = NEW.post_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reaction_count ON reactions;
CREATE TRIGGER trg_reaction_count
AFTER INSERT ON reactions
FOR EACH ROW EXECUTE FUNCTION fn_increment_fragment_reaction();

-- ─── circles ─────────────────────────────
CREATE TABLE IF NOT EXISTS circles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  language    VARCHAR(5)  NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'forming' CHECK (status IN ('forming','active','closed')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── circle_members ──────────────────────
CREATE TABLE IF NOT EXISTS circle_members (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id   UUID        NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL,
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(circle_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_members_circle ON circle_members (circle_id);
CREATE INDEX IF NOT EXISTS idx_members_user ON circle_members (user_id);

-- ─── circle_messages ─────────────────────
CREATE TABLE IF NOT EXISTS circle_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  circle_id   UUID        NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id     UUID        NOT NULL,
  content     TEXT        NOT NULL CHECK (char_length(content) BETWEEN 1 AND 600),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_msgs_circle ON circle_messages (circle_id, created_at DESC);

-- ─── subscriptions ───────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID,
  email           VARCHAR(255) NOT NULL,
  stripe_id       VARCHAR(255),
  plan            VARCHAR(50),
  currency        VARCHAR(3)  DEFAULT 'eur',
  status          VARCHAR(20) NOT NULL DEFAULT 'active',
  language        VARCHAR(5)  DEFAULT 'fr',
  source          VARCHAR(100),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(email)
);

-- ─── analytics_events ────────────────────
CREATE TABLE IF NOT EXISTS analytics_events (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type    VARCHAR(100) NOT NULL,
  language      VARCHAR(5),
  anonymous_id  VARCHAR(100),
  metadata      JSONB        NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
