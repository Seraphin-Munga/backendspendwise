# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files
COPY SpendWiseApi.sln .
COPY SpendWiseApi/SpendWiseApi.csproj SpendWiseApi/
COPY SpendWiseApi.Repository/SpendWiseApi.Repository.csproj SpendWiseApi.Repository/
COPY SpendWiseApi.Service/SpendWiseApi.Service.csproj SpendWiseApi.Service/

# Restore dependencies
RUN dotnet restore

# Copy all source files
COPY SpendWiseApi/ SpendWiseApi/
COPY SpendWiseApi.Repository/ SpendWiseApi.Repository/
COPY SpendWiseApi.Service/ SpendWiseApi.Service/

# Build and publish
WORKDIR /src/SpendWiseApi
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

# Copy published application
COPY --from=build /app/publish .

# Expose port
EXPOSE 8080
EXPOSE 8081

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Entry point
ENTRYPOINT ["dotnet", "SpendWiseApi.dll"]
