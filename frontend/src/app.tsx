import PaymentsPage from "./pages/payments-page";
import PurchasesPage from "./pages/purchases-page";
import UsersPage from "./pages/users-page";
import TopBar from "./components/top-bar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <TopBar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<UsersPage />} />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
