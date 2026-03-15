import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Plus, Clock, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

const scheduleItems = [
  { id: 1, time: "14:00", duration: 30, activity: "Guest Reception & Registration", responsible: "Event Staff" },
  { id: 2, time: "14:30", duration: 60, activity: "Welcome Drinks & Networking", responsible: "Catering Team" },
  { id: 3, time: "15:30", duration: 15, activity: "Opening Ceremony", responsible: "MC Host" },
  { id: 4, time: "15:45", duration: 45, activity: "Keynote Speech", responsible: "Chief Guest" },
  { id: 5, time: "16:30", duration: 30, activity: "Tea & Refreshments Break", responsible: "Catering Team" },
  { id: 6, time: "17:00", duration: 60, activity: "Main Event Program", responsible: "Program Team" },
  { id: 7, time: "18:00", duration: 90, activity: "Dinner Service", responsible: "Catering Team" },
  { id: 8, time: "19:30", duration: 60, activity: "Entertainment & Music", responsible: "DJ & Band" },
  { id: 9, time: "20:30", duration: 30, activity: "Closing Ceremony & Thanks", responsible: "MC Host" },
  { id: 10, time: "21:00", duration: 30, activity: "Guest Departure", responsible: "Event Staff" },
];

export function EventSchedule() {
  const { eventId } = useParams();
  const [showAddForm, setShowAddForm] = useState(false);

  const totalDuration = scheduleItems.reduce((sum, item) => sum + item.duration, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="planner" />
      
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Event Schedule</h1>
            <p className="text-gray-600 mt-1">Build and manage your event day timeline</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8">
              {/* Schedule Timeline */}
              <Card className="p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Event Timeline</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Total Duration: {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                    </p>
                  </div>
                  <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity
                  </Button>
                </div>

                {showAddForm && (
                  <div className="p-4 bg-gray-50 rounded-lg mb-6">
                    <h3 className="font-medium text-gray-900 mb-4">Add New Activity</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="time">Start Time</Label>
                        <Input id="time" type="time" className="mt-1.5 bg-white" />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input id="duration" type="number" placeholder="30" className="mt-1.5 bg-white" />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="activity">Activity Name</Label>
                        <Input id="activity" placeholder="e.g., Welcome Speech" className="mt-1.5 bg-white" />
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="responsible">Responsible Person/Team</Label>
                        <Input id="responsible" placeholder="e.g., Event Manager" className="mt-1.5 bg-white" />
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                          Cancel
                        </Button>
                        <Button size="sm">Add to Schedule</Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {scheduleItems.map((item, index) => (
                    <div key={item.id} className="relative">
                      {index !== 0 && (
                        <div className="absolute left-6 -top-3 bottom-full w-0.5 h-3 bg-gray-300"></div>
                      )}
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-20 pt-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{item.time}</span>
                          </div>
                          <span className="text-xs text-gray-500 ml-6">{item.duration} min</span>
                        </div>
                        <div className="flex-1 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">{item.activity}</h4>
                              <p className="text-sm text-gray-600">Handled by: {item.responsible}</p>
                            </div>
                            <div className="flex gap-2">
                              <button className="p-1.5 hover:bg-gray-100 rounded">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                              <button className="p-1.5 hover:bg-gray-100 rounded">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="col-span-4">
              {/* Quick Stats */}
              <Card className="p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Schedule Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Activities</span>
                    <span className="font-medium">{scheduleItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Event Start Time</span>
                    <span className="font-medium">{scheduleItems[0]?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Event End Time</span>
                    <span className="font-medium">{scheduleItems[scheduleItems.length - 1]?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Duration</span>
                    <span className="font-medium">
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                    </span>
                  </div>
                </div>
              </Card>

              {/* Key Responsibilities */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Key Responsibilities</h3>
                <div className="space-y-3">
                  {[...new Set(scheduleItems.map(item => item.responsible))].map((person, idx) => {
                    const tasks = scheduleItems.filter(item => item.responsible === person).length;
                    return (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900 text-sm">{person}</p>
                        <p className="text-xs text-gray-600 mt-1">{tasks} activities assigned</p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Actions */}
              <Card className="p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Print Schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Export to PDF
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="w-4 h-4 mr-2" />
                    Share with Team
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
