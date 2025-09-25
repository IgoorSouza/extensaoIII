import PurchasesPage from "./pages/purchases-page";
import CustomersPage from "./pages/customers-page";
import PaymentsPage from "./pages/payments-page"; // Adicionado
import TopBar from "./components/top-bar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" reverseOrder={false} />
      <TopBar />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<CustomersPage />} />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/payments" element={<PaymentsPage />} /> {/* Rota para Pagamentos */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;