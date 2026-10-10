export const firstAvaibleStorageIndex = (templateId: string) => {
    let templateIdx = 0;

    while (
        localStorage.getItem(storageTargetName(templateId, templateIdx.toString(), "sections")) !== null ||
        localStorage.getItem(storageTargetName(templateId, templateIdx.toString(), "config")) !== null
    ) {
        templateIdx++;
    }

    return templateIdx;
}

export const storageTargetName = (templateId: string, templateIdx: string, targetType: "sections" | "config") => {
    const sectionsTargetName = `template-${templateId}-${templateIdx}`;
    const configTargetName = `config-${templateId}-${templateIdx}`;

    return targetType === "config" ? configTargetName : sectionsTargetName;
}
