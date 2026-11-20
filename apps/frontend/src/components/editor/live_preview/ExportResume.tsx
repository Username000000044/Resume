import { Badge } from "#/components/ui/badge";
import type { TemplateType } from "#/types/trpc";
import { icons } from "lucide-react";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { useResumeSectionsStore } from "#/store/useResumeSectionsStore";
import { useResumePreferencesStore } from "#/store/useResumePreferencesStore";
import { toast } from "#/components/ui/toast";

interface DownloadResumeProps {
    pagesMatrix: {
        matrix: string[][];
        totalHeight: number;
    },
    templateData: TemplateType;
}

const formats = ["jpeg", "png", "pdf", "json"] as const;
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
        name: "JPEG",
        description: "Best for sharing",
        format: "jpeg",
        icon: "Image",

    },
    {
        name: "PNG",
        description: "Best for sharing",
        format: "png",
        icon: "Image",
    },
    {
        name: "PDF",
        description: "Best for documents (and emailing)",
        icon: "FileText",
        format: "pdf",
        advised: true,
    },
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
    },
];

export const DownloadResume = ({ pagesMatrix, templateData }: DownloadResumeProps) => {
    const config = useResumeConfigStore((store) => store.config);
    const defaultConfig = useResumeConfigStore((store) => store.defaultConfig);
    const sections = useResumeSectionsStore((store) => store.sections);
    const pagination = useResumePreferencesStore((store) => store.preferences.pagination);
    const preferences = useResumePreferencesStore((store) => store.preferences);


    const exportResume = async (format: DownloadOption["format"]) => {
        const formatFormat = (format: Format) => {
            switch (format) {
                case "jpeg": return "JPEG";
                case "png": return "PNG";
                case "json": return "JSON";
                case "pdf": return "PDF Standard";
            }
        }

        const safeTemplateName = config.templateName.replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "resume";

        const toastId = toast.add({
            type: "info",
            title: (<span><span className="font-bold">{formatFormat(format)}</span> - {safeTemplateName}</span>),
            description: (
                <span>If your download hasn't started, {" "}
                    <a
                        className="underline text-primary cursor-pointer"
                        onClick={() => exportResume(format)}>
                        click here
                    </a>
                </span>),
        });

        const res = await fetch(`http://localhost:8787/api/export/${format}`, {
            method: "POST",
            credentials: "include", // Sends the HttpOnly anon session cookie
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                templateId: templateData.id,
                templateName: safeTemplateName,

                pagination,
                pageSize: config.template.pageSize,
                pagesMatrix,

                config,
                defaultConfig,
                dbSections: templateData.sections,
                sections,
                preferences,
            })
        });

        if (!res.ok) {
            toast.update(toastId, (prevToast) => ({
                type: "error",
                title: (<span className="font-bold"><span className="font-bold">{formatFormat(format)}</span> - {safeTemplateName}</span>),
                description: (
                    <span>Download failed, try again in a few seconds. </span>
                ),
            }));

            throw new Error("Failed to generate PDF");
        }


        toast.update(toastId, (prevToast) => ({
            type: "success"
        }));

        // Download Resume
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${safeTemplateName}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
    }



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
    //         
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

