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

    // Payload info reached here

    return (
        <div className='m-0 p-0'>
            <ResumeRenderEngine
                config={data.config}
                defaultConfig={data.defaultConfig}
                dbSections={data.dbSections}
                sections={data.sections}
                mode="preview"
                pages={data.pagesMatrix}
                settings={{
                    scale: 1,
                    pageSize: data.pageSize,
                    pagination: true,
                    pageGapPx: 0,
                    sectionControls: false,
                }}
            />
        </div>
    )
}
