import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { MapPin, Users, Star, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";

const venueImages = [
  "https://images.unsplash.com/photo-1765947384834-3bdcffcaffff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwYmFucXVldCUyMGhhbGwlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzIzODgwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1769018508631-fe4ebf3fba3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYWxscm9vbSUyMHZlbnVlfGVufDF8fHx8MTc3MjM4ODAwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1771911650360-31fdb3344c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25mZXJlbmNlJTIwZXZlbnQlMjBzcGFjZXxlbnwxfHx8fDE3NzIzODgwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
];

// Mock availability calendar - March 2026
const generateCalendar = () => {
  const bookedDates = [5, 6, 12, 15, 19, 20, 25, 28];
  const days = [];
  const firstDay = 6; // March 1, 2026 is Saturday
  
  // Empty cells for days before month start
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: null, booked: false });
  }
  
  // Days of the month
  for (let day = 1; day <= 31; day++) {
    days.push({
      day,
      booked: bookedDates.includes(day)
    });
  }
  
  return days;
};

export function VenueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const calendar = generateCalendar();

  const venue = {
    name: "Grand Palace Banquet Hall",
    location: "123 Main Road, Gulberg III, Lahore",
    price: 180000,
    rating: 4.8,
    reviews: 124,
    capacity: 500,
    amenities: [
      "Parking Space (200 cars)",
      "Central Air Conditioning",
      "Professional Sound System",
      "LED Stage Lighting",
      "Bridal Room",
      "Generator Backup",
      "Catering Kitchen",
      "Security Guards",
      "Wheelchair Accessible",
      "WiFi Available"
    ],
    description: "Grand Palace Banquet Hall is a premium venue located in the heart of Gulberg, Lahore. With a capacity of up to 500 guests, it features modern amenities and elegant interiors perfect for weddings, corporate events, and social gatherings. Our professional staff ensures your event runs smoothly from start to finish."
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venueImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + venueImages.length) % venueImages.length);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="planner" />
      
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-6">
            <button 
              onClick={() => navigate("/planner/search")}
              className="text-primary hover:underline text-sm mb-3 inline-block"
            >
              ← Back to Search
            </button>
            <h1 className="text-3xl font-semibold text-gray-900">{venue.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{venue.rating}</span>
                <span className="text-gray-600 text-sm">({venue.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">{venue.location}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 space-y-6">
              {/* Image Gallery */}
              <Card className="overflow-hidden">
                <div className="relative h-96 bg-gray-200">
                  <ImageWithFallback 
                    src={venueImages[currentImageIndex]}
                    alt={venue.name}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {venueImages.map((_, idx) => (
                      <div 
                        key={idx}
                        className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                      />
                    ))}
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">About This Venue</h2>
                <p className="text-gray-700 leading-relaxed">{venue.description}</p>
              </Card>

              {/* Amenities */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-3">
                  {venue.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Availability Calendar */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability Calendar - March 2026</h2>
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                      {day}
                    </div>
                  ))}
                  {calendar.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`aspect-square flex items-center justify-center text-sm rounded ${
                        item.day === null 
                          ? "" 
                          : item.booked 
                          ? "bg-red-100 text-red-700" 
                          : "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                      }`}
                    >
                      {item.day}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded"></div>
                    <span className="text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 rounded"></div>
                    <span className="text-gray-600">Booked</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Booking Card */}
            <div className="col-span-4">
              <Card className="p-6 sticky top-8">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-semibold text-gray-900">PKR {venue.price.toLocaleString()}</span>
                    <span className="text-gray-600">/day</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Up to {venue.capacity} guests</span>
                  </div>
                </div>

                <Button 
                  className="w-full mb-3"
                  onClick={() => navigate(`/planner/booking/${id}`)}
                >
                  Request Booking
                </Button>
                <p className="text-xs text-gray-500 text-center">You won't be charged yet</p>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Deposit (30%)</span>
                    <span className="font-medium">PKR {(venue.price * 0.3).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">PKR 5,000</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-medium">Total Deposit</span>
                    <span className="font-semibold text-lg">PKR {(venue.price * 0.3 + 5000).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Cancellation Policy</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Full refund if cancelled 30 days before event</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>50% refund if cancelled 15-30 days before</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <span>No refund if cancelled within 15 days</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
