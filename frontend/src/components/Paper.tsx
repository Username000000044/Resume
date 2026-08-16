import type React from "react";
import type { ReactNode } from "react";

export const LivePaper = ({
  className,
  children,
  style,
  ...props
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}) => {
  return (
    <div
      className={`${className} aspect-[8.5/11] w-screen h-full bg-white border-3 border-zinc-300 border-dashed p-[72px] lg:w-220`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};
