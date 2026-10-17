import { firstAvaibleStorageIndex } from '#/utils/templateStorage';
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/create/$id')({
  beforeLoad: async ({ params }) => {

    const targetingChildRoute = location.pathname.includes(`/create/${params.id}/i/`);

    if (targetingChildRoute) {
      return;
    }

    const firstAvaibleIndex = firstAvaibleStorageIndex(params.id);

    // Redirect with first avaible index
    throw redirect({
      to: '/create/$id/i/$idx',
      params: { id: params.id, idx: firstAvaibleIndex.toString() }
    })
  }
})
