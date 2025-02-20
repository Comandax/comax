
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import Products from "@/pages/Products";
import Orders from "@/pages/Orders";
import UserCreate from "@/pages/UserCreate";
import Users from "@/pages/Users";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import OrderSuccess from "@/pages/OrderSuccess";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import UserCreateWithReferral from "@/pages/UserCreateWithReferral";
import UserEdit from "@/pages/UserEdit";
import Companies from "@/pages/Companies";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/admin" replace />} />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/users/create" element={<UserCreate />} />
            <Route path="/users/create/:referralCode" element={<UserCreateWithReferral />} />
            <Route path="/:shortName" element={<Index />} />
            <Route path="/:shortName/success" element={<OrderSuccess />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<UserEdit />} />
              <Route path="/companies" element={<Companies />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
