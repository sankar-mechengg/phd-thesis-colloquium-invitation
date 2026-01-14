# PhD Thesis Invitation - Rendering Guide

This guide explains how to render the `SankarPhDThesisInvitation` React component.

## Quick Start (Using Vite - Recommended)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The component will be available at `http://localhost:5173` (or the port shown in terminal).

## Alternative: Using Create React App

### 1. Create a new React app (if starting fresh)

```bash
npx create-react-app phd-invitation
cd phd-invitation
```

### 2. Copy Files

Copy `SankarPhDThesisInvitation.jsx` and the image files (`IISc_Master_Seal_Black.jpg`, `MechLogoHiRes.png`) to the `src` folder.

### 3. Update App.js

Replace the contents of `src/App.js` with:

```jsx
import React from 'react';
import ThesisInvitation from './SankarPhDThesisInvitation';
import './App.css';

function App() {
  return (
    <div className="App">
      <ThesisInvitation />
    </div>
  );
}

export default App;
```

### 4. Run the App

```bash
npm start
```

## Alternative: Using Next.js

### 1. Create Next.js App

```bash
npx create-next-app@latest phd-invitation
cd phd-invitation
```

### 2. Copy Component

Copy `SankarPhDThesisInvitation.jsx` to `components/` folder and images to `public/` folder.

### 3. Update Image Paths

In `SankarPhDThesisInvitation.jsx`, change image paths to:
- `src="/IISc_Master_Seal_Black.jpg"`
- `src="/MechLogoHiRes.png"`

### 4. Create Page

Create `pages/index.js`:

```jsx
import ThesisInvitation from '../components/SankarPhDThesisInvitation';

export default function Home() {
  return <ThesisInvitation />;
}
```

### 5. Run

```bash
npm run dev
```

## File Structure

```
your-project/
├── SankarPhDThesisInvitation.jsx
├── IISc_Master_Seal_Black.jpg
├── MechLogoHiRes.png
├── App.jsx (or App.js)
├── main.jsx (or index.js)
├── package.json
└── vite.config.js (if using Vite)
```

## Important Notes

1. **Image Paths**: The component now uses relative paths (`./IISc_Master_Seal_Black.jpg`). Make sure the images are in the same directory or adjust paths accordingly.

2. **Google Fonts**: The component automatically loads Google Fonts (Cormorant Garamond and Outfit) via a `<style>` tag.

3. **Download Feature**: The component includes a "Download as PNG" button that uses `html2canvas` (loaded from CDN). This requires:
   - Images to have `crossOrigin="anonymous"` (already set)
   - Images to be served from the same origin or with proper CORS headers

4. **Browser Compatibility**: Works in all modern browsers. The download feature requires JavaScript enabled.

## Troubleshooting

- **Images not showing**: Check that image paths are correct relative to your setup
- **Download not working**: Ensure images are loaded from the same origin or have CORS enabled
- **Fonts not loading**: Check internet connection (Google Fonts are loaded from CDN)
