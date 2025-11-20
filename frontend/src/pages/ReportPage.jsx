import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, TrendingUp, AlertCircle, CheckCircle, Image as ImageIcon, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function ReportPage() {
  const navigate = useNavigate();
  const { fieldId } = useParams();
  const [field, setField] = useState(null);

  useEffect(() => {
    const fields = JSON.parse(localStorage.getItem('agriFields') || '[]');
    const currentField = fields.find(f => f.id === fieldId);
    if (currentField) {
      setField(currentField);
    }
  }, [fieldId]);

  const handleDownloadPDF = () => {
    toast.success('Report download started! (Demo mode)');
  };

  if (!field) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  const hasImageData = field.imageAnalysis;
  const hasSoilData = field.soilData;

  // Prepare chart data
  const soilChartData = hasSoilData ? [
    { name: 'pH', value: field.soilData.ph, optimal: 6.5, fill: 'hsl(var(--primary))' },
    { name: 'Nitrogen', value: field.soilData.nitrogen, optimal: 50, fill: 'hsl(var(--accent))' },
    { name: 'Phosphorus', value: field.soilData.phosphorus, optimal: 40, fill: 'hsl(var(--secondary))' },
    { name: 'Potassium', value: field.soilData.potassium, optimal: 50, fill: 'hsl(var(--harvest))' },
  ] : [];

  const radarData = hasSoilData ? [
    { parameter: 'pH', value: (field.soilData.ph / 9) * 100, optimal: (6.5 / 9) * 100 },
    { parameter: 'N', value: (field.soilData.nitrogen / 100) * 100, optimal: 50 },
    { parameter: 'P', value: (field.soilData.phosphorus / 100) * 100, optimal: 40 },
    { parameter: 'K', value: (field.soilData.potassium / 100) * 100, optimal: 50 },
    { parameter: 'OM', value: (field.soilData.organicMatter / 10) * 100, optimal: 40 },
  ] : [];

  const recommendations = [];
  if (hasImageData && field.imageAnalysis.weedDetected) {
    recommendations.push(...field.imageAnalysis.recommendations);
  }
  if (hasSoilData && field.soilAnalysis) {
    if (field.soilAnalysis.nitrogen.status === 'Low') {
      recommendations.push('Apply nitrogen-rich fertilizer to improve soil fertility');
    }
    if (field.soilAnalysis.phosphorus.status === 'Low') {
      recommendations.push('Consider adding phosphate fertilizer for root development');
    }
    if (field.soilAnalysis.potassium.status === 'Low') {
      recommendations.push('Apply potassium fertilizer to enhance plant resistance');
    }
    if (field.soilAnalysis.ph.status === 'Poor') {
      recommendations.push('Adjust soil pH using lime (if acidic) or sulfur (if alkaline)');
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <Button onClick={handleDownloadPDF} className="bg-primary hover:bg-primary-dark">
            <Download className="h-4 w-4 mr-2" />
            Download PDF Report
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Field Analysis Report</h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span className="font-medium text-lg">{field.name}</span>
            <Separator orientation="vertical" className="h-6" />
            <span>{field.location}</span>
            <Separator orientation="vertical" className="h-6" />
            <span>Generated: {new Date(field.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>

        {!hasImageData && !hasSoilData && (
          <Card className="mb-8">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-warning mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Upload field images and soil data to generate a comprehensive analysis report.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate(`/upload-image/${fieldId}`)} variant="outline">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <Button onClick={() => navigate(`/upload-soil/${fieldId}`)} className="bg-primary hover:bg-primary-dark">
                  <Layers className="h-4 w-4 mr-2" />
                  Upload Soil Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Analysis Section */}
        {hasImageData && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Image Analysis</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weed Detection Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <span className="font-medium">Detection Status</span>
                    <Badge variant={field.imageAnalysis.weedDetected ? 'destructive' : 'default'} className="text-sm">
                      {field.imageAnalysis.weedDetected ? 'Weeds Detected' : 'No Weeds'}
                    </Badge>
                  </div>
                  
                  {field.imageAnalysis.weedDetected && (
                    <>
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <span className="font-medium">Weed Type</span>
                        <span className="text-foreground">{field.imageAnalysis.weedType}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <span className="font-medium">Confidence Level</span>
                        <span className="text-primary font-semibold">{field.imageAnalysis.confidence}%</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crop Health Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gradient-field text-white rounded-lg">
                    <div>
                      <p className="text-sm text-white/80 mb-1">Overall Health Status</p>
                      <p className="text-2xl font-bold">{field.imageAnalysis.cropHealth}</p>
                    </div>
                    <CheckCircle className="h-12 w-12 text-white/80" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Soil Analysis Section */}
        {hasSoilData && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <Layers className="h-6 w-6 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold">Soil Analysis</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nutrient Levels</CardTitle>
                  <CardDescription>Current vs Optimal Values</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={soilChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Soil Health Radar</CardTitle>
                  <CardDescription>Comprehensive nutrient assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="parameter" stroke="hsl(var(--muted-foreground))" />
                      <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                      <Radar name="Current" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                      <Radar name="Optimal" dataKey="optimal" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Soil Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {field.soilAnalysis && Object.entries(field.soilAnalysis).map(([key, value]) => (
                    <div key={key} className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1 capitalize">{key === 'organicMatter' ? 'Organic Matter' : key}</p>
                      <Badge className={value.color}>{value.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-warning/10 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <CardTitle>Action Recommendations</CardTitle>
                  <CardDescription>AI-generated suggestions for optimal field management</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    <div className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-foreground">{rec}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}