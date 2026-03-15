import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { QrCode, CheckCircle, XCircle, Clock, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

interface ScanResult {
  status: "valid" | "invalid" | "already_entered";
  guestName?: string;
  eventName?: string;
  ticketId?: string;
  entryTime?: string;
}

export function QRScanner() {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  // Mock scan results
  const mockScan = () => {
    setScanning(true);
    setTimeout(() => {
      const results: ScanResult[] = [
        {
          status: "valid",
          guestName: "Ahmed Khan",
          eventName: "Wedding Reception - Grand Palace",
          ticketId: "TKT-2026-001234",
          entryTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        },
        {
          status: "invalid",
          ticketId: "TKT-INVALID"
        },
        {
          status: "already_entered",
          guestName: "Fatima Ali",
          eventName: "Wedding Reception - Grand Palace",
          ticketId: "TKT-2026-001235",
          entryTime: "14:30"
        }
      ];
      
      const randomResult = results[Math.floor(Math.random() * results.length)];
      setScanResult(randomResult);
      setScanning(false);
    }, 1500);
  };

  const resetScanner = () => {
    setScanResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <span className="text-primary font-semibold text-xl">VS</span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold">VenueSync</h1>
                <p className="text-sm opacity-90">Entry Validation System</p>
              </div>
            </div>
            <Link to="/login">
              <Button variant="outline" className="bg-white text-primary hover:bg-gray-100">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        {/* Scanner Card */}
        <Card className="p-8 text-center mb-6">
          {!scanResult ? (
            <>
              <div className="w-32 h-32 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                <QrCode className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">QR Code Scanner</h2>
              <p className="text-gray-600 mb-8">Scan guest QR code to validate entry</p>
              
              {scanning ? (
                <div className="space-y-4">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-pulse" style={{ width: "100%" }}></div>
                  </div>
                  <p className="text-sm text-gray-600">Scanning...</p>
                </div>
              ) : (
                <Button size="lg" className="px-12" onClick={mockScan}>
                  <QrCode className="w-5 h-5 mr-2" />
                  Start Scanning
                </Button>
              )}

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Position the QR code within the camera frame
                </p>
              </div>
            </>
          ) : (
            <>
              {scanResult.status === "valid" && (
                <div>
                  <div className="w-32 h-32 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-green-700 mb-2">Entry Approved</h2>
                  <p className="text-gray-600 mb-8">Guest entry validated successfully</p>
                  
                  <Card className="p-6 bg-gray-50 text-left mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Guest Name</p>
                          <p className="font-semibold text-gray-900">{scanResult.guestName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <QrCode className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Ticket ID</p>
                          <p className="font-medium text-gray-900">{scanResult.ticketId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Entry Time</p>
                          <p className="font-medium text-gray-900">{scanResult.entryTime}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Badge className="bg-green-100 text-green-800 px-4 py-2 text-base mb-6">
                    ✓ Entry Logged
                  </Badge>
                </div>
              )}

              {scanResult.status === "invalid" && (
                <div>
                  <div className="w-32 h-32 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-16 h-16 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-red-700 mb-2">Invalid QR Code</h2>
                  <p className="text-gray-600 mb-8">This QR code is not valid or has expired</p>
                  
                  <Card className="p-6 bg-red-50 text-left mb-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-sm text-red-700">Error: Invalid Ticket</p>
                          <p className="text-sm text-gray-700 mt-1">
                            This ticket could not be verified. Please contact event staff.
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-red-200">
                        <p className="text-xs text-gray-600">Ticket ID: {scanResult.ticketId}</p>
                      </div>
                    </div>
                  </Card>

                  <Badge className="bg-red-100 text-red-800 px-4 py-2 text-base mb-6">
                    ✗ Entry Denied
                  </Badge>
                </div>
              )}

              {scanResult.status === "already_entered" && (
                <div>
                  <div className="w-32 h-32 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-16 h-16 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-yellow-700 mb-2">Already Checked In</h2>
                  <p className="text-gray-600 mb-8">This guest has already entered the venue</p>
                  
                  <Card className="p-6 bg-yellow-50 text-left mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Guest Name</p>
                          <p className="font-semibold text-gray-900">{scanResult.guestName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Previous Entry Time</p>
                          <p className="font-medium text-gray-900">{scanResult.entryTime}</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Badge className="bg-yellow-100 text-yellow-800 px-4 py-2 text-base mb-6">
                    ⚠ Duplicate Entry Attempt
                  </Badge>
                </div>
              )}

              <Button size="lg" className="px-12" onClick={resetScanner}>
                Scan Next Guest
              </Button>
            </>
          )}
        </Card>

        {/* Entry Log */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Entry Log</h3>
          <div className="space-y-3">
            {[
              { name: "Ahmed Khan", time: "14:45", status: "valid" },
              { name: "Sara Malik", time: "14:42", status: "valid" },
              { name: "Hassan Raza", time: "14:38", status: "valid" },
              { name: "Invalid Ticket", time: "14:35", status: "invalid" },
              { name: "Fatima Ali", time: "14:30", status: "valid" },
            ].map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {entry.status === "valid" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{entry.name}</p>
                    <p className="text-xs text-gray-600">{entry.time}</p>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={entry.status === "valid" 
                    ? "bg-green-100 text-green-800 border-green-200" 
                    : "bg-red-100 text-red-800 border-red-200"
                  }
                >
                  {entry.status === "valid" ? "Entered" : "Denied"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
