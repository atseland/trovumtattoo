'use client'

import { useState } from 'react'
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
  const clientId = client?._id ?? null
  const [notesState, setNotesState] = useState(() => ({
    clientId,
    notes: client?.notes ?? '',
  }))
  const [savingNotes, setSavingNotes] = useState(false)

  let activeNotesState = notesState
  if (notesState.clientId !== clientId) {
    activeNotesState = { clientId, notes: client?.notes ?? '' }
    setNotesState(activeNotesState)
  }

  function setNotes(notes: string) {
    setNotesState({ clientId, notes })
  }

  async function saveNotes() {
    if (!client) return

    setSavingNotes(true)
    try {
      await updateClient({
        id: client._id,
        notes: activeNotesState.notes || undefined,
      })
      toast.success('Notater lagret')
    } catch {
      toast.error('Kunne ikke lagre notater')
    } finally {
      setSavingNotes(false)
    }
  }

  return {
    notes: activeNotesState.notes,
    setNotes,
    savingNotes,
    saveNotes,
  }
}
