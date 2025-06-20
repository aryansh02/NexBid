export default function SimplePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-500">Simple Test Page</h1>
      <p className="mt-4 text-gray-600">This is a simple server-side rendered page.</p>
      <div className="card-neu p-4 mt-4">
        <p>This should show neumorphic styling if Tailwind is working.</p>
      </div>
    </div>
  );
} 