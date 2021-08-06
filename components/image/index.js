import Image from 'next/image'
import { useState, useEffect } from 'react'

const fallbackImg = '/images/default.png'

const myLoader = ({ src, width, quality }) => {
  return `${process.env.NEXT_PUBLIC_IMAGE_OPTIMIZER_URL}?url=${src}&w=${width}&q=${quality || 75}`
}

const customSrc = (src, host = process.env.NEXT_PUBLIC_SITE_URL) => {
  let newSrc = `${['/', 'http'].findIndex(startPattern => src && src.startsWith(startPattern)) > -1 ? '' : '/'}${src}`
  newSrc = `${['http'].findIndex(startPattern => newSrc && newSrc.startsWith(startPattern)) > -1 ? '' : host}${newSrc}`

  return newSrc
}

export default function ImageWithFallback({ src = fallbackImg, fallbackSrc = fallbackImg, className = '', ...props }) {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(customSrc(src, window.location.origin))
  }, [src])

  return (
    <Image
      {...props}
      loader={myLoader}
      src={imgSrc}
      onError={() => setImgSrc(customSrc(fallbackSrc, window.location.origin))}
      className={`image-logo ${className}`}
    />
  )
}