import { useRouter } from 'next/router'

export default function CoinIndex() {
  const router = useRouter()
  const { pathname } = { ...router }

  if (typeof window !== 'undefined') {
    router.push(`${pathname}s`)
  }

  return null
}