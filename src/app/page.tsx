// src/app/page.tsx
export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100">
      <a
        href="/vastu"
        className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700"
      >
        Go to Vastu Calculator
      </a>
    </main>
  );
}