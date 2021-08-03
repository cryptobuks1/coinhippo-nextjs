import Image from 'next/image'
import { useState, useEffect } from 'react'

const fallbackImg = '/images/default.png'

export default function ImageWithFallback(props) {
  const { src = fallbackImg, fallbackSrc = fallbackImg, className = '', ...rest } = props

  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <Image
      {...rest}
      src={`${['/', 'http'].findIndex(startPattern => imgSrc && imgSrc.startsWith(startPattern)) > -1 ? '' : '/'}${imgSrc}`}
      onError={() => setImgSrc(fallbackSrc)}
      className={`image-logo ${className}`}
    />
  )
}