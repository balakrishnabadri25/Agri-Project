import { Card, CardContent } from '@/components/ui/card';

export const StatsCard = ({ title, value, icon: Icon, gradient }) => {
  const gradientClasses = {
    field: 'bg-gradient-field',
    sky: 'bg-gradient-sky',
    harvest: 'bg-gradient-harvest',
    soil: 'bg-gradient-soil'
  };

  return (
    <Card className="overflow-hidden shadow-custom-md hover:shadow-custom-lg transition-smooth">
      <CardContent className="p-0">
        <div className={`${gradientClasses[gradient]} text-white p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80 mb-1">{title}</p>
              <p className="text-4xl font-bold">{value}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Icon className="h-8 w-8" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;