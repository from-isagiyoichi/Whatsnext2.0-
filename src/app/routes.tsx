import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { EventDetails } from "./pages/EventDetails";
import { Cart } from "./pages/Cart";
import { MyTickets } from "./pages/MyTickets";
import { Profile } from "./pages/Profile";
import { HelpSupport } from "./pages/HelpSupport";
import { Login } from "./pages/Login";
import { Security } from "./pages/Security";
import { PaymentMethods } from "./pages/PaymentMethods";
import { AccountSettings } from "./pages/AccountSettings";
import { Notifications } from "./pages/Notifications";
import { Messages } from "./pages/Messages";
import { ChatConversation } from "./pages/ChatConversation";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { EventsManagement } from "./pages/admin/EventsManagement";
import { EventForm } from "./pages/admin/EventForm";
import { StudentsManagement } from "./pages/admin/StudentsManagement";
import { AdminSettings } from "./pages/admin/AdminSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { 
        index: true, 
        element: <ProtectedRoute><Home /></ProtectedRoute>
      },
      { 
        path: "event/:eventId", 
        element: <ProtectedRoute><EventDetails /></ProtectedRoute>
      },
      { 
        path: "cart", 
        element: <ProtectedRoute><Cart /></ProtectedRoute>
      },
      { 
        path: "tickets", 
        element: <ProtectedRoute><MyTickets /></ProtectedRoute>
      },
      {
        path: "notifications",
        element: <ProtectedRoute><Notifications /></ProtectedRoute>
      },
      {
        path: "messages",
        element: <ProtectedRoute><Messages /></ProtectedRoute>
      },
      {
        path: "messages/:chatId",
        element: <ProtectedRoute><ChatConversation /></ProtectedRoute>
      },
      {
        path: "profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      { 
        path: "help-support", 
        element: <ProtectedRoute><HelpSupport /></ProtectedRoute>
      },
      { path: "login", Component: Login },
      { 
        path: "security", 
        element: <ProtectedRoute><Security /></ProtectedRoute>
      },
      { 
        path: "payment-methods", 
        element: <ProtectedRoute><PaymentMethods /></ProtectedRoute>
      },
      { 
        path: "account-settings", 
        element: <ProtectedRoute><AccountSettings /></ProtectedRoute>
      },
      { path: "*", Component: NotFound },
    ],
  },
  // Admin Routes
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin/dashboard",
    element: <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>,
  },
  {
    path: "/admin/events",
    element: <AdminProtectedRoute><EventsManagement /></AdminProtectedRoute>,
  },
  {
    path: "/admin/events/new",
    element: <AdminProtectedRoute><EventForm /></AdminProtectedRoute>,
  },
  {
    path: "/admin/events/edit/:eventId",
    element: <AdminProtectedRoute><EventForm /></AdminProtectedRoute>,
  },
  {
    path: "/admin/students",
    element: <AdminProtectedRoute><StudentsManagement /></AdminProtectedRoute>,
  },
  {
    path: "/admin/settings",
    element: <AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>,
  },
]);