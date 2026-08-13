import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import PatientConsultation from "./pages/PatientConsultation";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-xl font-semibold">TwachaSetu™</h1>
          <nav>
            <Link to="/" className="mr-4">Home</Link>
            <Link to="/consultation">Start Consultation</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consultation" element={<PatientConsultation />} />
        </Routes>
      </main>
    </div>
  );
}
