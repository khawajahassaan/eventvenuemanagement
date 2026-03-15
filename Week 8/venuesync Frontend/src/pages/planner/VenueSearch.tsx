/**
 * VenueSearch — with fully working client-side filters
 *
 * Filters applied:
 *   - Location (text match on venue.location)
 *   - Price range (min / max per day)
 *   - Capacity (minimum guests)
 *   - Amenities (checkbox — venue must have ALL ticked amenities)
 *   - Sort (price low→high, price high→low, rating, capacity)
 *
 * ─── BACKEND INTEGRATION ────────────────────────────────────────────────────
 * Replace the static `allVenues` array with:
 *   const { data, isLoading } = useVenueSearch(searchParams);
 *   const allVenues = data?.data ?? [];
 * where searchParams is built from the filter state below.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Label } from "../../components/ui/label";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Search, MapPin, Users, Star, Grid3x3, List, X } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router";

const ALL_VENUES = [
  { id: 1, name: "Grand Palace Banquet Hall",    image: "https://images.unsplash.com/photo-1765947384834-3bdcffcaffff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwYmFucXVldCUyMGhhbGwlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzIzODgwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080", price: 180000, rating: 4.8, capacity: 500, location: "Gulberg, Lahore",                amenities: ["Parking", "AC", "Catering", "Stage"] },
  { id: 2, name: "Sky View Convention Center",   image: "https://images.unsplash.com/photo-1771911650360-31fdb3344c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25mZXJlbmNlJTIwZXZlbnQlMjBzcGFjZXxlbnwxfHx8fDE3NzIzODgwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080", price: 250000, rating: 4.9, capacity: 800, location: "DHA Phase 5, Karachi",           amenities: ["Parking", "AC", "WiFi", "AV Equipment"] },
  { id: 3, name: "Rose Garden Marquee",          image: "https://images.unsplash.com/photo-1762216444265-a675abbb48dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZ2FyZGVuJTIwcGFydHklMjB2ZW51ZXxlbnwxfHx8fDE3NzIzODgwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080", price: 150000, rating: 4.6, capacity: 300, location: "F-7, Islamabad",                 amenities: ["Parking", "Generator", "Outdoor", "Garden"] },
  { id: 4, name: "Royal Crystal Ballroom",       image: "https://images.unsplash.com/photo-1769018508631-fe4ebf3fba3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiYWxscm9vbSUyMHZlbnVlfGVufDF8fHx8MTc3MjM4ODAwN3ww&ixlib=rb-4.1.0&q=80&w=1080",  price: 300000, rating: 4.9, capacity: 600, location: "MM Alam Road, Lahore",           amenities: ["Parking", "AC", "Catering", "Decoration"] },
  { id: 5, name: "Business Hub Conference Hall", image: "https://images.unsplash.com/photo-1769667693219-4d8e44b6a3b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBtZWV0aW5nJTIwaGFsbHxlbnwxfHx8fDE3NzIzODgwMDd8MA&ixlib=rb-4.1.0&q=80&w=1080",  price:  80000, rating: 4.5, capacity: 150, location: "I.I. Chundrigar Road, Karachi",  amenities: ["WiFi", "AC", "Projector", "Parking"] },
  { id: 6, name: "Sunset Rooftop Terrace",       image: "https://images.unsplash.com/photo-1746021426008-682061b8ffeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29mdG9wJTIwZXZlbnQlMjB0ZXJyYWNlfGVufDF8fHx8MTc3MjM4ODAwN3ww&ixlib=rb-4.1.0&q=80&w=1080",  price: 120000, rating: 4.7, capacity: 200, location: "Clifton, Karachi",               amenities: ["Outdoor", "View", "Parking", "Generator"] },
];

const AMENITY_OPTIONS = ["Parking", "AC", "WiFi", "Catering", "Stage", "Outdoor", "Generator", "Projector"];
const SORT_OPTIONS = [
  { value: "default",      label: "Relevance" },
  { value: "price_asc",    label: "Price: Low → High" },
  { value: "price_desc",   label: "Price: High → Low" },
  { value: "rating_desc",  label: "Highest Rated" },
  { value: "capacity_desc",label: "Largest Capacity" },
];

interface Filters {
  location: string;
  minPrice: string;
  maxPrice: string;
  capacity: string;
  amenities: string[];
  sort: string;
}

const DEFAULT_FILTERS: Filters = {
  location: "", minPrice: "", maxPrice: "", capacity: "", amenities: [], sort: "default",
};

export function VenueSearch() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<Filters>(DEFAULT_FILTERS);

  const updateFilter = (key: keyof Filters, value: string | string[]) =>
    setFilters((f) => ({ ...f, [key]: value }));

  const toggleAmenity = (amenity: string) => {
    setFilters((f) => ({
      ...f,
      amenities: f.amenities.includes(amenity)
        ? f.amenities.filter((a) => a !== amenity)
        : [...f.amenities, amenity],
    }));
  };

  const handleApply = () => setApplied({ ...filters });

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setApplied(DEFAULT_FILTERS);
  };

  const activeFilterCount = [
    applied.location,
    applied.minPrice,
    applied.maxPrice,
    applied.capacity,
    ...applied.amenities,
  ].filter(Boolean).length;

  // ── Filtering + sorting ────────────────────────────────────────────────────
  const results = useMemo(() => {
    let list = [...ALL_VENUES];

    if (applied.location.trim()) {
      const q = applied.location.trim().toLowerCase();
      list = list.filter((v) => v.location.toLowerCase().includes(q) || v.name.toLowerCase().includes(q));
    }
    if (applied.minPrice) list = list.filter((v) => v.price >= Number(applied.minPrice));
    if (applied.maxPrice) list = list.filter((v) => v.price <= Number(applied.maxPrice));
    if (applied.capacity) list = list.filter((v) => v.capacity >= Number(applied.capacity));
    if (applied.amenities.length) {
      list = list.filter((v) => applied.amenities.every((a) => v.amenities.includes(a)));
    }

    switch (applied.sort) {
      case "price_asc":     list.sort((a, b) => a.price    - b.price);    break;
      case "price_desc":    list.sort((a, b) => b.price    - a.price);    break;
      case "rating_desc":   list.sort((a, b) => b.rating   - a.rating);   break;
      case "capacity_desc": list.sort((a, b) => b.capacity - a.capacity); break;
    }

    return list;
  }, [applied]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="planner" />
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Search Venues</h1>
            <p className="text-gray-600 mt-1">Find the perfect venue for your event</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* ── Filters panel ─────────────────────────────────────────── */}
            <div className="col-span-3">
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1 text-xs text-red-600 hover:underline"
                    >
                      <X className="w-3 h-3" /> Clear all ({activeFilterCount})
                    </button>
                  )}
                </div>

                <div className="space-y-5">
                  {/* Location */}
                  <div>
                    <Label htmlFor="location" className="text-sm">Location / Venue Name</Label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="e.g. Karachi or Grand"
                        className="pl-9 bg-input-background"
                        value={filters.location}
                        onChange={(e) => updateFilter("location", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Price range */}
                  <div>
                    <Label className="text-sm">Price Range (PKR / day)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      <Input
                        type="number"
                        placeholder="Min"
                        className="bg-input-background"
                        value={filters.minPrice}
                        onChange={(e) => updateFilter("minPrice", e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        className="bg-input-background"
                        value={filters.maxPrice}
                        onChange={(e) => updateFilter("maxPrice", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Capacity */}
                  <div>
                    <Label className="text-sm">Minimum Capacity</Label>
                    <div className="relative mt-1.5">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        type="number"
                        placeholder="Number of guests"
                        className="pl-9 bg-input-background"
                        value={filters.capacity}
                        onChange={(e) => updateFilter("capacity", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <Label className="text-sm mb-2 block">Amenities</Label>
                    <div className="space-y-2">
                      {AMENITY_OPTIONS.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity}
                            checked={filters.amenities.includes(amenity)}
                            onCheckedChange={() => toggleAmenity(amenity)}
                          />
                          <label htmlFor={amenity} className="text-sm text-gray-700 cursor-pointer">
                            {amenity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <Label className="text-sm">Sort By</Label>
                    <select
                      className="mt-1.5 w-full px-3 py-2 bg-input-background border border-gray-300 rounded-md text-sm"
                      value={filters.sort}
                      onChange={(e) => updateFilter("sort", e.target.value)}
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  <Button className="w-full" onClick={handleApply}>
                    <Search className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                </div>
              </Card>
            </div>

            {/* ── Results ────────────────────────────────────────────────── */}
            <div className="col-span-9">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-600">
                  {results.length} {results.length === 1 ? "venue" : "venues"} found
                  {activeFilterCount > 0 && (
                    <span className="ml-2 text-primary font-medium">({activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active)</span>
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {results.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-lg text-gray-500 mb-2">No venues match your filters</p>
                  <p className="text-sm text-gray-400 mb-4">Try adjusting your search criteria</p>
                  <Button variant="outline" onClick={handleReset}>Clear Filters</Button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-6">
                  {results.map((venue) => (
                    <Link key={venue.id} to={`/planner/venue/${venue.id}`}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48 bg-gray-200">
                          <ImageWithFallback src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
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
                              <span>{venue.capacity}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {venue.amenities.slice(0, 3).map((a) => (
                              <span key={a} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{a}</span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t">
                            <span className="text-sm text-gray-600">Per day</span>
                            <span className="font-semibold text-primary">PKR {venue.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((venue) => (
                    <Link key={venue.id} to={`/planner/venue/${venue.id}`}>
                      <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          <div className="w-32 h-32 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                            <ImageWithFallback src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{venue.location}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{venue.rating}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                <span>Capacity: {venue.capacity}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-3">
                              {venue.amenities.map((a) => (
                                <span key={a} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{a}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xl font-semibold text-primary">PKR {venue.price.toLocaleString()}</span>
                            <p className="text-xs text-gray-600 mt-1">per day</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
