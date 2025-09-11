# 🔥 Pokemon Full-Stack Application

A modern, full-stack Pokemon management application built with .NET 9 Web API and Angular 20, featuring a custom component and style library

## 🎯 Project Overview

This project demonstrates enterprise-level full-stack development skills with:

- **Backend**: .NET 9 Web API with Clean Architecture
- **Frontend**: Angular 20 with standalone components and signals
- **Component Library**: Custom Fish UI library with reusable components
- **Style Library**: Custom Fish Styles library with theming and helper classes
- **Database**: SQL Server with Entity Framework Core
- **Documentation**: Comprehensive docs via Aquarium demo application and Swagger
- **Containerization**: Uses Docker to get up and running fast

## 🏗️ Architecture

### Backend (.NET 9 Web API)
```
┌─────────────────┐
│   PokemonApi.Api │ ← Presentation Layer (Controllers, Swagger)
├─────────────────┤
│ PokemonApi.Services │ ← Business Logic Layer (Services, DTOs)  
├─────────────────┤
│  PokemonApi.Data │ ← Data Access Layer (EF Core, Repositories)
├─────────────────┤
│ PokemonApi.Shared │ ← Shared Models & Utilities
└─────────────────┘
```

**Design Patterns Implemented:**
- Clean Architecture
- Repository Pattern
- Unit of Work Pattern
- Dependency Injection
- SOLID Principles

### Frontend (Angular 20)
```
┌─────────────────┐
│   Pokedex App   │ ← Main Pokemon application
├─────────────────┤
│   Aquarium App  │ ← Component library showcase
├─────────────────┤
│    Fish UI      │ ← Custom component library
└─────────────────┘
```

**Modern Angular Features:**
- Standalone Components
- Angular Signals
- Reactive Forms
- Custom Component Library
- SCSS Theming System

## 🚀 Features

### Pokemon Management
- **View Pokemon**: Paginated list with search functionality
- **Pokemon Details**: Complete information including stats, types, and abilities
- **Create Pokemon**: Add new Pokemon with validation
- **Edit Pokemon**: Update existing Pokemon data
- **Delete Pokemon**: Remove Pokemon from database
- **Search**: Real-time search by name

### Component Library (Fish UI)
- **Reusable Components**: Button, Card, Badge, Input, Textarea, Select, etc.
- **Theming System**: Customizable SCSS variables
- **Documentation**: Interactive component showcase
- **Form Components**: Complete form controls with validation

### API Features
- **RESTful Design**: Standard HTTP methods and status codes
- **Swagger Documentation**: Interactive API documentation
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Proper error responses
- **CORS Support**: Cross-origin resource sharing
- **Data Seeding**: Automated population from PokeAPI

## 🛠️ Technology Stack

### Backend
- **.NET 9**: Latest .NET framework
- **ASP.NET Core Web API**: RESTful API framework
- **Entity Framework Core**: ORM with Code-First approach
- **SQL Server**: Relational database
- **Docker**: Containerization
- **Swagger/OpenAPI**: API documentation

### Frontend
- **Angular 20**: Latest Angular framework
- **TypeScript**: Type-safe JavaScript
- **SCSS**: Advanced CSS preprocessing
- **RxJS**: Reactive programming
- **Angular Signals**: Modern state management
- **Standalone Components**: Modular architecture

### Development Tools
- **Visual Studio**: IDE for backend development
- **VS Code**: Editor for frontend development
- **Docker Desktop**: Container management
- **SQL Server Management Studio**: Database management

## 📋 Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) (optional)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/mfish0005/pokedex
cd pokedex
```

### 2. Setup Database (Docker)
```bash
# Navigate to API directory
cd pokedex-api

# Start SQL Server container
docker-compose up -d

# Wait for SQL Server to initialize (about 30 seconds)
```

### 3. Setup and Run Backend API
```bash
# Navigate to API project
cd pokedex-server/PokemonApi.Api

# Restore NuGet packages
dotnet restore

# Run database migrations
dotnet ef database update

# Seed database with Pokemon data (optional)
dotnet run --seed

# Run the API (or use Visual Studio)
dotnet run
```

The API will be available at `https://localhost:44373` with Swagger documentation.

### 4. Setup and Run Frontend
```bash
# Navigate to client directory
cd pokedex-client

# Install dependencies
npm install

# Run the Pokedex application
npm run serve-pokedex

# Or run the component library showcase
npm run serve-aquarium
```

The applications will be available at:
- **Pokedex App**: `http://localhost:4200`
- **Aquarium (Component Library)**: `http://localhost:4201`

## 📚 API Documentation

Once the API is running, visit `https://localhost:44373/swagger` for comprehensive API documentation including:

- Interactive endpoint testing
- Request/response examples
- Schema documentation
- Validation rules

## 🎨 Component Library

The Fish UI component library includes:

- **Form Controls**: Input, Textarea, Select with validation
- **Interactive Elements**: Button, Card, Badge
- **Utility Components**: Spinner, Search, Icon
- **Theming System**: Customizable SCSS variables

View the component showcase at `http://localhost:4201` when running the Aquarium app.

## 🗂️ Project Structure

```
pokemon-fullstack-app/
├── pokedex-api/                 # .NET Web API
│   ├── PokemonApi.Api/         # Controllers, Swagger config
│   ├── PokemonApi.Services/    # Business logic, DTOs
│   ├── PokemonApi.Data/        # EF Core, Repositories
│   ├── PokemonApi.Shared/      # Shared models
│   └── docker-compose.yml     # SQL Server container
├── pokedex-client/             # Angular Applications
│   ├── src/                    # Main Pokedex app
│   ├── projects/
│   │   ├── fish-ui/           # Component library
│   │   └── aquarium/          # Component showcase
│   └── package.json           # NPM dependencies
└── README.md                   # This file
```

## 🔧 Development Commands

### Backend
```bash
# Run API with hot reload
dotnet watch run

# Create new migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Seed database
dotnet run --seed
```

### Frontend
```bash
# Serve Pokedex app
npm run serve-pokedex

# Serve component library showcase
npm run serve-aquarium

# Build for production
npm run build-pokedex

# Build component library
npm run build-fish-ui
```
