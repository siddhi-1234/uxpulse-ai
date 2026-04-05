import { useState } from 'react';
import Navbar from './components/Navbar';
import UploadZone from './components/UploadZone';
import ImagePreview from './components/ImagePreview';
import { analyzeUIScreenshot, getMockAnnotations } from './services/geminiService';

export default function App() {
  const [imageUrl, setImageUrl]               = useState(null);
  const [imageFile, setImageFile]             = useState(null);
  const [analyzing, setAnalyzing]             = useState(false);
  const [annotations, setAnnotations]         = useState([]);
  const [error, setError]                     = useState(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  const handleImageUpload = (url, file) => {
    setImageUrl(url);
    setImageFile(file);
    setAnnotations([]);
    setError(null);
    setSelectedAnnotation(null);
  };

  const handleReset = () => {
    setImageUrl(null);
    setImageFile(null);
    setAnnotations([]);
    setError(null);
    setAnalyzing(false);
    setSelectedAnnotation(null);
  };

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
      setError(`${err.message} — showing demo data.`);
      setAnnotations(getMockAnnotations());
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F0F13' }}>
      <Navbar onReset={imageUrl ? handleReset : null} />

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
