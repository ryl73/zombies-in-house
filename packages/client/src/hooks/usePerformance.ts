import { useState, useEffect } from 'react'

interface PerformanceMemory {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

interface PerformanceMetrics {
  navigation: PerformanceNavigationTiming | null
  memory: PerformanceMemory | null
}

export const usePerformance = (): PerformanceMetrics => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    navigation: null,
    memory: null,
  })

  useEffect(() => {
    if (typeof performance === 'undefined') return
    const navEntries = performance.getEntriesByType('navigation')
    const navigation = navEntries[0] as PerformanceNavigationTiming | null
    const memory = (performance as any).memory as PerformanceMemory | null

    setMetrics({
      navigation,
      memory,
    })
  }, [])

  return metrics
}
