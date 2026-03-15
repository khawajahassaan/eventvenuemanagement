/**
 * generateInvoicePDF
 *
 * Generates a professional PDF invoice using jsPDF (no backend needed).
 * Called from PaymentInvoice.tsx when the user clicks "Download Invoice".
 *
 * DEPENDENCY: jspdf must be installed.
 * Run:  pnpm add jspdf
 *
 * The generated PDF includes:
 *   - VenueSync header with logo text + primary brand colour
 *   - Invoice metadata (number, booking ID, dates)
 *   - Itemised table (description, qty, rate, amount)
 *   - Subtotal / tax / total section
 *   - Payment status (paid / balance due)
 *   - Footer with contact info
 */

import type { Invoice } from "../types";

export async function generateInvoicePDF(invoice: Invoice): Promise<void> {
  // Dynamically import jspdf so it doesn't bloat the initial bundle
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const PRIMARY = [15, 76, 129] as [number, number, number];   // #0f4c81
  const DARK    = [17, 24, 39]  as [number, number, number];   // gray-900
  const GRAY    = [107, 114, 128] as [number, number, number]; // gray-500
  const WHITE   = [255, 255, 255] as [number, number, number];

  const W = doc.internal.pageSize.getWidth();
  let y = 0;

  // ── Header bar ─────────────────────────────────────────────────────────────
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, W, 72, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...WHITE);
  doc.text("VenueSync", 40, 44);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Event & Venue Booking Management", 40, 60);

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", W - 40, 44, { align: "right" });

  y = 96;

  // ── Invoice metadata ────────────────────────────────────────────────────────
  doc.setTextColor(...DARK);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const leftCol  = 40;
  const rightCol = W - 40;
  const lineH    = 18;

  const meta = [
    ["Invoice Number", invoice.invoiceNumber],
    ["Booking ID",     invoice.bookingId],
    ["Venue",          invoice.venue],
    ["Event Date",     invoice.eventDate],
    ["Issue Date",     invoice.issueDate],
    ["Due Date",       invoice.dueDate],
  ];

  meta.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(label + ":", leftCol, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, leftCol + 130, y);
    y += lineH;
  });

  y += 16;

  // ── Items table header ──────────────────────────────────────────────────────
  doc.setFillColor(...PRIMARY);
  doc.rect(leftCol, y, W - 80, 24, "F");

  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Description",   leftCol + 8,       y + 16);
  doc.text("Qty",           leftCol + 280,      y + 16);
  doc.text("Rate (PKR)",    leftCol + 330,      y + 16);
  doc.text("Amount (PKR)",  W - 80,             y + 16, { align: "right" });

  y += 24;

  // ── Items rows ──────────────────────────────────────────────────────────────
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "normal");

  invoice.items.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(leftCol, y, W - 80, 22, "F");
    }
    doc.text(item.description,                leftCol + 8,  y + 15);
    doc.text(String(item.quantity),           leftCol + 284, y + 15);
    doc.text(item.rate.toLocaleString(),      leftCol + 334, y + 15);
    doc.text(item.amount.toLocaleString(),    W - 48,        y + 15, { align: "right" });
    y += 22;
  });

  y += 16;

  // ── Totals ──────────────────────────────────────────────────────────────────
  const totalsX = W - 220;

  const totals: [string, number, boolean][] = [
    ["Subtotal",    invoice.subtotal, false],
    ["Tax (5%)",    invoice.tax,      false],
    ["TOTAL",       invoice.total,    true],
    ["Amount Paid", invoice.paid,     false],
    ["Balance Due", invoice.balance,  true],
  ];

  totals.forEach(([label, value, bold]) => {
    if (bold) {
      doc.setFillColor(...PRIMARY);
      doc.rect(totalsX - 8, y - 4, W - totalsX + 48, 22, "F");
      doc.setTextColor(...WHITE);
    } else {
      doc.setTextColor(...DARK);
    }
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 11 : 10);
    doc.text(label,                   totalsX,  y + 12);
    doc.text("PKR " + value.toLocaleString(), W - 48, y + 12, { align: "right" });
    y += 24;
  });

  y += 24;

  // ── Payment methods box ─────────────────────────────────────────────────────
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(1);
  doc.rect(leftCol, y, W - 80, 70);
  doc.setTextColor(...DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Accepted Payment Methods", leftCol + 10, y + 18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...GRAY);
  doc.text("• Bank Transfer   • Cash at Venue   • Online Payment Gateway   • Cheque (3 days clearance)", leftCol + 10, y + 38);
  doc.text("For queries: info@venuesync.pk   |   +92 21 3456 7890", leftCol + 10, y + 56);

  y += 86;

  // ── Footer ──────────────────────────────────────────────────────────────────
  doc.setFillColor(...PRIMARY);
  doc.rect(0, y, W, 36, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("© 2026 VenueSync. All rights reserved.  |  www.venuesync.pk", W / 2, y + 22, { align: "center" });

  // ── Save ────────────────────────────────────────────────────────────────────
  doc.save(`${invoice.invoiceNumber}.pdf`);
}
