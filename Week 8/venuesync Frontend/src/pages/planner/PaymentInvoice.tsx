import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Download, CreditCard } from "lucide-react";
import { useParams } from "react-router";
import { generateInvoicePDF } from "../../utils/generateInvoicePDF";
import { paymentsApi } from "../../api/services";

const paymentHistory = [
  { id: "PAY-001", date: "2026-02-15", description: "Deposit Payment (30%)", amount: 54000, status: "paid", method: "Bank Transfer" },
  { id: "PAY-002", date: "2026-03-10", description: "Final Payment (70%)", amount: 126000, status: "pending", method: "Cash" },
];

const invoiceDetails = {
  invoiceNumber: "INV-2026-0234",
  bookingId: "BK-2401",
  venue: "Grand Palace Banquet Hall",
  eventDate: "2026-03-15",
  issueDate: "2026-02-15",
  dueDate: "2026-03-10",
  items: [
    { description: "Venue Rental (1 day)", quantity: 1, rate: 180000, amount: 180000 },
    { description: "Service Fee", quantity: 1, rate: 5000, amount: 5000 },
    { description: "Tax (5%)", quantity: 1, rate: 9250, amount: 9250 },
  ],
  subtotal: 185000,
  tax: 9250,
  total: 194250,
  paid: 54000,
  balance: 140250
};

export function PaymentInvoice() {
  const { id } = useParams();

  /**
   * ─── PDF DOWNLOAD ─────────────────────────────────────────────────────────
   * Generates a print-ready invoice PDF using the browser's native print dialog.
   * To swap for a server-generated PDF: call GET /bookings/:id/invoice/pdf
   * and open the returned blob URL.
   */
  const handleDownloadPDF = () => {
    generateInvoicePDF({
      ...invoiceDetails,
      plannerName: "Syed Rayyan Amir",       // TODO: replace with user from useAuth()
      plannerEmail: "rayyan@example.com",     // TODO: replace with user from useAuth()
      plannerPhone: "+92 300 1234567",        // TODO: replace with user from useAuth()
    });
  };

  /**
   * ─── ONLINE PAYMENT ───────────────────────────────────────────────────────
   * Calls POST /payments/checkout → { checkoutUrl }
   * Then redirects the browser to Stripe/PayPal hosted checkout page.
   * On return, Stripe redirects to /planner/payment/:id?status=success|cancel
   */
  const handleMakePayment = async () => {
    try {
      const bookingId = id ?? "1";
      const { checkoutUrl } = await paymentsApi.initiateOnlinePayment(bookingId, invoiceDetails.balance);
      window.location.href = checkoutUrl;
    } catch {
      alert("Payment gateway unavailable. Please try again or pay at the venue.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="planner" />
      
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Payment & Invoice</h1>
            <p className="text-gray-600 mt-1">Manage your booking payments</p>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 space-y-6">
              {/* Payment Summary */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Summary</h2>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-semibold text-gray-900">PKR {invoiceDetails.total.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                    <p className="text-2xl font-semibold text-green-700">PKR {invoiceDetails.paid.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Balance Due</p>
                    <p className="text-2xl font-semibold text-yellow-700">PKR {invoiceDetails.balance.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Deposit Payment (30%)</h3>
                        <p className="text-sm text-gray-600">Due: {invoiceDetails.issueDate}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Amount: PKR {invoiceDetails.paid.toLocaleString()}</span>
                      <span className="text-sm text-gray-600">Paid on: 2026-02-15</span>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-yellow-300 bg-yellow-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Final Payment (70%)</h3>
                        <p className="text-sm text-gray-600">Due: {invoiceDetails.dueDate}</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">Amount: PKR {invoiceDetails.balance.toLocaleString()}</span>
                      <span className="text-sm text-red-600">Due in 8 days</span>
                    </div>
                    <Button className="w-full" onClick={handleMakePayment}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Make Payment
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Payment History */}
              <Card className="overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>PKR {payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={payment.status === "paid" 
                              ? "bg-green-100 text-green-800 border-green-200" 
                              : "bg-yellow-100 text-yellow-800 border-yellow-200"
                            }
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* Invoice Card */}
            <div className="col-span-4">
              <Card className="p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">Invoice Details</h3>
                  <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-600">Invoice Number</p>
                    <p className="font-medium">{invoiceDetails.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Booking ID</p>
                    <p className="font-medium">{invoiceDetails.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Venue</p>
                    <p className="font-medium">{invoiceDetails.venue}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Event Date</p>
                    <p className="font-medium">{invoiceDetails.eventDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Issue Date</p>
                    <p className="font-medium">{invoiceDetails.issueDate}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Invoice Items</h4>
                  <div className="space-y-3">
                    {invoiceDetails.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.description}</span>
                        <span className="font-medium">PKR {item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">PKR {invoiceDetails.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-medium">PKR {invoiceDetails.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t font-semibold">
                    <span>Total</span>
                    <span className="text-lg">PKR {invoiceDetails.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Payment Methods</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Bank Transfer</li>
                    <li>• Cash Payment at Venue</li>
                    <li>• Online Payment Gateway</li>
                    <li>• Cheque (3 days clearance)</li>
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
