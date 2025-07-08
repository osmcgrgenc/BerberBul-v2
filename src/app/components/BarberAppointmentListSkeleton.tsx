'use client';

export default function BarberAppointmentListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="mt-4 h-8 bg-gray-300 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
}
