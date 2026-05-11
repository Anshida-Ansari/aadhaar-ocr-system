# Aadhaar OCR System — Backend

This is the backend service for the Aadhaar OCR System. It is built with **Node.js, Express, TypeScript, Tesseract.js, and MongoDB**.

It exposes an API endpoint to process images of an Aadhaar card (front and back), extract text using OCR, parse the relevant fields, and store the results.

## Prerequisites

- Node.js (v18+)
- MongoDB Atlas cluster (or local MongoDB)

## Setup & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root of the backend directory with the following:
   ```env
   PORT=5555
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/aadhaar_ocr?retryWrites=true&w=majority
   ```
   > **Note:** Ensure your current IP address is whitelisted in MongoDB Atlas Network Access settings!

3. **Start the server:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5555`.

## API Documentation

### `POST /api/ocr`

Upload front and back images of an Aadhaar card for processing.

**Headers:**
- `Content-Type`: `multipart/form-data`

**Body (Form Data):**
- `frontImage`: File (jpeg, png, webp) - max 5MB
- `backImage`: File (jpeg, png, webp) - max 5MB

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Aadhaar card information extracted successfully.",
  "data": {
    "aadhaarNumber": "1234 5678 9012",
    "name": "Full Name",
    "dob": "DD/MM/YYYY",
    "gender": "Male",
    "address": "Full extracted address...",
    "pincode": "123456"
  }
}
```

## Testing the API

You can test the API using Postman, cURL, or the provided frontend.

Using cURL:
```bash
curl -X POST http://localhost:5555/api/ocr \
  -F "frontImage=@/path/to/front.jpg" \
  -F "backImage=@/path/to/back.jpg"
```

## Deployment

The application can be deployed to any Node.js hosting platform (Render, Railway, Heroku, AWS).

1. **Build the application:**
   Ensure your build tools compile the TypeScript source into a `dist/` directory (you may need to add a `build` script to `package.json` like `"build": "tsc"`).

2. **Set Environment Variables:**
   Add `MONGO_URI` and `PORT` to the host's environment variables.

3. **Start Command:**
   `node dist/app.js` (or use `ts-node src/app.ts` if deploying directly).
