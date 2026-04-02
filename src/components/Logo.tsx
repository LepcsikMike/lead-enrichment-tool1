export default function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        <rect width="32" height="32" rx="6" fill="#e8530e" />
        <path
          d="M8 10h4v12H8zM14 10h4v4h-4zM14 18h4v4h-4zM20 10h4v12h-4z"
          fill="white"
        />
      </svg>
      <span className="font-bold text-white tracking-tight whitespace-nowrap">
        CANDIDATE FLOW<sup className="text-[0.5em] ml-0.5">®</sup>
      </span>
    </div>
  );
}
