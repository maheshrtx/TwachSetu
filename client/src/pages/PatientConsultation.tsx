import React, { useState } from "react";

export default function PatientConsultation() {
  const [chiefConcern, setChiefConcern] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  async function createConsultation() {
    const res = await fetch("http://localhost:4000/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId: "demo-patient-id", chiefConcern }),
    });
    const data = await res.json();
    setSubmittedId(data.id);
  }

  return (
    <div>
      {!submittedId ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Start Consultation</h2>
          <label className="block mb-2">Chief concern</label>
          <input
            className="border p-2 w-full mb-4"
            value={chiefConcern}
            onChange={(e) => setChiefConcern(e.target.value)}
            placeholder="e.g., Rash on forearm"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={createConsultation}>
            Create
          </button>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold">Created consultation</h3>
          <p>ID: {submittedId}</p>
          <p>Next: add photos and complete questionnaire in the UI (TODO)</p>
        </div>
      )}
    </div>
  );
}
