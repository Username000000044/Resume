import { PageSize, pageSizeMap } from "@/constants";
import { ReactNode } from "react";

interface WrapperProps {
    scale: number;
    pageSize: PageSize;
    children: ReactNode;
}

export const ResumePageScaleWrapper = ({ scale, pageSize, children }: WrapperProps) => {
    const pageWidth = pageSizeMap[pageSize].w;
    const pageHeight = pageSizeMap[pageSize].h;

    return (
        <div style={{
            width: `${pageWidth * scale}in`,
            height: `${pageHeight * scale}in`,
            position: "relative",
            flexShrink: 0,
        }}>
            <div style={{
                width: `${pageWidth}in`,
                height: `${pageHeight}in`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
            }}>
                {children}
            </div>
        </div>
    )

}