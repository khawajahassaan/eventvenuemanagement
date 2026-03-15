import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/ui/card";
import { Users, Building2, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const monthlyRevenue = [
  { month: "Sep", revenue: 2450000, bookings: 28 },
  { month: "Oct", revenue: 2680000, bookings: 32 },
  { month: "Nov", revenue: 2920000, bookings: 35 },
  { month: "Dec", revenue: 3450000, bookings: 42 },
  { month: "Jan", revenue: 3150000, bookings: 38 },
  { month: "Feb", revenue: 3360000, bookings: 40 },
  { month: "Mar", revenue: 3720000, bookings: 45 },
];

const bookingsByStatus = [
  { name: "Confirmed", value: 156, color: "#10b981" },
  { name: "Pending", value: 42, color: "#f59e0b" },
  { name: "Cancelled", value: 18, color: "#ef4444" },
  { name: "Completed", value: 284, color: "#0f4c81" },
];

const topVenues = [
  { name: "Grand Palace Banquet Hall", bookings: 45, revenue: 8100000 },
  { name: "Sky View Convention Center", bookings: 38, revenue: 9500000 },
  { name: "Royal Crystal Ballroom", bookings: 32, revenue: 9600000 },
  { name: "Rose Garden Marquee", bookings: 28, revenue: 4200000 },
  { name: "Business Hub Conference Hall", bookings: 24, revenue: 1920000 },
];

const recentActivity = [
  { id: 1, type: "booking", user: "Ahmed Khan", action: "created new booking", venue: "Grand Palace", time: "2 hours ago" },
  { id: 2, type: "venue", user: "Sara Malik", action: "added new venue", venue: "Pearl Gardens", time: "4 hours ago" },
  { id: 3, type: "payment", user: "Hassan Raza", action: "completed payment", venue: "Sky View Center", time: "6 hours ago" },
  { id: 4, type: "dispute", user: "Fatima Ali", action: "raised dispute", venue: "Crystal Ballroom", time: "8 hours ago" },
];

export function AdminDashboard() {
  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalBookings = bookingsByStatus.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">System overview and analytics</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-semibold text-gray-900">2,847</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +12% from last month
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Venues</p>
                  <p className="text-3xl font-semibold text-gray-900">156</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Across 15 cities</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-3xl font-semibold text-gray-900">{totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Last 6 months</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-3xl font-semibold text-gray-900">PKR {(totalRevenue / 1000000).toFixed(1)}M</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Last 7 months</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            <div className="col-span-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => `PKR ${Number(value).toLocaleString()}`}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#0f4c81" strokeWidth={2} dot={{ fill: '#0f4c81' }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div className="col-span-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Bookings by Status</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bookingsByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {bookingsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {bookingsByStatus.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs text-gray-700">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Top Venues */}
            <div className="col-span-7">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Venues</h2>
                <div className="space-y-4">
                  {topVenues.map((venue, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-700">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{venue.name}</p>
                        <p className="text-sm text-gray-600">{venue.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">PKR {(venue.revenue / 1000000).toFixed(1)}M</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="col-span-5">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === "booking" ? "bg-blue-500" :
                        activity.type === "venue" ? "bg-green-500" :
                        activity.type === "payment" ? "bg-purple-500" :
                        "bg-red-500"
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-600">{activity.venue}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
