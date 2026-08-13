import React, { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('patient@twacha.local');
  const [password, setPassword] = useState('demo1234');
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      nav('/');
    } catch (e) {
      setErr('Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <form onSubmit={submit}>
        <label className="block mb-2">Email</label>
        <input className="border p-2 w-full mb-4" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block mb-2">Password</label>
        <input type="password" className="border p-2 w-full mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex justify-end">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
