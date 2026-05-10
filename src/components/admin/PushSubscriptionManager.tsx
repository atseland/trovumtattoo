'use client'

import { useState } from 'react'
import { useAction, useMutation, useQuery, useConvexAuth } from 'convex/react'
import { toast } from 'sonner'
import { api } from '@convex/_generated/api'
import {
  ADMIN_SERVICE_WORKER_PATH,
  ADMIN_SERVICE_WORKER_SCOPE,
} from '@/lib/admin/pwa'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export function PushSubscriptionManager() {
  const { isAuthenticated } = useConvexAuth()
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const isConfigured = Boolean(vapidKey)

  const subscriptions = useQuery(api.pushSubscriptions.getCurrent, isAuthenticated ? {} : 'skip')
  const saveSub = useMutation(api.pushSubscriptions.save)
  const sendTestPush = useAction(api.mail.sendPush.sendPush)

  const isSubscribed = Array.isArray(subscriptions) && subscriptions.length > 0

  async function handleSubscribe() {
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

      const registration =
        (await navigator.serviceWorker.getRegistration(ADMIN_SERVICE_WORKER_SCOPE)) ??
        (await navigator.serviceWorker.register(ADMIN_SERVICE_WORKER_PATH, {
          scope: ADMIN_SERVICE_WORKER_SCOPE,
          updateViaCache: 'none',
        }))

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

  async function handleTestPush() {
    setTesting(true)
    try {
      const result = await sendTestPush({
        title: 'Trovum testvarsel',
        body: 'Push-varsler fungerer for admin.',
        url: '/admin/notifications',
      })

      if (result.sent > 0) {
        toast.success('Testvarsel sendt')
      } else {
        toast.error('Ingen push-abonnementer mottok testvarselet')
      }
    } catch (err) {
      console.error(err)
      toast.error('Kunne ikke sende testvarsel. Sjekk VAPID-konfigurasjonen.')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-3'>
        <span
          className='inline-block w-[8px] h-[8px] shrink-0'
          style={{
            borderRadius: '50%',
            background: isSubscribed ? 'var(--status-booked)' : 'var(--mast-left)',
          }}
        />
        <span className='font-sans text-[14px] text-paper'>
          {!isConfigured
            ? 'Push-varsler er ikke konfigurert'
            : isSubscribed
              ? 'Push-varsler er aktivert'
              : 'Push-varsler er ikke aktivert'}
        </span>
      </div>
      {!isConfigured && (
        <p className='max-w-[48ch] font-sans text-[12px] leading-[1.7] text-mast-left'>
          Sett VAPID-nøkler i miljøet før push kan brukes i produksjon.
        </p>
      )}

      <div className='flex flex-wrap gap-2'>
        <button
          onClick={handleSubscribe}
          disabled={loading || !isConfigured}
          className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] px-6 border border-rule text-nav hover:text-paper hover:border-[rgba(237,233,230,0.38)] hover:bg-[rgba(237,233,230,0.04)] transition-colors duration-[200ms] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          style={{ background: 'transparent' }}
        >
          {loading ? 'Aktiverer...' : isSubscribed ? 'Re-abonner' : 'Aktiver varsler'}
        </button>
        <button
          onClick={handleTestPush}
          disabled={testing || !isConfigured || !isSubscribed}
          className='font-sans text-[8.5px] tracking-[0.12em] uppercase min-h-[44px] px-6 border border-rule text-nav hover:text-paper hover:border-[rgba(237,233,230,0.38)] hover:bg-[rgba(237,233,230,0.04)] transition-colors duration-[200ms] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          style={{ background: 'transparent' }}
        >
          {testing ? 'Sender...' : 'Send testvarsel'}
        </button>
      </div>
    </div>
  )
}
