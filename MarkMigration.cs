using Microsoft.EntityFrameworkCore;
using SpendWiseApi.Repository.Data;

var connectionString = "Host=dbspendwise.cziieuwooihb.eu-north-1.rds.amazonaws.com;Port=5432;Database=DbSpendWise;Username=postgres;Password=Sera1234";

var optionsBuilder = new DbContextOptionsBuilder<SpendWiseDbContext>();
optionsBuilder.UseNpgsql(connectionString);

using var context = new SpendWiseDbContext(optionsBuilder.Options);

try
{
    // Ensure migration history table exists
    await context.Database.ExecuteSqlRawAsync(@"
        CREATE TABLE IF NOT EXISTS ""__EFMigrationsHistory"" (
            ""MigrationId"" character varying(150) NOT NULL,
            ""ProductVersion"" character varying(32) NOT NULL,
            CONSTRAINT ""PK___EFMigrationsHistory"" PRIMARY KEY (""MigrationId"")
        );
    ");

    // Mark the migration as applied
    var result = await context.Database.ExecuteSqlRawAsync(@"
        INSERT INTO ""__EFMigrationsHistory"" (""MigrationId"", ""ProductVersion"")
        VALUES ('20251228144245_InitialCreate', '9.0.0')
        ON CONFLICT (""MigrationId"") DO NOTHING;
    ");

    Console.WriteLine("✓ Migration marked as applied successfully!");
}
catch (Exception ex)
{
    Console.WriteLine($"Error: {ex.Message}");
    return 1;
}

return 0;

