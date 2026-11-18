import { Badge } from "#/components/ui/badge";
import type { TemplateType } from "#/types/trpc";
import { icons } from "lucide-react";
import { useRef } from "react";
import { ResumeRenderEngine } from "@resume/renderer";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { useResumeSectionsStore } from "#/store/useResumeSectionsStore";
import { useResumePreferencesStore } from "#/store/useResumePreferencesStore";

interface DownloadResumeProps {
    pagesMatrix: string[][];
    templateData: TemplateType;
}

const formats = ["jpg", "png", "pdf", "docx", "json"] as const;
type Format = typeof formats[number];

interface DownloadOption {
    name: string;
    format: Format;
    description: string;
    icon: keyof typeof icons;
    advised?: boolean;
    disabled?: boolean;
}

const downloadOptions: DownloadOption[] = [
    {
        name: "JPG",
        description: "Best for sharing",
        format: "jpg",
        icon: "Image",
        disabled: true,

    },
    {
        name: "PNG",
        description: "Best for sharing",
        format: "png",
        icon: "Image",
        disabled: true,
    },
    {
        name: "PDF",
        description: "Best for documents (and emailing)",
        icon: "FileText",
        format: "pdf",
        advised: true,
    },
    // {
    //     name: "PDF Print",
    //     description: "Best for printing",
    //     format: "pdf-p",
    //     icon: "FileText",
    // },
    // {
    //     name: "DOCX",
    //     description: "Best for enterprise sharing",
    //     format: "docx",
    //     icon: "FileText",
    // },
    {
        name: "JSON",
        description: "Best for raw sharing",
        format: "json",
        icon: "CodeXml",
        disabled: true,
    },
];

export const DownloadResume = ({ pagesMatrix, templateData }: DownloadResumeProps) => {
    const config = useResumeConfigStore((store) => store.config);
    const defaultConfig = useResumeConfigStore((store) => store.defaultConfig);
    const sections = useResumeSectionsStore((store) => store.sections);
    // const preferences = useResumePreferencesStore((store) => store.preferences);


    const exportResume = async (format: DownloadOption["format"]) => {
        const BASE_URL = import.meta.env.BASE_URL;

        if (format === "pdf") {
            const res = await fetch(`http://localhost:8787/api/export/pdf`, {
                method: "POST",
                credentials: "include", // Sends the HttpOnly anon session cookie
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    templateName: config.templateName,
                    config,
                    defaultConfig,
                    dbSections: templateData.sections,
                    sections,
                    pagesMatrix,
                    pageSize: config.template.pageSize,
                })
            })

            if (!res.ok) throw new Error("Failed to generate PDF");

            // Download Resume
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "resume.pdf";
            a.click();
            URL.revokeObjectURL(url);

            console.log("Downloaded Resume");
        }
    }

    // const formatFormat = (format: Format) => {
    //     switch (format) {
    //         case "jpg": return "JPG";
    //         case "png": return "PNG";
    //         case "docx": return "DOCX";
    //         case "pdf": return "PDF Standard";
    //     }
    // }


    // const handleDownload = async (format: Format) => {
    //     const promise = mutateAsync({ sections, config, format });

    //     try {
    //         // Download
    //         const data = await promise;

    //         switch (data.format) {
    //             case "png":
    //                 break;
    //             case "jpg":
    //                 break;
    //             case "pdf":

    //                 break;
    //             case "docx":
    //                 break;
    //             default:
    //                 const _exhaustiveCheck: never = data.format;
    //                 throw new Error(`Unknown status: ${_exhaustiveCheck}`);
    //         }

    //         // Toast Promise
    //         toast.promise(promise,
    //             {
    //                 loading: "Preparing download...",
    //                 success: (data) => ({
    //                     type: undefined,
    //                     title: (<span><span className="font-bold">{formatFormat(data.format)}</span> - {data.config.templateName}</span>),
    //                     description: (
    //                         <span>If your download hasn't started, {" "}
    //                             <a
    //                                 className="underline text-primary cursor-pointer"
    //                                 onClick={() => handleDownload(format)}>
    //                                 click here
    //                             </a>
    //                         </span>),

    //                 }),
    //                 error: "Could not download resume.",
    //             }
    //         )
    //     } catch (error) {
    //         console.error("Resume download error: ", error);
    //     }
    // }


    return downloadOptions.map((downloadOption) => {
        const Icon = icons[downloadOption.icon];

        return (
            <button
                key={crypto.randomUUID()}
                className="flex items-center gap-4 h-full p-4 cursor-pointer hover:bg-muted disabled:cursor-not-allowed"
                onClick={() => exportResume(downloadOption.format)}
                disabled={downloadOption.disabled}
            >
                <Icon strokeWidth={1.5} />
                <div className="text-left">
                    <div className="flex items-center gap-2">
                        <h2 className="font-medium">{downloadOption.name}</h2>
                        {downloadOption.advised && (
                            <Badge className="h-4 text-[.6rem]">ADVISED</Badge>
                        )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {downloadOption.description}
                    </p>
                </div>
            </button>
        );
    });
}

