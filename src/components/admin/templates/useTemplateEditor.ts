'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'

export interface TemplateFormState {
  id: string | null
  type: string
  title: string
  content: string
}

export const emptyTemplateForm: TemplateFormState = {
  id: null,
  type: 'received',
  title: '',
  content: '',
}

export function useTemplateEditor() {
  const [form, setForm] = useState<TemplateFormState>(emptyTemplateForm)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const createTemplate = useMutation(api.templates.create)
  const updateTemplate = useMutation(api.templates.update)
  const removeTemplate = useMutation(api.templates.remove)

  function openCreateForm() {
    setForm(emptyTemplateForm)
    setShowForm(true)
  }

  function openEditForm(template: {
    _id: string
    type: string
    title: string
    content: string
  }) {
    setForm({
      id: template._id,
      type: template.type,
      title: template.title,
      content: template.content,
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setForm(emptyTemplateForm)
  }

  async function saveTemplate() {
    if (!form.title || !form.content) {
      toast.error('Tittel og innhold er påkrevd')
      return
    }

    setSaving(true)
    try {
      if (form.id) {
        await updateTemplate({
          id: form.id as Id<'messageTemplates'>,
          title: form.title,
          content: form.content,
        })
      } else {
        await createTemplate({
          type: form.type,
          title: form.title,
          content: form.content,
        })
      }
      toast.success(form.id ? 'Mal oppdatert' : 'Mal opprettet')
      closeForm()
    } catch {
      toast.error('Kunne ikke lagre mal')
    } finally {
      setSaving(false)
    }
  }

  async function deleteTemplate(id: string) {
    setDeleting(id)
    try {
      await removeTemplate({ id: id as Id<'messageTemplates'> })
      toast.success('Mal slettet')
    } catch {
      toast.error('Kunne ikke slette mal')
    } finally {
      setDeleting(null)
    }
  }

  return {
    form,
    setForm,
    showForm,
    saving,
    deleting,
    openCreateForm,
    openEditForm,
    closeForm,
    saveTemplate,
    deleteTemplate,
  }
}
