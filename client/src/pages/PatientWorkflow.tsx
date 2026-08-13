import React, { useState } from 'react';
import { authFetch, getUser } from '../../services/auth';

export default function PatientWorkflow() {
  const [step, setStep] = useState(0);
  const [chiefConcern, setChiefConcern] = useState('');
  const [consultationId, setConsultationId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const user = getUser();

  async function createConsultation() {
    setLoading(true);
    try {
      const res = await authFetch('http://localhost:4000/api/consultations', {
        method: 'POST',
        body: JSON.stringify({ chiefConcern }),
      });
      const data = await res.json();
      setConsultationId(data.id);
      setStep(1);
    } catch (e) {
      alert('Failed to create consultation');
    } finally { setLoading(false); }
  }

  async function uploadImages() {
    if (!consultationId) return alert('Missing consultation id');
    if (!files || files.length === 0) return setStep(2); // allow skip
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('images', f));
    setLoading(true);
    try {
      const res = await authFetch(`http://localhost:4000/api/consultations/${consultationId}/images`, { method: 'POST', body: fd });
      await res.json();
      setStep(2);
    } catch (e) {
      alert('Upload failed');
    } finally { setLoading(false); }
  }

  async function submitConsultation() {
    if (!consultationId) return;
    setLoading(true);
    try {
      const res = await authFetch(`http://localhost:4000/api/consultations/${consultationId}/submit`, { method: 'POST' });
      const data = await res.json();
      setStep(3);
    } catch (e) {
      alert('Submit failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Patient consultation</h2>
      {step === 0 && (
        <div>
          <label className="block mb-2">Chief concern</label>
          <input className="border p-2 w-full mb-4" value={chiefConcern} onChange={(e) => setChiefConcern(e.target.value)} />
          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={createConsultation} disabled={loading}>Next</button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <label className="block mb-2">Upload photos (optional)</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="mb-4" />
          <div className="flex justify-between">
            <button className="px-4 py-2" onClick={() => setStep(0)}>Back</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={uploadImages} disabled={loading}>Upload & Next</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="font-semibold">Review</h3>
          <p><strong>Patient:</strong> {user?.name || 'you'}</p>
          <p><strong>Chief concern:</strong> {chiefConcern}</p>
          <div className="flex justify-between mt-4">
            <button className="px-4 py-2" onClick={() => setStep(1)}>Back</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={submitConsultation} disabled={loading}>Submit consultation</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3 className="font-semibold">Submitted</h3>
          <p>Your consultation has been submitted. A doctor will review it shortly.</p>
        </div>
      )}
    </div>
  );
}
