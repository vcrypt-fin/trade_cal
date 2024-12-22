import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface EconomicEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  impact: 'high' | 'medium' | 'low';
  forecast?: string;
  previous?: string;
}

const EconomicCalendarWidget: React.FC = () => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement real API call
    // For now using mock data
    const mockEvents: EconomicEvent[] = [
      {
        id: '1',
        title: 'FOMC Meeting Minutes',
        date: '2024-01-15',
        time: '14:00',
        impact: 'high',
        forecast: 'No Change',
        previous: '5.50%'
      },
      {
        id: '2',
        title: 'US CPI m/m',
        date: '2024-01-16',
        time: '08:30',
        impact: 'high',
        forecast: '0.2%',
        previous: '0.1%'
      },
      {
        id: '3',
        title: 'US Retail Sales m/m',
        date: '2024-01-17',
        time: '08:30',
        impact: 'medium',
        forecast: '0.3%',
        previous: '0.2%'
      }
    ];

    setEvents(mockEvents);
    setLoading(false);
  }, []);

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return 'text-red-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-white/60';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white/60">Loading economic calendar...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Economic Calendar</h3>
        {/* <button className="text-white/60 hover:text-white/80 text-sm">Refresh</button> */}
      </div>
      <div className="flex-1 overflow-y-auto space-y-3">
        {events.map((event) => (
          <div 
            key={event.id}
            className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-medium ${getImpactColor(event.impact)}`}>
                    {event.impact.toUpperCase()}
                  </span>
                  <span className="text-white/40 text-sm">•</span>
                  <div className="flex items-center gap-1 text-white/60">
                    <Calendar size={14} />
                    <span className="text-sm">{formatDate(event.date)}</span>
                  </div>
                  <span className="text-white/40 text-sm">•</span>
                  <div className="flex items-center gap-1 text-white/60">
                    <Clock size={14} />
                    <span className="text-sm">{event.time}</span>
                  </div>
                </div>
                <h4 className="text-white font-medium mb-2">{event.title}</h4>
                {(event.forecast || event.previous) && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {event.forecast && (
                      <div>
                        <span className="text-white/40 text-xs block mb-1">Forecast</span>
                        <span className="text-white/80 text-sm">{event.forecast}</span>
                      </div>
                    )}
                    {event.previous && (
                      <div>
                        <span className="text-white/40 text-xs block mb-1">Previous</span>
                        <span className="text-white/80 text-sm">{event.previous}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EconomicCalendarWidget;