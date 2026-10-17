import { Badge } from "#/components/ui/badge";
import { toast } from "#/components/ui/toast";
import type { ConfigData } from "#/store/useResumeConfigStore";
import type { SectionData } from "#/store/useResumeSectionsStore";
import type { Format } from "#/types/resume-download";
import { trpc } from "#/utils/trpc";
import { pdf } from "@react-pdf/renderer";
import { useMutation } from "@tanstack/react-query";
import { icons } from "lucide-react";
import { ResumePDFTemplate } from "../download/ResumePDFTemplate";
import { triggerFileDownload } from "#/utils/triggerFileDownload";

interface DownloadResumeProps {
    config: ConfigData,
    sections: Record<string, SectionData>,
    pagesMatrix: string[][]
}

interface DownloadOption {
    name: string;
    format: Format;
    description: string;
    suggested?: boolean;
    icon: keyof typeof icons;
}

const downloadOptions: DownloadOption[] = [
    {
        name: "JPG",
        description: "Best for sharing",
        format: "jpg",
        icon: "Image",
    },
    {
        name: "PNG",
        description: "Best for sharing",
        format: "png",
        icon: "Image",
    },
    {
        name: "PDF Standard",
        description: "Best for documents (and emailing)",
        icon: "FileText",
        format: "pdf-s",
        suggested: true,
    },
    {
        name: "PDF Print",
        description: "Best for printing",
        format: "pdf-p",
        icon: "FileText",
    },
    {
        name: "DOCX",
        description: "Best for enterprise sharing",
        format: "docx",
        icon: "FileText",
    },
];

export const DownloadResume = ({ config, sections, pagesMatrix }: DownloadResumeProps) => {
    const { mutate, mutateAsync, isPending } = useMutation(trpc.export.downloadResume.mutationOptions());

    const formatFormat = (format: Format) => {
        switch (format) {
            case "jpg": return "JPG";
            case "png": return "PNG";
            case "docx": return "DOCX";
            case "pdf-p": return "PDF Print";
            case "pdf-s": return "PDF Standard";
        }
    }

    const handleDownload = async (format: Format) => {
        const promise = mutateAsync({ sections, config, format });

        // Toast Promise
        toast.promise(promise,
            {
                loading: "Preparing download...",
                success: (data) => ({
                    type: undefined,
                    title: (<span><span className="font-bold">{formatFormat(data.format)}</span> - {data.config.templateName}</span>),
                    description: (
                        <span>If your download hasn't started, {" "}
                            <a
                                className="underline text-primary cursor-pointer"
                                onClick={() => handleDownload(format)}>
                                click here
                            </a>
                        </span>),

                }),
                error: "Could not download resume.",
            }
        )

        try {
            const data = await promise;

            switch (data.format) {
                case "pdf-p":
                case "pdf-s":
                    const pdfInstace = pdf(<ResumePDFTemplate sections={data.sections} config={data.config} format={data.format} pagesMatrix={pagesMatrix} />);
                    const blob = await pdfInstace.toBlob();

                    const formattedTemplateName = data.config.templateName.toLowerCase().replaceAll(" ", "_");

                    const cleanFilename = `${formattedTemplateName}_${data.format === "pdf-p" ? "print" : "standard"}.pdf`

                    triggerFileDownload(blob, cleanFilename);
                    break;
            }
        } catch (error) {
            console.error("Resume download error: ", error);
        }
    }


    return downloadOptions.map((downloadOption) => {
        const Icon = icons[downloadOption.icon];

        return (
            <button
                key={crypto.randomUUID()}
                className="flex items-center gap-4 h-full p-4 cursor-pointer hover:bg-muted"
                onClick={() => handleDownload(downloadOption.format)}
                disabled={isPending}
            >
                <Icon strokeWidth={1.5} />
                <div className="text-left">
                    <div className="flex items-center gap-2">
                        <h2 className="font-medium">{downloadOption.name}</h2>
                        {downloadOption.suggested && (
                            <Badge className="h-4 text-[.7rem]">ADVISED</Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {downloadOption.description}
                    </p>
                </div>
            </button>
        );
    })
}