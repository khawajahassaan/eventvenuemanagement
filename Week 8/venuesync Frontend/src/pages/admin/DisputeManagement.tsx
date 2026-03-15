import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

const disputes = [
  {
    id: "DSP-001",
    bookingId: "BK-2401",
    raisedBy: "Ahmed Khan (Planner)",
    against: "Grand Palace Banquet Hall",
    issue: "Venue conditions not as advertised",
    description: "The venue's air conditioning was not working properly during the event. Multiple guests complained about the heat. We have photos as evidence.",
    amount: 180000,
    refundRequested: 50000,
    status: "open",
    priority: "high",
    date: "2026-02-28",
    lastUpdate: "2026-03-01"
  },
  {
    id: "DSP-002",
    bookingId: "BK-2398",
    raisedBy: "Sky View Convention (Owner)",
    against: "Fatima Ali (Planner)",
    issue: "Damage to venue property",
    description: "During the event, several chairs were damaged and the stage backdrop was torn. The planner refuses to pay for damages which total PKR 35,000.",
    amount: 250000,
    refundRequested: 0,
    status: "in_review",
    priority: "medium",
    date: "2026-02-25",
    lastUpdate: "2026-02-28"
  },
  {
    id: "DSP-003",
    bookingId: "BK-2385",
    raisedBy: "Hassan Raza (Planner)",
    against: "Rose Garden Marquee",
    issue: "Event cancelled by venue owner",
    description: "The venue owner cancelled our confirmed booking just 10 days before the event without valid reason. We request full refund of deposit paid.",
    amount: 150000,
    refundRequested: 150000,
    status: "open",
    priority: "critical",
    date: "2026-02-20",
    lastUpdate: "2026-02-26"
  },
  {
    id: "DSP-004",
    bookingId: "BK-2375",
    raisedBy: "Sara Malik (Planner)",
    against: "Business Hub Conference Hall",
    issue: "Missing amenities",
    description: "Projector and sound system were not available as promised in the listing. Had to arrange alternatives at last minute.",
    amount: 80000,
    refundRequested: 15000,
    status: "resolved",
    priority: "low",
    date: "2026-02-15",
    lastUpdate: "2026-02-22"
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "open": return "bg-red-100 text-red-800 border-red-200";
    case "in_review": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "resolved": return "bg-green-100 text-green-800 border-green-200";
    case "rejected": return "bg-gray-100 text-gray-800 border-gray-200";
    default: return "";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "critical": return "bg-red-100 text-red-800 border-red-200";
    case "high": return "bg-orange-100 text-orange-800 border-orange-200";
    case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "";
  }
};

export function DisputeManagement() {
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);

  const openDisputes = disputes.filter(d => d.status === "open").length;
  const inReview = disputes.filter(d => d.status === "in_review").length;
  const resolved = disputes.filter(d => d.status === "resolved").length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Dispute Management</h1>
            <p className="text-gray-600 mt-1">Handle and resolve booking disputes</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Open Disputes</p>
                  <p className="text-3xl font-semibold text-red-700">{openDisputes}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">In Review</p>
                  <p className="text-3xl font-semibold text-yellow-700">{inReview}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Resolved</p>
                  <p className="text-3xl font-semibold text-green-700">{resolved}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Disputes</p>
                  <p className="text-3xl font-semibold text-gray-900">{disputes.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-gray-600" />
              </div>
            </Card>
          </div>

          {/* Disputes Table */}
          <Card className="mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">All Disputes</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Dispute ID</TableHead>
                    <TableHead>Raised By</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Refund Requested</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-medium">{dispute.id}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{dispute.raisedBy.split('(')[0]}</div>
                          <div className="text-gray-600">{dispute.against}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{dispute.issue}</p>
                      </TableCell>
                      <TableCell>
                        {dispute.refundRequested > 0 ? (
                          <span className="font-medium text-red-700">PKR {dispute.refundRequested.toLocaleString()}</span>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getPriorityColor(dispute.priority)}>
                          {dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(dispute.status)}>
                          {dispute.status === "in_review" ? "In Review" : dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{dispute.date}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedDispute(dispute.id)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Dispute Detail Panel */}
          {selectedDispute && (
            <Card className="p-6">
              {(() => {
                const dispute = disputes.find(d => d.id === selectedDispute);
                if (!dispute) return null;
                
                return (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Dispute Details - {dispute.id}</h2>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={getStatusColor(dispute.status)}>
                            {dispute.status === "in_review" ? "In Review" : dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(dispute.priority)}>
                            {dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)} Priority
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => setSelectedDispute(null)}>Close</Button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-gray-600">Raised By</Label>
                          <p className="font-medium text-gray-900 mt-1">{dispute.raisedBy}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Against</Label>
                          <p className="font-medium text-gray-900 mt-1">{dispute.against}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Booking ID</Label>
                          <p className="font-medium text-gray-900 mt-1">{dispute.bookingId}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm text-gray-600">Date Raised</Label>
                          <p className="font-medium text-gray-900 mt-1">{dispute.date}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Last Updated</Label>
                          <p className="font-medium text-gray-900 mt-1">{dispute.lastUpdate}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Booking Amount</Label>
                          <p className="font-medium text-gray-900 mt-1">PKR {dispute.amount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <Label className="text-sm text-gray-600">Issue Type</Label>
                      <p className="font-medium text-gray-900 mt-1">{dispute.issue}</p>
                    </div>

                    <div className="mb-6">
                      <Label className="text-sm text-gray-600">Description</Label>
                      <p className="text-gray-900 mt-2 leading-relaxed">{dispute.description}</p>
                    </div>

                    {dispute.refundRequested > 0 && (
                      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Label className="text-sm text-gray-600">Refund Requested</Label>
                        <p className="text-2xl font-semibold text-red-700 mt-1">PKR {dispute.refundRequested.toLocaleString()}</p>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Admin Decision</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="status">Update Status</Label>
                          <select 
                            id="status"
                            className="mt-1.5 w-full px-3 py-2 bg-input-background border border-gray-300 rounded-md"
                          >
                            <option value="open">Open</option>
                            <option value="in_review">In Review</option>
                            <option value="resolved">Resolved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="refundAmount">Approved Refund Amount (PKR)</Label>
                          <Input 
                            id="refundAmount"
                            type="number"
                            placeholder="Enter refund amount"
                            className="mt-1.5 bg-input-background"
                          />
                        </div>

                        <div>
                          <Label htmlFor="resolution">Resolution Notes</Label>
                          <Textarea 
                            id="resolution"
                            placeholder="Provide detailed resolution notes..."
                            className="mt-1.5 bg-input-background"
                            rows={4}
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button className="flex-1">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Refund & Close
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject & Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
