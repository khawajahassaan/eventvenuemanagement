import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { DollarSign, Calendar, Building2, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const bookingRequests = [
  { id: "BK-2451", planner: "Ahmed Khan", venue: "Grand Palace Banquet Hall", date: "2026-03-22", guests: 450, amount: 180000, status: "pending" },
  { id: "BK-2452", planner: "Fatima Ali", venue: "Sky View Convention Center", date: "2026-04-05", guests: 700, amount: 250000, status: "pending" },
  { id: "BK-2453", planner: "Hassan Raza", venue: "Grand Palace Banquet Hall", date: "2026-04-18", guests: 380, amount: 180000, status: "pending" },
];

const recentBookings = [
  { id: "BK-2448", venue: "Grand Palace Banquet Hall", date: "2026-03-08", status: "approved", amount: 180000 },
  { id: "BK-2449", venue: "Sky View Convention Center", date: "2026-03-12", status: "completed", amount: 250000 },
  { id: "BK-2450", venue: "Grand Palace Banquet Hall", date: "2026-03-15", status: "approved", amount: 180000 },
];

const monthlyData = [
  { month: "Oct", revenue: 450000, bookings: 3 },
  { month: "Nov", revenue: 680000, bookings: 4 },
  { month: "Dec", revenue: 920000, bookings: 6 },
  { month: "Jan", revenue: 750000, bookings: 5 },
  { month: "Feb", revenue: 860000, bookings: 5 },
  { month: "Mar", revenue: 1020000, bookings: 7 },
];

export function OwnerDashboard() {
  const totalEarnings = monthlyData.reduce((sum, m) => sum + m.revenue, 0);
  const pendingRequests = bookingRequests.length;
  const approvedBookings = recentBookings.filter(b => b.status === "approved").length;

  const handleApprove = (bookingId: string) => {
    console.log("Approved:", bookingId);
  };

  const handleReject = (bookingId: string) => {
    console.log("Rejected:", bookingId);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="owner" />
      
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Venue Owner Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your venue bookings and requests</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                  <p className="text-2xl font-semibold text-gray-900">PKR {(totalEarnings / 1000).toFixed(0)}K</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                Last 6 months
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
                  <p className="text-2xl font-semibold text-gray-900">{pendingRequests}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Requires your approval</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Bookings</p>
                  <p className="text-2xl font-semibold text-gray-900">{approvedBookings}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Confirmed bookings</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">My Venues</p>
                  <p className="text-2xl font-semibold text-gray-900">3</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Listed venues</p>
            </Card>
          </div>

          {/* Booking Requests */}
          <Card className="mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Pending Booking Requests</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Event Planner</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.planner}</TableCell>
                      <TableCell>{request.venue}</TableCell>
                      <TableCell>{new Date(request.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</TableCell>
                      <TableCell>{request.guests}</TableCell>
                      <TableCell>PKR {request.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(request.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReject(request.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="grid grid-cols-12 gap-6">
            {/* Revenue Chart */}
            <div className="col-span-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Performance</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => `PKR ${Number(value).toLocaleString()}`}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Bar dataKey="revenue" fill="#0f4c81" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Venue Performance */}
            <div className="col-span-4">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Venue Performance</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">Grand Palace Banquet Hall</p>
                    <p className="text-xs text-gray-600 mt-1">12 bookings this month</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-600">Occupancy</span>
                      <span className="text-sm font-medium text-green-700">85%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">Sky View Convention Center</p>
                    <p className="text-xs text-gray-600 mt-1">8 bookings this month</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-600">Occupancy</span>
                      <span className="text-sm font-medium text-green-700">72%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 text-sm">Rose Garden Marquee</p>
                    <p className="text-xs text-gray-600 mt-1">6 bookings this month</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-600">Occupancy</span>
                      <span className="text-sm font-medium text-yellow-700">58%</span>
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
