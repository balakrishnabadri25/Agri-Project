import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function UploadImage() {
  const navigate = useNavigate();
  const { fieldId } = useParams();
  const [field, setField] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fields = JSON.parse(localStorage.getItem('agriFields') || '[]');
    const currentField = fields.find(f => f.id === fieldId);
    if (currentField) {
      setField(currentField);
    }
  }, [fieldId]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setResults(null);
    }
  };

  const handleAnalyze = () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults = {
        weedDetected: Math.random() > 0.3,
        weedType: ['Broadleaf Weed', 'Grass Weed', 'Sedge Weed'][Math.floor(Math.random() * 3)],
        confidence: (85 + Math.random() * 14).toFixed(1),
        cropHealth: ['Excellent', 'Good', 'Fair'][Math.floor(Math.random() * 3)],
        recommendations: [
          'Apply selective herbicide within 48 hours',
          'Monitor for spread to adjacent areas',
          'Consider manual removal for small patches'
        ]
      };
      
      setResults(mockResults);
      setAnalyzing(false);
      
      // Save to localStorage
      const fields = JSON.parse(localStorage.getItem('agriFields') || '[]');
      const updatedFields = fields.map(f => {
        if (f.id === fieldId) {
          return {
            ...f,
            hasImages: true,
            imageAnalysis: mockResults,
            lastUpdated: new Date().toISOString()
          };
        }
        return f;
      });
      localStorage.setItem('agriFields', JSON.stringify(updatedFields));
      
      toast.success('Image analyzed successfully!');
    }, 2500);
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setResults(null);
  };

  if (!field) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Field Image</h1>
          <p className="text-muted-foreground">Field: {field.name} - {field.location}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
              <CardDescription>Upload a clear image of your field for weed and crop analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!preview ? (
                <label className="upload-area block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full bg-primary hover:bg-primary-dark"
                    size="lg"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing Image...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Analyze Image
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>AI-powered weed and crop detection results</CardDescription>
            </CardHeader>
            <CardContent>
              {analyzing ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">Analyzing your field image...</p>
                </div>
              ) : results ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Weed Detection</span>
                      <Badge variant={results.weedDetected ? 'destructive' : 'default'}>
                        {results.weedDetected ? 'Detected' : 'Not Detected'}
                      </Badge>
                    </div>
                    {results.weedDetected && (
                      <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Weed Type:</span>
                          <span className="font-medium">{results.weedType}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className="font-medium">{results.confidence}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Crop Health</span>
                      <Badge variant="default" className="bg-success">
                        {results.cropHealth}
                      </Badge>
                    </div>
                  </div>

                  {results.weedDetected && (
                    <div>
                      <div className="flex items-center mb-3">
                        <AlertCircle className="h-5 w-5 text-warning mr-2" />
                        <span className="font-medium">Recommendations</span>
                      </div>
                      <ul className="space-y-2">
                        {results.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start text-sm">
                            <span className="text-primary mr-2">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    onClick={() => navigate(`/report/${fieldId}`)}
                    className="w-full bg-gradient-field hover:opacity-90"
                  >
                    View Full Report
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">Upload an image to see analysis results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}