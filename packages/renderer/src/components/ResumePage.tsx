
import { CSSProperties, ReactNode } from "react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Shredder } from "lucide-react";

interface PageProps {
    hasContent: boolean;
    className?: string;
    children?: ReactNode;
    style?: CSSProperties;
}
export const ResumePage = ({ hasContent, className, children, style, ...props }: PageProps) => {

    return (
        <div
            className="w-(--page-width) h-(--page-height)  bg-white shrink-0"
            style={style}

        >

            <div
                className={`${className || ''} p-(--page-margin) text-(--font-size-base) bg-white shadow-xl h-full w-full`}
                style={{
                    boxSizing: 'border-box', // Keeps margins within the 8.5" x 11" box limits
                    ...style // Injects the remaining configuration styles
                }}
                {...props}
            >
                {!hasContent && <EmptyTemplate />}
                {hasContent && children}
            </div>
        </div>
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
