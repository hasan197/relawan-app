# Volunteer Dashboard Design

This is a code bundle for Volunteer Dashboard Design. The original project is available at https://www.figma.com/design/TeOSmOcWhrlNFUXwRsequL/Volunteer-Dashboard-Design.

## 📱 Screenshots

<div align="center">

<table>
  <tr>
    <td style="text-align: center; padding: 20px;">
      <h3>Mobile Dashboard</h3>
      <img src="mobile-dashboard.png" alt="Mobile Dashboard" width="280" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    </td>
    <td style="text-align: center; padding: 20px;">
      <h3>Desktop Dashboard</h3>
      <img src="desktop-dashboard.png" alt="Desktop Dashboard" width="560" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    </td>
  </tr>
</table>

</div>

## 🚀 Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: TailwindCSS + shadcn/ui
- **Backend**: Convex (Real-time Database) + Supabase (Alternative)
- **Storage**: Convex Storage + Backblaze B2
- **Authentication**: Phone-based OTP system

## 📋 Features

- ✅ **User Management**: Phone-based authentication with OTP
- ✅ **Donation Management**: Track and validate donations
- ✅ **Team Management**: Organize volunteers into teams (Regu)
- ✅ **Donor Management**: Manage muzakki/donor database
- ✅ **Real-time Updates**: Live data synchronization
- ✅ **Mobile Responsive**: Works on all device sizes
- ✅ **Admin Dashboard**: Complete admin interface

## 🔧 Environment Setup

1. Copy `.env.example` to `.env.local`
2. Configure your Convex and Supabase credentials
3. Run `npm run dev` to start development

## 📝 Recent Updates

- ✅ Fixed invalid date display in donation validation page
- ✅ Implemented consistent snake_case field naming across backend
- ✅ Added proper error handling for date formatting
- ✅ Enhanced mobile responsiveness