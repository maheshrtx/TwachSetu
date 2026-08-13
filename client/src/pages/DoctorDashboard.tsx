import React, { useEffect, useState } from 'react';
import { authFetch } from '../services/auth';
import { Link } from 'react-router-dom';

export default function DoctorDashboard() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await authFetch('http://localhost:4000/api/consultations');
      const data = await res.json();
      setList(data);
    } catch (e) {
      alert('Failed to load');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Doctor — Consultation queue</h2>
      {loading && <div>Loading...</div>}
      {!loading && (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Concern</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.id}</td>
                <td className="p-2">{c.chiefConcern}</td>
                <td className="p-2">{c.status}</td>
                <td className="p-2">{new Date(c.createdAt).toLocaleString()}</td>
                <td className="p-2"><Link className="text-blue-600" to={`/consultation/${c.id}`}>Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
