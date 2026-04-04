'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400 animate-spin" />

        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-30 animate-pulse" />
      </div>
    </div>
  );
}
