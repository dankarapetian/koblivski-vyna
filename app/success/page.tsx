import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-white/10 p-10 text-center">
        <h1 className="text-4xl font-black text-green-400">
          Bestellung erfolgreich
        </h1>
        <p className="mt-4 text-white/70">
          Vielen Dank für deine Bestellung bei Коблівські Вина.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-red-700 px-8 py-4 font-bold hover:bg-red-800"
        >
          Zurück zum Shop
        </Link>
      </div>
    </main>
  );
}
