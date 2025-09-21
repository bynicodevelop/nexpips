'use client'

import { useEffect, useRef } from 'react'
import { useAnalytics } from '../hooks/useAnalytics'
import { useFirebaseContext } from './FirebaseProvider'

type Props = {
  url?: string
  enabled?: boolean
  mapParams?: (url: string) => Record<string, unknown> | void
}

export default function AnalyticsListener({ url, enabled = true, mapParams }: Props) {
  const { logPageView } = useAnalytics()
  const { isInitialized } = useFirebaseContext()
  const lastUrlRef = useRef<string>('')

  useEffect(() => {
    if (!enabled || !isInitialized || !url) return

    const effectiveUrl = url

    if (lastUrlRef.current === effectiveUrl) return
    lastUrlRef.current = effectiveUrl

    const extraParams = mapParams?.(effectiveUrl) || {}
    setTimeout(() => logPageView(effectiveUrl, extraParams), 0)
  }, [url, enabled, isInitialized, mapParams, logPageView])

  return null
}