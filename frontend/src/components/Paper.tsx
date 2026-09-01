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
      className={`${className} aspect-[8.5/11] w-screen h-full bg-white shadow-[0_0_10px_2px_rgba(0,0,0,0.1)] p-[72px] lg:w-220 print:block print:border-0 print:[print-color-adjust:exact] print:[webkit-print-color-adjust:exact]`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};
