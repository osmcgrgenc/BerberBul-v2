'use client';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="p-4 rounded-md bg-red-100 border border-red-400 text-red-700">
        <p className="font-bold">Hata:</p>
        <p>{message}</p>
      </div>
    </div>
  );
}
