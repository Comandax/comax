
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Products from "@/pages/Products";
import Users from "@/pages/Users";
import Admin from "@/pages/Admin";
import Login from "@/pages/Login";
import UserCreate from "@/pages/UserCreate";
import UserEdit from "@/pages/UserEdit";
import RepresentativeCreate from "@/pages/RepresentativeCreate";
import Orders from "@/pages/Orders";
import OrderSuccess from "@/pages/OrderSuccess";
import Index from "@/pages/Index";
import UserCreateWithReferral from "@/pages/UserCreateWithReferral";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/r/:identifier" element={<UserCreateWithReferral />} />
            <Route path="/users/create" element={
              <ProtectedRoute superUserOnly>
                <UserCreate />
              </ProtectedRoute>
            } />
            <Route path="/users/:id" element={
              <ProtectedRoute superUserOnly>
                <UserEdit />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute superUserOnly>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/representatives/create" element={
              <ProtectedRoute superUserOnly>
                <RepresentativeCreate />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/orders/success" element={<OrderSuccess />} />
            <Route path="/" element={<Index />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
