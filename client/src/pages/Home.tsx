import React from "react";

export default function Home() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome to TwachaSetu™ (Demo)</h2>
      <p>This local demo shows patient → consultation → doctor review workflows.</p>
      <div className="mt-6">
        <p>Use demo accounts seeded by the backend:</p>
        <ul className="list-disc ml-6">
          <li>patient@twacha.local / demo1234</li>
          <li>doctor@twacha.local / demo1234</li>
          <li>admin@twacha.local / demo1234</li>
        </ul>
      </div>
    </div>
  );
}
