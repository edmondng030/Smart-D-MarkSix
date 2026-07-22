export default function Loading() {
  return <div className="mx-auto max-w-360 animate-pulse px-5 py-12 lg:px-8"><div className="h-12 w-72 rounded-xl bg-white/8"/><div className="mt-5 h-7 w-full max-w-2xl rounded bg-white/5"/><div className="mt-10 h-32 rounded-2xl bg-white/5"/><div className="mt-6 grid gap-5 xl:grid-cols-2">{Array.from({ length: 6 }, (_, index) => <div key={index} className="h-64 rounded-2xl bg-white/5"/>)}</div></div>;
}
