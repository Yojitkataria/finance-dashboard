import { memo } from 'react'

function SkeletonBlock({ className = '' }) {
  return <div className={`skeleton-block ${className}`.trim()} />
}

export default memo(SkeletonBlock)
