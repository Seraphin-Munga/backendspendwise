using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Reflection;

namespace SpendWiseApi.Repository.Data;

public class SpendWiseDbContextFactory : IDesignTimeDbContextFactory<SpendWiseDbContext>
{
    public SpendWiseDbContext CreateDbContext(string[] args)
    {
        // Find the appsettings.json file by traversing up from the assembly location
        var basePath = FindAppSettingsPath();
        
        if (string.IsNullOrEmpty(basePath))
        {
            throw new FileNotFoundException(
                $"Could not find appsettings.json file. Searched from: {Directory.GetCurrentDirectory()}. " +
                "Please ensure appsettings.json exists in the SpendWiseApi project directory.");
        }

        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<SpendWiseDbContext>();
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        if (string.IsNullOrEmpty(connectionString))
        {
            throw new InvalidOperationException("Connection string 'DefaultConnection' not found in appsettings.json");
        }

        optionsBuilder.UseNpgsql(connectionString);

        return new SpendWiseDbContext(optionsBuilder.Options);
    }

    private string? FindAppSettingsPath()
    {
        // Try multiple strategies to find the appsettings.json file
        
        // Strategy 1: Check common relative paths from current directory
        var currentDir = Directory.GetCurrentDirectory();
        var pathsToTry = new List<string>
        {
            Path.Combine(currentDir, "..", "SpendWiseApi"),
            Path.Combine(currentDir, "..", "..", "SpendWiseApi"),
            Path.Combine(currentDir, "SpendWiseApi"),
            currentDir
        };

        // Strategy 2: If we're in the Repository project, go up one level
        if (currentDir.Contains("SpendWiseApi.Repository"))
        {
            var repoIndex = currentDir.IndexOf("SpendWiseApi.Repository");
            var solutionRoot = currentDir.Substring(0, repoIndex);
            pathsToTry.Insert(0, Path.Combine(solutionRoot, "SpendWiseApi"));
        }

        foreach (var path in pathsToTry)
        {
            var normalizedPath = Path.GetFullPath(path);
            var appSettingsPath = Path.Combine(normalizedPath, "appsettings.json");
            if (File.Exists(appSettingsPath))
            {
                return normalizedPath;
            }
        }

        // Strategy 3: Traverse up the directory tree from assembly location
        var assemblyLocation = Assembly.GetExecutingAssembly().Location;
        if (!string.IsNullOrEmpty(assemblyLocation))
        {
            var assemblyDir = Path.GetDirectoryName(assemblyLocation);
            if (!string.IsNullOrEmpty(assemblyDir))
            {
                var directory = new DirectoryInfo(assemblyDir);
                while (directory != null && directory.Exists)
                {
                    var spendWiseApiDir = Path.Combine(directory.FullName, "SpendWiseApi");
                    if (Directory.Exists(spendWiseApiDir))
                    {
                        var appSettingsPath = Path.Combine(spendWiseApiDir, "appsettings.json");
                        if (File.Exists(appSettingsPath))
                        {
                            return spendWiseApiDir;
                        }
                    }
                    directory = directory.Parent;
                }
            }
        }

        // Strategy 4: Traverse up from current directory
        var currentDirectory = new DirectoryInfo(currentDir);
        while (currentDirectory != null && currentDirectory.Exists)
        {
            var spendWiseApiDir = Path.Combine(currentDirectory.FullName, "SpendWiseApi");
            if (Directory.Exists(spendWiseApiDir))
            {
                var appSettingsPath = Path.Combine(spendWiseApiDir, "appsettings.json");
                if (File.Exists(appSettingsPath))
                {
                    return spendWiseApiDir;
                }
            }
            currentDirectory = currentDirectory.Parent;
        }

        return null;
    }
}

