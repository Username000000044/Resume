
import { CSSProperties, ReactNode } from "react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Shredder } from "lucide-react";
import { TooltipProvider } from "./ui/tooltip";

interface PageProps {
    hasContent: boolean;
    className?: string;
    children?: ReactNode;
    style?: CSSProperties;
}
export const ResumePage = ({ hasContent, className, children, style, ...props }: PageProps) => {

    return (
        <TooltipProvider>
            <div
                className={`${className} w-(--page-width) h-(--page-height) text-(length:--font-size-base) p-(--page-margin) bg-white wrap-anywhere`}
                style={{ ...style }}
                {...props}
            >

                {!hasContent && <EmptyTemplate />}
                {hasContent && children}

            </div>
        </TooltipProvider>
    );
};

const EmptyTemplate = () => {
    return (
        <Empty className="h-full bg-transparent">
            <EmptyHeader>
                <EmptyTitle>Empty Template</EmptyTitle>
                <EmptyDescription className="max-w-xs">
                    Begin completing each section to populate the live preview.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}
