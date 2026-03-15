import { Link } from "react-router";
import { Search, MapPin, Calendar, Users, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const featuredVenues = [
  {
    id: 1,
    name: "Grand Palace Banquet Hall",
    image: "https://images.unsplash.com/photo-1765947384834-3bdcffcaffff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwYmFucXVldCUyMGhhbGwlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzIzODgwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 180000,
    rating: 4.8,
    capacity: 500,
    location: "Gulberg, Lahore"
  },
  {
    id: 2,
    name: "Sky View Convention Center",
    image: "https://images.unsplash.com/photo-1771911650360-31fdb3344c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25mZXJlbmNlJTIwZXZlbnQlMjBzcGFjZXxlbnwxfHx8fDE3NzIzODgwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 250000,
    rating: 4.9,
    capacity: 800,
    location: "DHA Phase 5, Karachi"
  },
  {
    id: 3,
    name: "Rose Garden Marquee",
    image: "https://images.unsplash.com/photo-1762216444265-a675abbb48dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZ2FyZGVuJTIwcGFydHklMjB2ZW51ZXxlbnwxfHx8fDE3NzIzODgwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 150000,
    rating: 4.6,
    capacity: 300,
    location: "F-7, Islamabad"
  },
  {
    id: 4,
    name: "Royal Crystal Ballroom",
    image: "https://images.unsplash.com/photo-1769018508631-fe4ebf3fba3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYWxscm9vbSUyMHZlbnVlfGVufDF8fHx8MTc3MjM4ODAwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    price: 300000,
    rating: 4.9,
    capacity: 600,
    location: "MM Alam Road, Lahore"
  },
  {
    id: 5,
    name: "Business Hub Conference Hall",
    image: "https://images.unsplash.com/photo-1769667693219-4d8e44b6a3b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nJTIwaGFsbHxlbnwxfHx8fDE3NzIzODgwMDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    price: 80000,
    rating: 4.5,
    capacity: 150,
    location: "I.I. Chundrigar Road, Karachi"
  },
  {
    id: 6,
    name: "Sunset Rooftop Terrace",
    image: "https://images.unsplash.com/photo-1746021426008-682061b8ffeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwZXZlbnQlMjB0ZXJyYWNlfGVufDF8fHx8MTc3MjM4ODAwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    price: 120000,
    rating: 4.7,
    capacity: 200,
    location: "Clifton, Karachi"
  }
];

export function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-semibold text-xl">VS</span>
              </div>
              <span className="text-2xl font-semibold text-gray-900">VenueSync</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">Find Your Perfect Venue</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                placeholder="Location" 
                className="pl-10 bg-input-background border-gray-300"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                type="date"
                placeholder="Event Date" 
                className="pl-10 bg-input-background border-gray-300"
              />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input 
                type="number"
                placeholder="Guest Capacity" 
                className="pl-10 bg-input-background border-gray-300"
              />
            </div>
            <Link to="/planner/search">
              <Button className="w-full">
                <Search className="w-4 h-4 mr-2" />
                Search Venues
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Venues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVenues.map((venue) => (
              <Link key={venue.id} to={`/planner/venue/${venue.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-gray-200">
                    <ImageWithFallback 
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{venue.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{venue.location}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{venue.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{venue.capacity} guests</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm text-gray-600">Starting from</span>
                      <span className="font-semibold text-primary">PKR {venue.price.toLocaleString()}/day</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                  <span className="text-white font-semibold">VS</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">VenueSync</span>
              </div>
              <p className="text-sm text-gray-600">
                Professional venue booking and event management system for local venues and planners.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Contact Us</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Email: info@venuesync.pk</p>
                <p>Phone: +92 21 3456 7890</p>
                <p>Address: Karachi, Pakistan</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link to="/login" className="block text-gray-600 hover:text-primary">Login</Link>
                <Link to="/register" className="block text-gray-600 hover:text-primary">Register</Link>
                <Link to="/planner/search" className="block text-gray-600 hover:text-primary">Search Venues</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            © 2026 VenueSync. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
