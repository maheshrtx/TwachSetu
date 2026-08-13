import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authFetch } from '../services/auth';

export default function ConsultationView() {
  const { id } = useParams();
  const [cons, setCons] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await authFetch(`http://localhost:4000/api/consultations/${id}`);
      const data = await res.json();
      setCons(data);
    } catch (e) {
      alert('Failed to load');
    } finally { setLoading(false); }
  }

  useEffect(() => { if (id) load(); }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!cons) return <div>No consultation</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Consultation {cons.id}</h2>
      <p><strong>Concern:</strong> {cons.chiefConcern}</p>
      <p><strong>Status:</strong> {cons.status}</p>
      <div className="mt-4">
        <h3 className="font-semibold">Images</h3>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {cons.images && cons.images.length > 0 ? cons.images.map((img:any) => (
            <img key={img.id} src={`http://localhost:4000${img.filePath}`} alt="img" className="max-h-48 object-contain border" />
          )) : <div className="text-gray-600">No images</div>}
        </div>
      </div>
    </div>
  );
}
