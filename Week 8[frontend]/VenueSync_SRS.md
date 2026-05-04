# Software Requirements Specification (SRS) for VenueSync

## 1. Introduction
### 1.1 Purpose
The purpose of this document is to define the software requirements for VenueSync, a comprehensive Event & Venue Booking Management System. VenueSync connects event planners with venue owners, offering a streamlined platform to search, book, manage, and coordinate events.

### 1.2 Scope
VenueSync provides two primary user roles:
- **Event Planners:** Individuals or organizations looking to search for venues, make booking requests, process payments, manage guests, track budgets, and schedule events.
- **Venue Owners:** Businesses or individuals listing their venues to accept bookings, manage availability calendars, review booking requests, and manage payments.

## 2. Overall Description
### 2.1 Product Perspective
VenueSync is a web-based platform built with a modern technology stack. The frontend is developed using React (TypeScript) and styled with Tailwind CSS. The backend API is powered by Laravel (PHP) and utilizes a relational database (MySQL) to store venue data, user profiles, bookings, and financial records.

### 2.2 User Characteristics
- **Planners:** Require an intuitive interface to easily compare venues, track expenses, generate QR codes for guests, and communicate with vendors.
- **Owners:** Need an administrative dashboard to manage multiple venue listings, view detailed calendars, accept/reject bookings, and track total revenue.

## 3. Specific Requirements
### 3.1 Functional Requirements

#### 3.1.1 Authentication & Authorization
- Users can register and log in as either a Planner or an Owner.
- Role-based access control restricts users to their respective dashboards and capabilities.

#### 3.1.2 Venue Management (Owners)
- Owners can create, update, and delete venue listings.
- Owners can define venue details including location, capacity, price per day, amenities, and photos.
- Owners can view a dynamic availability calendar showing Pending, Approved, and Completed bookings.

#### 3.1.3 Venue Search & Discovery (Planners)
- Planners can search for venues using filters such as location, capacity, date, price range, and specific amenities.
- Planners can view detailed venue pages including high-resolution image galleries and real-time availability calendars.

#### 3.1.4 Booking Workflow
- Planners can submit a booking request for a specific date and guest count.
- The system automatically validates that the guest count does not exceed the venue's maximum capacity.
- The system validates that the selected date is not already booked.
- Owners receive booking requests and can approve or reject them.

#### 3.1.5 Financial & Payment Management
- Planners can view detailed invoices outlining venue costs, service fees, and taxes.
- Planners can record partial or full payments.
- The system prevents overpayments (payments exceeding the remaining balance).
- Owners can view the total amount spent/paid by planners in their dashboard.

#### 3.1.6 Guest Management
- Planners can add, update, and remove guests from a booking.
- Planners can generate QR codes for guest invitations and tracking.
- An integrated QR Scanner allows staff to validate guest entry at the event.

#### 3.1.7 Budgeting & Vendor Management
- Planners can allocate budgets to different event categories.
- Planners can track actual spending against their allocated budget.
- Planners can manage vendors associated with an event.

### 3.2 Non-Functional Requirements
- **Performance:** The platform must load pages efficiently and handle concurrent booking requests gracefully.
- **Security:** All API endpoints must be secured using JWT authentication. Passwords must be hashed.
- **Usability:** The interface must be responsive and accessible on both desktop and mobile devices. A global light/dark theme toggle must be supported.
- **Reliability:** Payments and booking statuses must remain strictly consistent across the database.

## 4. System Architecture
- **Frontend:** React, React Router, Tailwind CSS, Lucide Icons, Date-fns.
- **Backend:** Laravel (REST API), Eloquent ORM.
- **Database:** MySQL.
- **Integration:** Optional Stripe integration for online payment processing.

## 5. Future Enhancements
- Automated Email & SMS notifications for booking status updates.
- Waitlist functionality for highly demanded dates.
- Advanced analytics and reporting for venue owners.
