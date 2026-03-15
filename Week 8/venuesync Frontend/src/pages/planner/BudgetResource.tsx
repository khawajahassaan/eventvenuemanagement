import { Sidebar } from "../../components/Sidebar";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useParams } from "react-router";

const budgetCategories = [
  { category: "Venue Rental", planned: 180000, actual: 180000, variance: 0 },
  { category: "Catering", planned: 150000, actual: 165000, variance: -15000 },
  { category: "Decoration", planned: 80000, actual: 75000, variance: 5000 },
  { category: "Photography", planned: 60000, actual: 60000, variance: 0 },
  { category: "Entertainment", planned: 40000, actual: 35000, variance: 5000 },
  { category: "Transportation", planned: 25000, actual: 28000, variance: -3000 },
  { category: "Miscellaneous", planned: 15000, actual: 12000, variance: 3000 },
];

const resources = [
  { id: 1, item: "Round Tables", quantity: 40, assigned: 38, available: 2 },
  { id: 2, item: "Chairs", quantity: 400, assigned: 380, available: 20 },
  { id: 3, item: "Stage Setup", quantity: 1, assigned: 1, available: 0 },
  { id: 4, item: "Sound System", quantity: 2, assigned: 2, available: 0 },
  { id: 5, item: "Projector & Screen", quantity: 1, assigned: 1, available: 0 },
];

const vendors = [
  { id: 1, name: "Premium Catering Services", service: "Catering", contact: "+92 300 1234567", status: "confirmed", amount: 165000 },
  { id: 2, name: "Elegance Decorators", service: "Decoration", contact: "+92 321 9876543", status: "confirmed", amount: 75000 },
  { id: 3, name: "Perfect Moments Photography", service: "Photography", contact: "+92 333 5544332", status: "pending", amount: 60000 },
  { id: 4, name: "DJ Sound Masters", service: "Entertainment", contact: "+92 345 7788990", status: "confirmed", amount: 35000 },
];

export function BudgetResource() {
  const { eventId } = useParams();
  
  const totalPlanned = budgetCategories.reduce((sum, cat) => sum + cat.planned, 0);
  const totalActual = budgetCategories.reduce((sum, cat) => sum + cat.actual, 0);
  const totalVariance = totalPlanned - totalActual;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="planner" />
      
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Budget & Resource Allocation</h1>
            <p className="text-gray-600 mt-1">Track your event budget and manage resources</p>
          </div>

          {/* Budget Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6">
              <p className="text-sm text-gray-600 mb-1">Total Planned Budget</p>
              <p className="text-3xl font-semibold text-gray-900">PKR {totalPlanned.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Initial budget allocation</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-600 mb-1">Actual Spending</p>
              <p className="text-3xl font-semibold text-primary">PKR {totalActual.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Current expenditure</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-gray-600 mb-1">Budget Variance</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-semibold ${totalVariance >= 0 ? "text-green-700" : "text-red-700"}`}>
                  PKR {Math.abs(totalVariance).toLocaleString()}
                </p>
                {totalVariance >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {totalVariance >= 0 ? "Under budget" : "Over budget"}
              </p>
            </Card>
          </div>

          {/* Budget Tracker */}
          <Card className="mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Budget Tracker</h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Category</TableHead>
                    <TableHead>Planned Budget</TableHead>
                    <TableHead>Actual Spending</TableHead>
                    <TableHead>Variance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetCategories.map((cat, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{cat.category}</TableCell>
                      <TableCell>PKR {cat.planned.toLocaleString()}</TableCell>
                      <TableCell>PKR {cat.actual.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={cat.variance >= 0 ? "text-green-700" : "text-red-700"}>
                          {cat.variance >= 0 ? "+" : ""}PKR {cat.variance.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${cat.actual <= cat.planned ? "bg-green-600" : "bg-red-600"}`}
                            style={{ width: `${Math.min((cat.actual / cat.planned) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-semibold">
                    <TableCell>Total</TableCell>
                    <TableCell>PKR {totalPlanned.toLocaleString()}</TableCell>
                    <TableCell>PKR {totalActual.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={totalVariance >= 0 ? "text-green-700" : "text-red-700"}>
                        {totalVariance >= 0 ? "+" : ""}PKR {totalVariance.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            {/* Resource Allocation */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Resource Allocation</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {resources.map((resource) => (
                    <div key={resource.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{resource.item}</span>
                        <span className="text-sm text-gray-600">
                          {resource.assigned}/{resource.quantity}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(resource.assigned / resource.quantity) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Assigned: {resource.assigned}</span>
                        <span>Available: {resource.available}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Update Resource Allocation
                </Button>
              </div>
            </Card>

            {/* Vendor Management */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Linked Vendors</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{vendor.name}</h4>
                          <p className="text-sm text-gray-600">{vendor.service}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          vendor.status === "confirmed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{vendor.contact}</p>
                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-gray-600">Contract Amount</span>
                        <span className="font-medium text-primary">PKR {vendor.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Add Vendor
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
