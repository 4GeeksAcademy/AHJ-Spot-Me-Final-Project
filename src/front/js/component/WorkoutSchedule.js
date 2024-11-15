import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

const WorkoutScheduleSelector = () => {
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  
  const daysOfWeek = [
    'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
  ];
  
  const timeSlots = [
    { id: 'EARLY_MORNING', label: 'Early Morning (5-8 AM)', icon: '🌅' },
    { id: 'MORNING', label: 'Morning (8-11 AM)', icon: '☀️' },
    { id: 'MIDDAY', label: 'Midday (11 AM-2 PM)', icon: '🌤️' },
    { id: 'AFTERNOON', label: 'Afternoon (2-5 PM)', icon: '☀️' },
    { id: 'EVENING', label: 'Evening (5-8 PM)', icon: '🌅' },
    { id: 'NIGHT', label: 'Night (8-11 PM)', icon: '🌙' }
  ];
  
  const toggleTimeSlot = (day, timeSlot) => {
    const scheduleKey = `${day}-${timeSlot}`;
    setSelectedSchedules(prev => {
      if (prev.includes(scheduleKey)) {
        return prev.filter(item => item !== scheduleKey);
      }
      return [...prev, scheduleKey];
    });
  };
  
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Workout Schedule Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border"></th>
                {daysOfWeek.map(day => (
                  <th key={day} className="p-2 border text-center">
                    {day.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(slot => (
                <tr key={slot.id}>
                  <td className="p-2 border">
                    <div className="flex items-center gap-2">
                      <span>{slot.icon}</span>
                      <span>{slot.label}</span>
                    </div>
                  </td>
                  {daysOfWeek.map(day => {
                    const scheduleKey = `${day}-${slot.id}`;
                    const isSelected = selectedSchedules.includes(scheduleKey);
                    return (
                      <td key={`${day}-${slot.id}`} className="p-2 border text-center">
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          className={`w-full h-full min-h-10 ${isSelected ? 'bg-blue-500 text-white' : ''}`}
                          onClick={() => toggleTimeSlot(day, slot.id)}
                        >
                          {isSelected ? '✓' : ''}
                        </Button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutScheduleSelector;