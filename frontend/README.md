# Aadhaar OCR System — Frontend

This is the frontend application for the Aadhaar OCR System. It is built with **React 19, Vite, TypeScript, and Tailwind CSS v4**.

It provides a beautiful, dynamic, and responsive UI for users to upload their Aadhaar card images and view the extracted OCR results.

## Features

- 🎨 **Modern UI:** Glassmorphism, dynamic gradients, and animated interactions.
- 📤 **Drag & Drop:** Easy file uploading with local image previews.
- ⚡ **Real-time Feedback:** Processing states and specific field-level extraction warnings.
- 🔒 **Data Privacy:** Option to toggle the visibility of the Aadhaar number.

## Setup & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:5173`.
   
   > **Note:** The Vite configuration is set up to proxy `/api` requests to `http://localhost:5555`. Ensure your backend is running simultaneously for the OCR functionality to work!

## Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `dist/` directory containing the static files ready to be served.

## Deployment

The frontend can be deployed statically to platforms like Vercel, Netlify, or GitHub Pages.

**Deploying to Vercel (Recommended):**
1. Push your code to a GitHub repository.
2. Import the project in Vercel.
3. The framework preset (Vite) will be automatically detected.
4. **Important:** Since Vercel serves the frontend statically, the Vite proxy won't work in production. You must update the `axios.post` call in `src/hooks/useOcr.ts` to point to the absolute URL of your deployed backend (e.g., `https://your-backend.onrender.com/api/ocr`).

## Testing

You can test the application by uploading sample images of an Aadhaar card (front and back). Ensure the images are clear, well-lit, and the text is legible for the best OCR results.
