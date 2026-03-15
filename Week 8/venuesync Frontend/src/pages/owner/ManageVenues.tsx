/**
 * ManageVenues — Add/Edit venue listings with real image upload
 *
 * IMAGE UPLOAD FLOW:
 *   1. User drops/picks images — previews shown immediately via FileReader
 *   2. On "Save Venue", POST /venues creates the venue record
 *   3. Then POST /venues/:id/images uploads the files as multipart/form-data
 *   4. Server returns array of CDN URLs which are stored on the venue record
 *
 * ─── BACKEND INTEGRATION ────────────────────────────────────────────────────
 * Uncomment the API calls in handleSaveVenue() once backend is ready.
 * The venuesApi.create() and venuesApi.uploadImages() functions are
 * already implemented in src/api/venues.ts
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Plus, Edit, Trash2, Upload, Calendar, Users, X, ImageIcon } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { venuesApi } from "../../api/venues";

// ─── Mock data (replace with useMyVenues() hook when backend is ready) ────────
const MOCK_VENUES = [
  { id: 1, name: "Grand Palace Banquet Hall",  location: "Gulberg III, Lahore",   capacity: 500, price: 180000, status: "active",      bookings: 12, image: "https://images.unsplash.com/photo-1765947384834-3bdcffcaffff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwYmFucXVldCUyMGhhbGwlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzIzODgwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 2, name: "Sky View Convention Center", location: "DHA Phase 5, Karachi", capacity: 800, price: 250000, status: "active",      bookings: 8,  image: "https://images.unsplash.com/photo-1771911650360-31fdb3344c74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb25mZXJlbmNlJTIwZXZlbnQlMjBzcGFjZXxlbnwxfHx8fDE3NzIzODgwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 3, name: "Rose Garden Marquee",        location: "F-7, Islamabad",       capacity: 300, price: 150000, status: "maintenance", bookings: 6,  image: "https://images.unsplash.com/photo-1762216444265-a675abbb48dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZ2FyZGVuJTIwcGFydHklMjB2ZW51ZXxlbnwxfHx8fDE3NzIzODgwMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
];

const BOOKED_DATES = [5, 6, 12, 15, 19, 20, 25, 28];

const generateCalendar = () => {
  const days = [];
  for (let i = 0; i < 6; i++) days.push({ day: null, booked: false });
  for (let day = 1; day <= 31; day++) days.push({ day, booked: BOOKED_DATES.includes(day) });
  return days;
};

const waitlist = [
  { id: 1, planner: "Ahmed Khan",  date: "2026-03-15", guests: 450, contact: "+92 300 1234567" },
  { id: 2, planner: "Sara Yousaf", date: "2026-03-19", guests: 380, contact: "+92 321 9988776" },
];

interface VenueForm {
  name: string;
  venueType: string;
  address: string;
  capacity: string;
  pricePerDay: string;
  description: string;
  amenities: string;
}

const EMPTY_FORM: VenueForm = {
  name: "", venueType: "Banquet Hall", address: "",
  capacity: "", pricePerDay: "", description: "", amenities: "",
};

export function ManageVenues() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<number | null>(null);
  const [form, setForm] = useState<VenueForm>(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const calendar = generateCalendar();

  const updateForm = (key: keyof VenueForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // ── Image handling ─────────────────────────────────────────────────────────
  const addFiles = useCallback((files: FileList | File[]) => {
    const valid = Array.from(files).filter((f) =>
      f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024
    );
    if (valid.length === 0) return;

    setImageFiles((prev) => [...prev, ...valid]);
    valid.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  // ── Save venue ─────────────────────────────────────────────────────────────
  const handleSaveVenue = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setIsSaving(true);

    try {
      /**
       * ─── BACKEND INTEGRATION ──────────────────────────────────────────────
       * Step 1: Create venue record
       * const venue = await venuesApi.create({
       *   name: form.name,
       *   venueType: form.venueType,
       *   location: form.address,
       *   city: form.address.split(",").pop()?.trim() ?? "",
       *   capacity: Number(form.capacity),
       *   pricePerDay: Number(form.pricePerDay),
       *   description: form.description,
       *   amenities: form.amenities.split(",").map(a => a.trim()).filter(Boolean),
       * });
       *
       * Step 2: Upload images (only if any were selected)
       * if (imageFiles.length > 0) {
       *   await venuesApi.uploadImages(venue.id, imageFiles);
       * }
       *
       * Step 3: Refresh venue list
       * ─────────────────────────────────────────────────────────────────────
       */

      // Simulate save delay for demo
      await new Promise((r) => setTimeout(r, 1200));

      setForm(EMPTY_FORM);
      setImageFiles([]);
      setImagePreviews([]);
      setShowAddForm(false);
      alert(`Venue "${form.name}" saved! Connect backend to persist.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save venue";
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="owner" />
      <div className="flex-1">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Manage Venues</h1>
              <p className="text-gray-600 mt-1">Add, edit, and manage your venue listings</p>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Venue
            </Button>
          </div>

          {/* ── Add Venue Form ─────────────────────────────────────────────── */}
          {showAddForm && (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Venue</h2>
              {saveError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{saveError}</p>
                </div>
              )}

              <form onSubmit={handleSaveVenue} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="venueName">Venue Name</Label>
                    <Input id="venueName" placeholder="Enter venue name" className="mt-1.5 bg-input-background"
                      value={form.name} onChange={(e) => updateForm("name", e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="venueType">Venue Type</Label>
                    <select
                      className="mt-1.5 w-full px-3 py-2 bg-input-background border border-gray-300 rounded-md"
                      value={form.venueType}
                      onChange={(e) => updateForm("venueType", e.target.value)}
                    >
                      <option>Banquet Hall</option>
                      <option>Convention Center</option>
                      <option>Garden/Outdoor</option>
                      <option>Conference Room</option>
                      <option>Rooftop</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Full Address</Label>
                  <Input id="address" placeholder="Complete address with city" className="mt-1.5 bg-input-background"
                    value={form.address} onChange={(e) => updateForm("address", e.target.value)} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Guest Capacity</Label>
                    <Input id="capacity" type="number" placeholder="e.g., 500" className="mt-1.5 bg-input-background"
                      value={form.capacity} onChange={(e) => updateForm("capacity", e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="pricePerDay">Price Per Day (PKR)</Label>
                    <Input id="pricePerDay" type="number" placeholder="e.g., 180000" className="mt-1.5 bg-input-background"
                      value={form.pricePerDay} onChange={(e) => updateForm("pricePerDay", e.target.value)} required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Venue Description</Label>
                  <Textarea id="description" placeholder="Describe your venue..." className="mt-1.5 bg-input-background" rows={4}
                    value={form.description} onChange={(e) => updateForm("description", e.target.value)} />
                </div>

                <div>
                  <Label htmlFor="amenities">Amenities (comma separated)</Label>
                  <Input id="amenities" placeholder="e.g., Parking, AC, WiFi, Catering" className="mt-1.5 bg-input-background"
                    value={form.amenities} onChange={(e) => updateForm("amenities", e.target.value)} />
                </div>

                {/* ── Image Upload ──────────────────────────────────────── */}
                <div>
                  <Label>Venue Images</Label>

                  {/* Drop zone */}
                  <div
                    className={`mt-1.5 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {isDragging ? "Drop images here" : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && addFiles(e.target.files)}
                    />
                  </div>

                  {/* Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                      {/* Add more */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-primary transition-colors"
                      >
                        <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Add more</span>
                      </button>
                    </div>
                  )}

                  {imageFiles.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {imageFiles.length} image{imageFiles.length > 1 ? "s" : ""} selected
                      {" "}({(imageFiles.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1)} MB total)
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving…" : "Save Venue"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* ── Venues Table ──────────────────────────────────────────────── */}
          <Card className="mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Your Venues</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Venue</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Price/Day</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_VENUES.map((venue) => (
                    <TableRow key={venue.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                            <ImageWithFallback src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="font-medium">{venue.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{venue.location}</TableCell>
                      <TableCell>{venue.capacity} guests</TableCell>
                      <TableCell>PKR {venue.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          venue.status === "active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }>
                          {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{venue.bookings} this month</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedVenue(venue.id)}>
                            <Calendar className="w-4 h-4 mr-1" /> Calendar
                          </Button>
                          <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                          <Button size="sm" variant="outline"><Trash2 className="w-4 h-4 text-red-600" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* ── Availability Calendar + Waitlist ──────────────────────────── */}
          {selectedVenue && (
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-8">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability Calendar — March 2026</h2>
                  <div className="grid grid-cols-7 gap-2">
                    {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                      <div key={d} className="text-center text-sm font-medium text-gray-600 py-2">{d}</div>
                    ))}
                    {calendar.map((item, idx) => (
                      <div key={idx} className={`aspect-square flex items-center justify-center text-sm rounded cursor-pointer ${
                        item.day === null ? "" :
                        item.booked ? "bg-red-100 text-red-700 hover:bg-red-200" :
                        "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}>
                        {item.day}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-100 rounded"></div><span className="text-gray-600">Available</span></div>
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-100 rounded"></div><span className="text-gray-600">Booked</span></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">Click on dates to mark as unavailable or add manual bookings</p>
                </Card>
              </div>
              <div className="col-span-4">
                <Card className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Waitlist Requests</h3>
                  <div className="space-y-3">
                    {waitlist.map((item) => (
                      <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{item.planner}</p>
                            <p className="text-xs text-gray-600">{item.contact}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2"><Calendar className="w-3 h-3" /><span>{item.date}</span></div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3"><Users className="w-3 h-3" /><span>{item.guests} guests</span></div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 h-7 text-xs">Notify</Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs">Remove</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
