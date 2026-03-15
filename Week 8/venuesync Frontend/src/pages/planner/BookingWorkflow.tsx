import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Check } from "lucide-react";
import { useParams, useNavigate } from "react-router";

const statusSteps = [
  { id: 1, label: "Requested", status: "complete" },
  { id: 2, label: "Approved", status: "active" },
  { id: 3, label: "Payment", status: "pending" },
  { id: 4, label: "Confirmed", status: "pending" },
];

export function BookingWorkflow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to payment page
    navigate(`/planner/payment/${id}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="planner" />
      
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Booking Request</h1>
            <p className="text-gray-600 mt-1">Complete your venue booking details</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 space-y-6">
              {/* Status Timeline */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Status</h2>
                <div className="relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                    <div className="h-full bg-primary" style={{ width: "25%" }}></div>
                  </div>
                  <div className="relative flex justify-between">
                    {statusSteps.map((step) => (
                      <div key={step.id} className="flex flex-col items-center">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            step.status === "complete" 
                              ? "bg-primary border-primary text-white" 
                              : step.status === "active"
                              ? "bg-primary border-primary text-white animate-pulse"
                              : "bg-white border-gray-300 text-gray-400"
                          }`}
                        >
                          {step.status === "complete" ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <span>{step.id}</span>
                          )}
                        </div>
                        <span className={`text-sm mt-2 ${
                          step.status === "pending" ? "text-gray-500" : "text-gray-900 font-medium"
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Booking Form */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Event Details</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventName">Event Name</Label>
                      <Input 
                        id="eventName"
                        placeholder="e.g., Wedding Reception"
                        className="mt-1.5 bg-input-background"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventType">Event Type</Label>
                      <select 
                        id="eventType"
                        className="mt-1.5 w-full px-3 py-2 bg-input-background border border-gray-300 rounded-md"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="wedding">Wedding</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="birthday">Birthday Party</option>
                        <option value="conference">Conference</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventDate">Event Date</Label>
                      <Input 
                        id="eventDate"
                        type="date"
                        className="mt-1.5 bg-input-background"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="guestCount">Expected Guests</Label>
                      <Input 
                        id="guestCount"
                        type="number"
                        placeholder="e.g., 300"
                        className="mt-1.5 bg-input-background"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input 
                        id="startTime"
                        type="time"
                        className="mt-1.5 bg-input-background"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input 
                        id="endTime"
                        type="time"
                        className="mt-1.5 bg-input-background"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contactName">Contact Person Name</Label>
                    <Input 
                      id="contactName"
                      placeholder="Full name"
                      className="mt-1.5 bg-input-background"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input 
                        id="contactPhone"
                        type="tel"
                        placeholder="+92 300 1234567"
                        className="mt-1.5 bg-input-background"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input 
                        id="contactEmail"
                        type="email"
                        placeholder="email@example.com"
                        className="mt-1.5 bg-input-background"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requirements">Special Requirements</Label>
                    <Textarea 
                      id="requirements"
                      placeholder="Any special requests or requirements for the venue..."
                      className="mt-1.5 bg-input-background"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <input type="checkbox" id="terms" required className="w-4 h-4" />
                    <label htmlFor="terms" className="text-sm text-gray-700">
                      I agree to the venue's terms and conditions and cancellation policy
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Submit Booking Request
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Summary Card */}
            <div className="col-span-4">
              <Card className="p-6 sticky top-8">
                <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Venue</p>
                    <p className="font-medium">Grand Palace Banquet Hall</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-sm">Gulberg III, Lahore</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="text-sm">Up to 500 guests</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Venue Cost</span>
                    <span className="font-medium">PKR 180,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">PKR 5,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium">PKR 9,250</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t font-semibold">
                    <span>Total Amount</span>
                    <span className="text-lg">PKR 194,250</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Cancellation Policy</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Full refund: 30+ days before</li>
                    <li>• 50% refund: 15-30 days before</li>
                    <li>• No refund: Less than 15 days</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
