import type { ReactNode } from "react";

export const LivePaper = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <div
      className={`${className} aspect-[8.5/11] w-screen h-full bg-white border-3 border-zinc-300 border-dashed p-[72px] lg:w-220`}
      {...props}
    >
      {children}
    </div>
  );
};
