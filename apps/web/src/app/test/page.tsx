'use client';

import { useState, useEffect } from 'react';

export default function TestPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">This page bypasses AuthContext to test basic functionality.</p>
      
      <h2 className="text-xl font-semibold mb-2">Projects ({projects.length}):</h2>
      {projects.map((project: any) => (
        <div key={project.id} className="card-neu p-4 mb-4">
          <h3 className="font-semibold">{project.title}</h3>
          <p className="text-sm text-gray-600">{project.description}</p>
          <p className="text-sm font-medium">${project.budget}</p>
        </div>
      ))}
    </div>
  );
} 