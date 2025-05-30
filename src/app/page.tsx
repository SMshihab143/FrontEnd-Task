import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">Welcome to Store Builder</h1>
      <Link
        href="/createstore"
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Create a New Store
      </Link>
    </main>
  );
}
