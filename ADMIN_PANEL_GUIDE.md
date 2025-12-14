# Admin Panel Documentation

## Overview
A responsive, static Admin Panel has been added to the application to demonstrate backend management capabilities.

## URL Access
Navigate to `/admin` to access the dashboard.
*(Note: Currently this route is publicly accessible for demonstration purposes. In a production environment, this should be protected by the `useAuth` hook checking for an `admin` role).*

## Features

### 1. Dashboard (`/admin`)
- **Key Metrics**: Total Revenue, Active Orders, Customers, Stock levels.
- **Recent Orders**: A summary table of the latest transactions.
- **Top Products**: Visual progress bars for best-selling items.

### 2. Products Management (`/admin/products`)
- Lists all available products from the catalog.
- **Add Product** (`/admin/products/add`): Comprehensive form for creating items with details, pricing, inventory, specs, and mock image upload.
- **Edit Product** (`/admin/products/edit/[id]`): Update existing product details (simulated data fetching).

### 3. Orders Management (`/admin/orders`)
- Detailed table of customer orders.
- Filtering options for Status (Completed, Processing, etc.).
- Search functionality (UI only).

### 4. Customers Management (`/admin/customers`)
- **User List**: View customer names, emails, total spend, and order history count.
- **Status Tracking**: Badges for Active/Inactive/New users.
- **Export**: Placeholder for exporting customer data.

### 5. Settings (`/admin/settings`)
- **General**: Store details, currency settings.
- **Payment**: Payment gateway status (Stripe/PayPal UI).
- **Shipping**: Zone configuration.
- **Notifications**: Email alert toggles for orders.

## Technical Implementation
- **Layout**: Uses a dedicated `AdminLayout` separate from the main storefront layout.
- **Styling**: Consistent use of the project's Navy Blue (`#1d2a48`) and Cyan (`#56cfe1`) palette.
- **Responsiveness**: Includes a collapsible sidebar for mobile devices.
- **Mock Functionality**: Forms include loading states and mock submission delays to demonstrate UX flow.

## Future Enhancements
- Connect to Firebase Firestore for real data.
- Add Role-Based Access Control (RBAC) to restrict access to admin users only.
- Implement real image uploading to Firebase Storage.
