import { ResumeRenderEngine } from '@resume/renderer';
import { createFileRoute } from '@tanstack/react-router'

import "@resume/renderer/styles.css";

export const Route = createFileRoute('/create/raw')({
    component: RouteComponent,
})

function RouteComponent() {
    const data = (window as any).__RESUME_PAYLOAD__;

    if (!data) {
        return <div>No resume payload found.</div>
    }

    return (
        <ResumeRenderEngine
            config={data.config}
            defaultConfig={data.defaultConfig}
            dbSections={data.dbSections}
            sections={data.sections}
            mode="preview"
            pageMatrix={{
                pages: data.pagesMatrix.matrix,
                totalHeight: data.pagesMatrix.totalHeight
            }}
            settings={{
                scale: 1,
                pageSize: data.pageSize,
                pagination: data.pagination,
                pageGapPx: 0,
                sectionControls: false,
            }}
        />
    )
}
