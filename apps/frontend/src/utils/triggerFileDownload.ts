export const triggerFileDownload = (blob: Blob, filename: string) => {
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;

    // Force a click event to start the download
    document.body.appendChild(link);
    link.click();

    // Remove event to prevent memory leaks
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
}