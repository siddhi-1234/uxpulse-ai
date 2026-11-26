import { useState } from 'react';
import Navbar from './components/Navbar';
import UploadZone from './components/UploadZone';
import ImagePreview from './components/ImagePreview';
import { analyzeUIScreenshot, getMockAnnotations } from './services/geminiService';

// Root component: owns all application state and orchestrates view switching
export default function App() {
  const [imageUrl, setImageUrl]               = useState(null);  // object URL of the uploaded image
  const [imageFile, setImageFile]             = useState(null);  // raw File used for the API call
  const [analyzing, setAnalyzing]             = useState(false); // true while the Gemini request is in-flight
  const [annotations, setAnnotations]         = useState([]);    // array of UX issue objects returned by AI
  const [error, setError]                     = useState(null);  // error message shown in the UI
  const [selectedAnnotation, setSelectedAnnotation] = useState(null); // annotation currently open in the detail panel

  // Called by UploadZone when a file is dropped or selected; stores the URL and File, clears prior results
  const handleImageUpload = (url, file) => {
    setImageUrl(url);
    setImageFile(file);
    setAnnotations([]);
    setError(null);
    setSelectedAnnotation(null);
  };

  // Clears all state to return to the upload screen
  const handleReset = () => {
    setImageUrl(null);
    setImageFile(null);
    setAnnotations([]);
    setError(null);
    setAnalyzing(false);
    setSelectedAnnotation(null);
  };

  // Sends the current image file to Gemini; falls back to mock data if the API call fails
  const handleAnalyze = async () => {
    if (!imageFile) return;
    setAnalyzing(true);
    setError(null);
    setAnnotations([]);
    setSelectedAnnotation(null);

    try {
      const result = await analyzeUIScreenshot(imageFile);
      if (result && result.length > 0) {
        setAnnotations(result);
      } else {
        throw new Error('AI returned empty results.');
      }
    } catch (err) {
      console.error('Analysis Error:', err);
      // Fall back to mock annotations so the UI remains usable when the API is unavailable
      setError(`${err.message} — showing demo data.`);
      setAnnotations(getMockAnnotations());
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F0F13' }}>
      {/* Pass onReset only when an image is loaded so the logo is non-interactive on the landing screen */}
      <Navbar onReset={imageUrl ? handleReset : null} />

      {/* Show the upload screen until an image is chosen, then switch to the analysis view */}
      {!imageUrl ? (
        <UploadZone onImageUpload={handleImageUpload} />
      ) : (
        <ImagePreview
          imageUrl={imageUrl}
          analyzing={analyzing}
          annotations={annotations}
          error={error}
          selectedAnnotation={selectedAnnotation}
          onAnnotationClick={setSelectedAnnotation}
          onAnalyze={handleAnalyze}
          onReset={handleReset}
          onClosePanel={() => setSelectedAnnotation(null)}
        />
      )}
    </div>
  );
}
