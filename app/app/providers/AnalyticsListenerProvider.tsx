'use client'

import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import SharedAnalyticsListener from '@shared/providers/AnalyticsListener'

export default function AnalyticsListenerProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const url = useMemo(() => {
    const query = searchParams?.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  const mapParams = (u: string) => ({ route: u })

  return <SharedAnalyticsListener url={url ?? undefined} mapParams={mapParams} />
}