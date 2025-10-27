import PurchasesPage from "./pages/purchases-page";
import CustomersPage from "./pages/customers-page";
import PaymentsPage from "./pages/payments-page";
import LoginPage from "./pages/login-page";
import TopBar from "./components/top-bar";
import { Sidebar } from "./components/sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "./components/protected-route";
import { AuthProvider } from "./context/auth/auth-provider";
import { useState, type PropsWithChildren } from "react";
import { useAuth } from "./hooks/use-auth";
import { cn } from "./lib/utils";

interface DashboardLayoutProps extends PropsWithChildren {
  isSidebarOpen: boolean;
}

function DashboardLayout({ children, isSidebarOpen }: DashboardLayoutProps) {
  const { authData } = useAuth();

  const SIDEBAR_WIDTH_PX = 224;

  if (authData) {
    return (
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main
          className={cn(
            "flex-1 mt-14 p-4 transition-all duration-300",
          )}
          style={{ 
            marginLeft: isSidebarOpen ? `${SIDEBAR_WIDTH_PX}px` : "0", 
          }}
        >
          {children}
        </main>
      </div>
    );
  }

  return <div className="p-4 pt-14">{children}</div>;
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <Router>
      <AuthProvider>
        <Toaster position="bottom-right" reverseOrder={false} />
        
        <TopBar onToggleSidebar={toggleSidebar} />

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout isSidebarOpen={isSidebarOpen}>
                  <CustomersPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchases"
            element={
              <ProtectedRoute>
                <DashboardLayout isSidebarOpen={isSidebarOpen}>
                  <PurchasesPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <DashboardLayout isSidebarOpen={isSidebarOpen}>
                  <PaymentsPage />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;