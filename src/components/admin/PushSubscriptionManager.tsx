'use client'

import { useState } from 'react'
import { useMutation, useQuery, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../../../convex/_generated/api'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export function PushSubscriptionManager() {
  const { isAuthenticated } = useConvexAuth()
  const [loading, setLoading] = useState(false)

  const subscriptions = useQuery((api as any).pushSubscriptions.getCurrent, isAuthenticated ? {} : 'skip')
  const saveSub = useMutation((api as any).pushSubscriptions.save)

  const isSubscribed = Array.isArray(subscriptions) && subscriptions.length > 0

  async function handleSubscribe() {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidKey) {
      toast.error('VAPID public key ikke konfigurert')
      return
    }

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast.error('Push-varsler støttes ikke i denne nettleseren')
      return
    }

    setLoading(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        toast.error('Tillatelse til varsler ble avslått')
        return
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })

      const json = subscription.toJSON()
      await saveSub({
        endpoint: json.endpoint!,
        keys: {
          p256dh: json.keys!.p256dh,
          auth: json.keys!.auth,
        },
      })

      toast.success('Push-varsler aktivert')
    } catch (err) {
      console.error(err)
      toast.error('Kunne ikke aktivere push-varsler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isSubscribed ? '#4ade80' : '#7a6e62',
            flexShrink: 0,
          }}
        />
        <span style={{ color: '#c9b99a', fontSize: '0.875rem' }}>
          {isSubscribed ? 'Push-varsler er aktivert' : 'Push-varsler er ikke aktivert'}
        </span>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        style={{
          padding: '10px 18px',
          background: isSubscribed ? 'transparent' : '#c9933a',
          color: isSubscribed ? '#7a6e62' : '#0d0c0b',
          border: isSubscribed ? '1px solid #2a2724' : 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '0.875rem',
          fontWeight: '600',
          minHeight: '48px',
          opacity: loading ? 0.6 : 1,
          alignSelf: 'flex-start',
        }}
      >
        {loading ? 'Aktiverer…' : isSubscribed ? 'Re-abonner' : 'Aktiver varsler'}
      </button>
    </div>
  )
}
