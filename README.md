# CloudSynthEx - Database as a Service

A modern, full-stack Database-as-a-Service (DBaaS) platform built with React, TypeScript, and Vite.

## 🚀 Tech Stack

- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, clsx, tailwind-merge
- **UI Components**: Custom components based on Shadcn UI (Radix UI primitives concepts)
- **Icons**: lucide-react
- **Animations**: framer-motion
- **Notifications**: sonner (Toast notifications)
- **Routing**: react-router-dom

## 📁 Project Structure

```
cloudsynthex/
├── index.html                  # Main HTML entry point (contains Google Fonts link)
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TypeScript config for Node (Vite)
├── vite.config.ts              # Vite build configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── README.md                   # Documentation
├── public/                     # Static assets (favicon, etc.)
└── src/                        # Source code
    ├── main.tsx                # React entry point (mounts App to DOM)
    ├── App.tsx                 # Main Application component (Routes & Global Layout)
    ├── index.css               # Global styles & Tailwind directives
    ├── vite-env.d.ts           # Vite type definitions
    │
    ├── components/             # Reusable UI components
    │   ├── ui.tsx              # Base UI elements (Button, Input, Card, Label)
    │   ├── Navbar.tsx          # Navigation bar
    │   ├── Footer.tsx          # Footer component
    │   ├── Background.tsx      # Global animated background
    │   └── AuthForms.tsx       # Combined Login/Register forms
    │
    ├── pages/                  # Page-level components
    │   ├── LandingPage.tsx     # Home page with Hero, Features, and Auth
    │   └── Dashboard.tsx       # Protected User Dashboard
    │
    └── services/               # Logic & API handling
        └── authService.ts      # Authentication logic (Login, Register, Logout)
```

## 🛠️ Installation Instructions

Follow these steps to set up the project on your local machine:

### 1. Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`, including:
- react-router-dom
- lucide-react
- framer-motion
- sonner
- clsx
- tailwind-merge
- class-variance-authority
- And all dev dependencies (TypeScript, Vite, Tailwind CSS, etc.)

### 2. Verify Tailwind CSS Setup

The project already includes Tailwind CSS configuration. Ensure the following files exist:
- `tailwind.config.js` - Tailwind configuration with custom theme
- `postcss.config.js` - PostCSS configuration
- `src/index.css` - Global styles with Tailwind directives

### 3. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### 4. Build for Production

To create a production build:

```bash
npm run build
```

The optimized build will be created in the `dist/` folder.

### 5. Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## ✨ Features Implemented

### Authentication Flow
- ✅ Secure-style validation (Email regex, Password complexity)
- ✅ Show/Hide password toggle
- ✅ Toast notifications for success/error states
- ✅ Simulated "Service" layer for easy backend substitution

### Dashboard
- ✅ Protected route style
- ✅ Simulated "Database Container" provisioning
- ✅ User menu with "Sign Out" confirmation modal

### Visuals
- ✅ Global animated background (Floating gradients)
- ✅ Glowing effects on feature cards
- ✅ Modern dark theme (Purple/Blue/Gold) with glassmorphism

## 🔌 Moving to Real Backend

To connect to a real backend (e.g., Node.js, Python, Go):

1. Open `src/services/authService.ts`
2. Replace the `setTimeout` simulation with real `fetch` or `axios` calls

**Example:**

```typescript
// Example:
export const login = async (credentials: LoginCredentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
};
```

## 📝 Component Overview

### `src/App.tsx`
Main entry point handling routing and global layout (including the Footer).

### `src/components/ui.tsx`
Reusable UI components (Buttons, Inputs, Cards, etc.).

### `src/components/AuthForms.tsx`
Unified Login/Register forms with validation and animations.

### `src/services/authService.ts`
Authentication logic (currently simulated, ready for backend API integration).

### `src/pages/`
Contains `LandingPage.tsx` and `Dashboard.tsx`.

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: { DEFAULT: '#8B5CF6', dark: '#7C3AED' },
  secondary: { DEFAULT: '#3B82F6', dark: '#2563EB' },
  accent: { DEFAULT: '#FBBF24', dark: '#F59E0B' },
}
```

### Fonts
The project uses **Poppins** from Google Fonts. The font is linked in `index.html`.

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Please contact the maintainer for contribution guidelines.

---

Built with ❤️ using React + TypeScript + Vite
