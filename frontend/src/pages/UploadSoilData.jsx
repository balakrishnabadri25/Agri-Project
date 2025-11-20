import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

export default function UploadSoilData() {
  const navigate = useNavigate();
  const { fieldId } = useParams();
  const [field, setField] = useState(null);
  const [soilData, setSoilData] = useState({
    ph: 6.5,
    nitrogen: 45,
    phosphorus: 35,
    potassium: 40,
    organicMatter: 3.5
  });

  useEffect(() => {
    const fields = JSON.parse(localStorage.getItem('agriFields') || '[]');
    const currentField = fields.find(f => f.id === fieldId);
    if (currentField) {
      setField(currentField);
      if (currentField.soilData) {
        setSoilData(currentField.soilData);
      }
    }
  }, [fieldId]);

  const getPhStatus = (ph) => {
    if (ph >= 6.0 && ph <= 7.5) return { status: 'Good', color: 'bg-success' };
    if (ph >= 5.5 && ph < 6.0) return { status: 'Fair', color: 'bg-warning' };
    return { status: 'Poor', color: 'bg-destructive' };
  };

  const getNutrientStatus = (value, optimal) => {
    const percentage = (value / optimal) * 100;
    if (percentage >= 80) return { status: 'Good', color: 'bg-success' };
    if (percentage >= 60) return { status: 'Fair', color: 'bg-warning' };
    return { status: 'Low', color: 'bg-destructive' };
  };

  const handleSave = () => {
    const analysis = {
      ph: getPhStatus(soilData.ph),
      nitrogen: getNutrientStatus(soilData.nitrogen, 50),
      phosphorus: getNutrientStatus(soilData.phosphorus, 40),
      potassium: getNutrientStatus(soilData.potassium, 50),
      organicMatter: soilData.organicMatter >= 3 ? { status: 'Good', color: 'bg-success' } : { status: 'Low', color: 'bg-warning' }
    };

    const fields = JSON.parse(localStorage.getItem('agriFields') || '[]');
    const updatedFields = fields.map(f => {
      if (f.id === fieldId) {
        return {
          ...f,
          hasSoilData: true,
          soilData,
          soilAnalysis: analysis,
          lastUpdated: new Date().toISOString()
        };
      }
      return f;
    });
    localStorage.setItem('agriFields', JSON.stringify(updatedFields));
    toast.success('Soil data saved successfully!');
    setTimeout(() => navigate(`/report/${fieldId}`), 1000);
  };

  if (!field) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  const phStatus = getPhStatus(soilData.ph);
  const nitrogenStatus = getNutrientStatus(soilData.nitrogen, 50);
  const phosphorusStatus = getNutrientStatus(soilData.phosphorus, 40);
  const potassiumStatus = getNutrientStatus(soilData.potassium, 50);

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
          <h1 className="text-3xl font-bold mb-2">Upload Soil Data</h1>
          <p className="text-muted-foreground">Field: {field.name} - {field.location}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Soil Parameters</CardTitle>
                <CardDescription>Enter your soil test results for comprehensive analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* pH Level */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label className="font-medium">pH Level</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ideal pH range: 6.0 - 7.5</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-primary">{soilData.ph.toFixed(1)}</span>
                      <Badge className={phStatus.color}>{phStatus.status}</Badge>
                    </div>
                  </div>
                  <Slider
                    value={[soilData.ph]}
                    onValueChange={([value]) => setSoilData({ ...soilData, ph: value })}
                    min={4}
                    max={9}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>4.0 (Acidic)</span>
                    <span>9.0 (Alkaline)</span>
                  </div>
                </div>

                {/* Nitrogen */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label className="font-medium">Nitrogen (N)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Optimal range: 40-60 ppm</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={soilData.nitrogen}
                        onChange={(e) => setSoilData({ ...soilData, nitrogen: Number(e.target.value) })}
                        className="w-20 text-right"
                      />
                      <span className="text-sm text-muted-foreground">ppm</span>
                      <Badge className={nitrogenStatus.color}>{nitrogenStatus.status}</Badge>
                    </div>
                  </div>
                </div>

                {/* Phosphorus */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label className="font-medium">Phosphorus (P)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Optimal range: 30-50 ppm</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={soilData.phosphorus}
                        onChange={(e) => setSoilData({ ...soilData, phosphorus: Number(e.target.value) })}
                        className="w-20 text-right"
                      />
                      <span className="text-sm text-muted-foreground">ppm</span>
                      <Badge className={phosphorusStatus.color}>{phosphorusStatus.status}</Badge>
                    </div>
                  </div>
                </div>

                {/* Potassium */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label className="font-medium">Potassium (K)</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Optimal range: 40-60 ppm</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={soilData.potassium}
                        onChange={(e) => setSoilData({ ...soilData, potassium: Number(e.target.value) })}
                        className="w-20 text-right"
                      />
                      <span className="text-sm text-muted-foreground">ppm</span>
                      <Badge className={potassiumStatus.color}>{potassiumStatus.status}</Badge>
                    </div>
                  </div>
                </div>

                {/* Organic Matter */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Label className="font-medium">Organic Matter</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-2 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ideal range: 3-5%</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={soilData.organicMatter}
                        onChange={(e) => setSoilData({ ...soilData, organicMatter: Number(e.target.value) })}
                        className="w-20 text-right"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary-dark" size="lg">
                  <Save className="h-5 w-5 mr-2" />
                  Save and Analyze
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Guide */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Understanding Soil Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2" />
                    pH Level
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Soil pH affects nutrient availability. Most crops thrive in slightly acidic to neutral soil (6.0-7.5).
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-accent rounded-full mr-2" />
                    NPK Values
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Nitrogen (N) promotes leaf growth, Phosphorus (P) supports roots and flowers, Potassium (K) enhances overall plant health.
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <span className="w-2 h-2 bg-secondary rounded-full mr-2" />
                    Organic Matter
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Higher organic matter improves soil structure, water retention, and nutrient availability. Aim for 3-5%.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-field text-white">
              <CardHeader>
                <CardTitle>Quick Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/90">
                  Regular soil testing (every 2-3 years) helps maintain optimal growing conditions and maximize crop yields.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}