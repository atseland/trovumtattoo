'use client'

import { useQuery, useConvexAuth } from 'convex/react'
import { api } from '@convex/_generated/api'
import {
  TemplateEditorPanel,
  TemplateList,
} from '@/components/admin/templates/TemplateSections'
import { useTemplateEditor } from '@/components/admin/templates/useTemplateEditor'
import { Btn } from '@/components/ui/Btn'

export default function TemplatesPage() {
  const { isAuthenticated } = useConvexAuth()
  const templates = useQuery(api.templates.list, isAuthenticated ? {} : 'skip')
  const templateEditor = useTemplateEditor()

  return (
    <div className='max-w-2xl'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='font-sans font-medium text-[18px] text-paper'>Meldingsmaler</h1>
        <Btn variant='sm' onClick={templateEditor.openCreateForm}>Ny mal</Btn>
      </div>

      {templateEditor.showForm && (
        <TemplateEditorPanel
          form={templateEditor.form}
          saving={templateEditor.saving}
          onFormChange={(update) => templateEditor.setForm(update)}
          onSave={templateEditor.saveTemplate}
          onCancel={templateEditor.closeForm}
        />
      )}

      <TemplateList
        templates={templates}
        deleting={templateEditor.deleting}
        onEdit={templateEditor.openEditForm}
        onDelete={templateEditor.deleteTemplate}
      />
    </div>
  )
}
