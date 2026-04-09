'use client'

import { useEffect, useState } from 'react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@convex/_generated/api'
import { Id } from '@convex/_generated/dataModel'

interface ClientSummary {
  _id: Id<'clients'>
  notes?: string | null
}

export function useClientNotes(client: ClientSummary | null | undefined) {
  const updateClient = useMutation(api.clients.update)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    setNotes(client?.notes ?? '')
  }, [client?._id, client?.notes])

  async function saveNotes() {
    if (!client) return

    setSavingNotes(true)
    try {
      await updateClient({
        id: client._id,
        notes: notes || undefined,
      })
      toast.success('Notater lagret')
    } catch {
      toast.error('Kunne ikke lagre notater')
    } finally {
      setSavingNotes(false)
    }
  }

  return {
    notes,
    setNotes,
    savingNotes,
    saveNotes,
  }
}
