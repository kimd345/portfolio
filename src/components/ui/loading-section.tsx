// src/components/ui/loading-section.tsx
interface LoadingSectionProps {
  gradient: string;
  message: string;
  accentColor?: string;
}

export default function LoadingSection({
  gradient,
  message,
  accentColor = 'border-white',
}: LoadingSectionProps) {
  return (
    <div
      className={`h-screen bg-gradient-to-br ${gradient} flex items-center justify-center`}
    >
      <div className='text-center text-white'>
        <div
          className={`h-16 w-16 animate-spin rounded-full border-b-2 ${accentColor} mx-auto mb-4`}
        ></div>
        <p className='text-lg font-medium'>{message}</p>
        <div className='mt-4 flex justify-center space-x-1'>
          <div className='h-2 w-2 animate-pulse rounded-full bg-white/60'></div>
          <div className='h-2 w-2 animate-pulse rounded-full bg-white/60 delay-75'></div>
          <div className='h-2 w-2 animate-pulse rounded-full bg-white/60 delay-150'></div>
        </div>
      </div>
    </div>
  );
}
