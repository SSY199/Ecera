export default function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#171620] text-[#a3a1af]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#363544] border-t-[#8c51f4]" />
        <p className="text-sm font-medium">Loading…</p>
      </div>
    </div>
  );
}
