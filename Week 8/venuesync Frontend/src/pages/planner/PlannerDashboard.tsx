import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Calendar, DollarSign, Clock, TrendingUp } from "lucide-react";

const bookings = [
  { id: "BK-2401", venue: "Grand Palace Banquet Hall", date: "2026-03-15", status: "approved", amount: 180000 },
  { id: "BK-2402", venue: "Sky View Convention Center", date: "2026-03-28", status: "pending", amount: 250000 },
  { id: "BK-2403", venue: "Rose Garden Marquee", date: "2026-04-10", status: "approved", amount: 150000 },
  { id: "BK-2404", venue: "Royal Crystal Ballroom", date: "2026-04-22", status: "rejected", amount: 300000 },
  { id: "BK-2405", venue: "Business Hub Conference Hall", date: "2026-05-05", status: "cancelled", amount: 80000 },
  { id: "BK-2406", venue: "Sunset Rooftop Terrace", date: "2026-05-18", status: "pending", amount: 120000 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved": return "bg-green-100 text-green-800 border-green-200";
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "rejected": return "bg-red-100 text-red-800 border-red-200";
    case "cancelled": return "bg-gray-100 text-gray-800 border-gray-200";
    default: return "";
  }
};

export function PlannerDashboard() {
  const upcomingEvents = bookings.filter(b => b.status === "approved").length;
  const totalSpend = bookings.filter(b => b.status === "approved").reduce((sum, b) => sum + b.amount, 0);
  const pendingRequests = bookings.filter(b => b.status === "pending").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="planner" />
      
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Event Planner Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your venue bookings and events</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upcoming Events</p>
                  <p className="text-3xl font-semibold text-gray-900">{upcomingEvents}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                2 events this month
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Spend</p>
                  <p className="text-3xl font-semibold text-gray-900">PKR {totalSpend.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">From {upcomingEvents} approved bookings</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
                  <p className="text-3xl font-semibold text-gray-900">{pendingRequests}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Awaiting venue owner approval</p>
            </Card>
          </div>

          {/* Bookings Table */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Booking Status</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">{booking.id}</TableCell>
                      <TableCell>{booking.venue}</TableCell>
                      <TableCell>{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                      <TableCell>PKR {booking.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <button className="text-primary hover:underline text-sm">View Details</button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
