"use client"

import { useReportWebVitals } from 'next/web-vitals'
import { AnalyticsEvents } from '@/lib/analytics'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Solo enviamos métricas si estamos en producción (o si queremos debug)
    AnalyticsEvents.trackEvent('web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_name: metric.name,
      metric_value: metric.value,
      metric_rating: metric.rating, // 'good', 'needs-improvement', or 'poor'
      non_interaction: true,
    })
  })

  return null
}
