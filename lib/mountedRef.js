import { useEffect, useRef } from 'react'

export default function useMountedRef() {
  const mountedRef = useRef(null)

  useEffect(() => {
    mountedRef.current = true

    return () => mountedRef.current = false
  })

  return mountedRef
}