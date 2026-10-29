
import { CSSProperties, ReactNode } from "react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Shredder } from "lucide-react";
import { TooltipProvider } from "./ui/tooltip";
import { cn } from "@/lib/utils";

interface PageProps {
    hasContent: boolean;
    pagination: boolean;
    className?: string;
    children?: ReactNode;
}
export const ResumePage = ({ hasContent, pagination, className, children, ...props }: PageProps) => {

    return (
        <TooltipProvider>
            <div
                className={cn("w-(--page-width) text-(length:--font-size-base) p-(--page-margin) bg-white wrap-anywhere", {
                    "min-h-(--page-height)": !pagination,
                    "h-(--page-height)": pagination,
                }, className)}
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
