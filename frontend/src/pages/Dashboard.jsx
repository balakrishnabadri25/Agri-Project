import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Leaf, Upload, FileText, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import StatsCard from '@/components/StatsCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [open, setOpen] = useState(false);
  const [newField, setNewField] = useState({ name: '', location: '' });

  // Load fields from localStorage on mount
  useEffect(() => {
    const savedFields = localStorage.getItem('agriFields');
    if (savedFields) {
      setFields(JSON.parse(savedFields));
    } else {
      // Initialize with sample data
      const sampleFields = [
        {
          id: '1',
          name: 'North Field',
          location: 'Plot A, Section 1',
          lastUpdated: new Date().toISOString(),
          hasImages: false,
          hasSoilData: false
        },
        {
          id: '2',
          name: 'South Field',
          location: 'Plot B, Section 2',
          lastUpdated: new Date().toISOString(),
          hasImages: false,
          hasSoilData: false
        }
      ];
      setFields(sampleFields);
      localStorage.setItem('agriFields', JSON.stringify(sampleFields));
    }
  }, []);

  const handleAddField = () => {
    if (!newField.name || !newField.location) {
      toast.error('Please fill in all fields');
      return;
    }

    const field = {
      id: Date.now().toString(),
      name: newField.name,
      location: newField.location,
      lastUpdated: new Date().toISOString(),
      hasImages: false,
      hasSoilData: false
    };

    const updatedFields = [...fields, field];
    setFields(updatedFields);
    localStorage.setItem('agriFields', JSON.stringify(updatedFields));
    setNewField({ name: '', location: '' });
    setOpen(false);
    toast.success('Field added successfully!');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-field text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              AI-Powered Farm Management
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Monitor crop health, analyze soil conditions, and optimize your farming operations with artificial intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Fields"
            value={fields.length}
            icon={Leaf}
            gradient="field"
          />
          <StatsCard
            title="Images Analyzed"
            value={fields.filter(f => f.hasImages).length}
            icon={Upload}
            gradient="sky"
          />
          <StatsCard
            title="Soil Reports"
            value={fields.filter(f => f.hasSoilData).length}
            icon={FileText}
            gradient="harvest"
          />
        </div>
      </div>

      {/* Fields Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Fields</h2>
            <p className="text-muted-foreground mt-1">Manage and monitor all your agricultural plots</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary hover:bg-primary-dark">
                <Plus className="h-5 w-5 mr-2" />
                Add New Field
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Field</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Field Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., North Field"
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Plot A, Section 1"
                    value={newField.location}
                    onChange={(e) => setNewField({ ...newField, location: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddField} className="w-full bg-primary hover:bg-primary-dark">
                  Add Field
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {fields.length === 0 ? (
          <Card className="p-12 text-center">
            <Leaf className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No fields added yet</h3>
            <p className="text-muted-foreground mb-6">Start by adding your first field to begin monitoring</p>
            <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary-dark">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Field
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <Card key={field.id} className="hover:shadow-lg transition-smooth overflow-hidden">
                <div className="h-2 bg-gradient-field" />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{field.name}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {field.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        Updated {formatDate(field.lastUpdated)}
                      </div>
                    </div>
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-primary/10 hover:text-primary hover:border-primary"
                    onClick={() => navigate(`/upload-image/${field.id}`)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-accent/10 hover:text-accent hover:border-accent"
                    onClick={() => navigate(`/upload-soil/${field.id}`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Soil Data
                  </Button>
                  <Button
                    variant="default"
                    className="w-full justify-start bg-gradient-field hover:opacity-90"
                    onClick={() => navigate(`/report/${field.id}`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}