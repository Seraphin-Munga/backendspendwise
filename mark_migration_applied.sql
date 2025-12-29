-- Mark the InitialCreate migration as applied
-- This is needed when the database tables already exist but the migration history is missing

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20251228144245_InitialCreate', '9.0.0')
ON CONFLICT ("MigrationId") DO NOTHING;

