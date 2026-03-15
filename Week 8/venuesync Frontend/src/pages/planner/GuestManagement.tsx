import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Plus, QrCode, Download, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";

const guests = [
  { id: 1, name: "Ahmed Khan", email: "ahmed@example.com", phone: "+92 300 1234567", rsvp: "confirmed", qrGenerated: true, entryStatus: "not_entered" },
  { id: 2, name: "Fatima Ali", email: "fatima@example.com", phone: "+92 321 7654321", rsvp: "confirmed", qrGenerated: true, entryStatus: "entered" },
  { id: 3, name: "Hassan Raza", email: "hassan@example.com", phone: "+92 333 9876543", rsvp: "pending", qrGenerated: false, entryStatus: "not_entered" },
  { id: 4, name: "Ayesha Malik", email: "ayesha@example.com", phone: "+92 345 1122334", rsvp: "confirmed", qrGenerated: true, entryStatus: "entered" },
  { id: 5, name: "Usman Ahmed", email: "usman@example.com", phone: "+92 300 5566778", rsvp: "declined", qrGenerated: false, entryStatus: "not_entered" },
  { id: 6, name: "Sara Yousaf", email: "sara@example.com", phone: "+92 321 9988776", rsvp: "confirmed", qrGenerated: true, entryStatus: "not_entered" },
];

export function GuestManagement() {
  const { eventId } = useParams();
  const [showAddForm, setShowAddForm] = useState(false);

  const confirmedGuests = guests.filter(g => g.rsvp === "confirmed").length;
  const enteredGuests = guests.filter(g => g.entryStatus === "entered").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="planner" />
      
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Guest Management</h1>
            <p className="text-gray-600 mt-1">Manage your event guest list and entry tracking</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-5">
              <p className="text-sm text-gray-600 mb-1">Total Guests</p>
              <p className="text-3xl font-semibold text-gray-900">{guests.length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-gray-600 mb-1">Confirmed</p>
              <p className="text-3xl font-semibold text-green-700">{confirmedGuests}</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-semibold text-yellow-700">{guests.filter(g => g.rsvp === "pending").length}</p>
            </Card>
            <Card className="p-5">
              <p className="text-sm text-gray-600 mb-1">Checked In</p>
              <p className="text-3xl font-semibold text-primary">{enteredGuests}</p>
            </Card>
          </div>

          {/* Add Guest Form */}
          {showAddForm && (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Guest</h2>
              <form className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" className="mt-1.5 bg-input-background" required />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" className="mt-1.5 bg-input-background" required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" className="mt-1.5 bg-input-background" required />
                </div>
                <div>
                  <Label htmlFor="category">Guest Category</Label>
                  <select className="mt-1.5 w-full px-3 py-2 bg-input-background border border-gray-300 rounded-md">
                    <option>Family</option>
                    <option>Friends</option>
                    <option>Colleagues</option>
                    <option>VIP</option>
                  </select>
                </div>
                <div className="col-span-2 flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  <Button type="submit">Add Guest</Button>
                </div>
              </form>
            </Card>
          )}

          {/* Guest List Table */}
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Guest List</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export List
                </Button>
                <Button variant="outline" size="sm">
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate All QR
                </Button>
                <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Guest
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>RSVP Status</TableHead>
                    <TableHead>QR Code</TableHead>
                    <TableHead>Entry Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">{guest.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{guest.email}</div>
                          <div className="text-gray-600">{guest.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            guest.rsvp === "confirmed" 
                              ? "bg-green-100 text-green-800 border-green-200" 
                              : guest.rsvp === "pending"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {guest.rsvp.charAt(0).toUpperCase() + guest.rsvp.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {guest.qrGenerated ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-600">Generated</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <XCircle className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Not Generated</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {guest.entryStatus === "entered" ? (
                          <Badge className="bg-primary text-white">Checked In</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-700">Not Entered</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button className="text-primary hover:underline text-sm">Edit</button>
                          {guest.qrGenerated && (
                            <button className="text-primary hover:underline text-sm">View QR</button>
                          )}
                        </div>
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
