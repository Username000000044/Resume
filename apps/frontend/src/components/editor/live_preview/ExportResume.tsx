import { Badge } from "#/components/ui/badge";
import type { TemplateType } from "#/types/trpc";
import { icons } from "lucide-react";

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
    advised?: boolean;
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
    },
];

export const DownloadResume = ({ pagesMatrix, templateData }: DownloadResumeProps) => {
    templateData
    // const config = useResumeConfigStore((store) => store.config);
    // const sections = useResumeSectionsStore((store) => store.sections);

    // // const { mutateAsync, isPending } = useMutation(trpc.downloadResume.mutationOptions());

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
    //                 const pdfInstace = pdf(<ResumePDFTemplate sections={data.sections} config={data.config} pagesMatrix={pagesMatrix} templateData={templateData} />);
    //                 const blob = await pdfInstace.toBlob();

    //                 const formattedTemplateName = data.config.templateName.toLowerCase().replaceAll(" ", "_");
    //                 const cleanFilename = `${formattedTemplateName}_standard.pdf`

    //                 triggerFileDownload(blob, cleanFilename);

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
                className="flex items-center gap-4 h-full p-4 cursor-pointer hover:bg-muted"
                onClick={() => null}
                disabled={false}
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
    })
}