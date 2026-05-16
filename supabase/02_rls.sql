-- ════════════════════════════════════════
-- RLS — L. AETHER v2
-- ════════════════════════════════════════

ALTER TABLE fragments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE circles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Fragments : lecture publique (non premium)
CREATE POLICY "fragments_public_read" ON fragments
  FOR SELECT USING (is_active = true AND is_premium = false);
CREATE POLICY "fragments_service_all" ON fragments
  FOR ALL USING (auth.role() = 'service_role');

-- Community posts : lecture publique des approuvés
CREATE POLICY "posts_public_read" ON community_posts
  FOR SELECT USING (status = 'approved');
CREATE POLICY "posts_public_insert" ON community_posts
  FOR INSERT WITH CHECK (status = 'pending' AND char_length(content) BETWEEN 15 AND 300);
CREATE POLICY "posts_service_all" ON community_posts
  FOR ALL USING (auth.role() = 'service_role');

-- Reactions : publiques
CREATE POLICY "reactions_public_insert" ON reactions
  FOR INSERT WITH CHECK (true);
CREATE POLICY "reactions_public_read" ON reactions
  FOR SELECT USING (true);

-- Circles
CREATE POLICY "circles_auth_read" ON circles
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
CREATE POLICY "circles_service_all" ON circles
  FOR ALL USING (auth.role() = 'service_role');

-- Circle members
CREATE POLICY "members_auth_read" ON circle_members
  FOR SELECT USING (auth.uid() = user_id OR auth.role() = 'service_role');
CREATE POLICY "members_auth_insert" ON circle_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Circle messages
CREATE POLICY "messages_circle_read" ON circle_messages
  FOR SELECT USING (
    auth.role() = 'service_role' OR
    EXISTS (SELECT 1 FROM circle_members WHERE circle_id = circle_messages.circle_id AND user_id = auth.uid())
  );
CREATE POLICY "messages_circle_insert" ON circle_messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM circle_members WHERE circle_id = circle_messages.circle_id AND user_id = auth.uid())
  );

-- Subscriptions
CREATE POLICY "subs_public_insert" ON subscriptions
  FOR INSERT WITH CHECK (char_length(email) > 5 AND email LIKE '%@%.%');
CREATE POLICY "subs_service_all" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Analytics
CREATE POLICY "analytics_public_insert" ON analytics_events
  FOR INSERT WITH CHECK (true);
CREATE POLICY "analytics_service_read" ON analytics_events
  FOR SELECT USING (auth.role() = 'service_role');
