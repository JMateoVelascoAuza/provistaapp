export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto h-[300px] w-[150px] rounded-[1.75rem] border-4 border-marino-900 bg-marino-900 shadow-2xl shadow-marino-900/30 sm:h-[420px] sm:w-[210px] sm:rounded-[2.25rem] sm:border-[5px] md:h-[520px] md:w-[260px] md:rounded-[2.5rem] md:border-[6px]">
      <div className="absolute left-1/2 top-0 z-10 h-3 w-16 -translate-x-1/2 rounded-b-xl bg-marino-900 sm:h-4 sm:w-24 md:h-5 md:w-28 md:rounded-b-2xl" />
      <div className="h-full w-full overflow-hidden rounded-[1.4rem] bg-white sm:rounded-[1.8rem] md:rounded-[2rem]">{children}</div>
    </div>
  );
}
