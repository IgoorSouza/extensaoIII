import PurchasesPage from "./pages/purchases-page";
import CustomersPage from "./pages/customers-page";
import PaymentsPage from "./pages/payments-page";
import LoginPage from "./pages/login-page";
import TopBar from "./components/top-bar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/auth-context";
import { ProtectedRoute } from "./components/protected-route";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="bottom-right" reverseOrder={false} />
        <TopBar />

        <div className="p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <CustomersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchases"
              element={
                <ProtectedRoute>
                  <PurchasesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <PaymentsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
