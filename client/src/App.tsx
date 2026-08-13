import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PatientConsultation from './pages/PatientConsultation';
import Login from './pages/Login';
import PatientWorkflow from './pages/PatientWorkflow';
import DoctorDashboard from './pages/DoctorDashboard';
import ConsultationView from './pages/ConsultationView';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-xl font-semibold">TwachaSetu™</h1>
          <nav>
            <Link to="/" className="mr-4">Home</Link>
            <Link to="/consultation" className="mr-4">Start Consultation</Link>
            <Link to="/patient" className="mr-4">Patient</Link>
            <Link to="/doctor" className="mr-4">Doctor</Link>
            <Link to="/login">Login</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consultation" element={<PatientConsultation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/patient" element={<PatientWorkflow />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/consultation/:id" element={<ConsultationView />} />
        </Routes>
      </main>
    </div>
  );
}
