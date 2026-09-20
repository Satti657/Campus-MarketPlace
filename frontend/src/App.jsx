
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Sell from "./pages/Sell";
import MyListings from "./pages/MyListings";
import EditListing from "./pages/EditListing";
import ProtectedRoute from "./ProtectedRoute";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route
          path="/edit-listing/:id"
          element={
            <ProtectedRoute>
              <EditListing />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

