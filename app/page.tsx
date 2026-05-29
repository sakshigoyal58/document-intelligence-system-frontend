import UploadForm from "./components/upload";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        PDF Upload
      </h1>
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <UploadForm />
      </section>
    </main>
  );
}
