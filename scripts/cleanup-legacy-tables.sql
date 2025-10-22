-- Migration manuelle pour supprimer les anciennes tables Message et ContactMessage
-- Exécuter APRÈS avoir migré les données vers Conversation

-- Supprimer les tables legacy
DROP TABLE IF EXISTS "ContactMessage";
DROP TABLE IF EXISTS "Message";

-- Ces tables sont maintenant remplacées par:
-- - Conversation
-- - ConversationMessage
