import Image from 'next/image'
import { useState, useEffect } from 'react'

let fallbackImg = '/images/default.png'

const myLoader = ({ src, width, quality }) => {
  return `${process.env.NEXT_PUBLIC_IMAGE_OPTIMIZER_URL}?url=${src}&w=${width}&q=${quality || 75}`
}

const customSrc = (src, host = process.env.NEXT_PUBLIC_SITE_URL) => {
  let newSrc = `${['/', 'http'].findIndex(startPattern => src && src.startsWith(startPattern)) > -1 ? '' : '/'}${src}`
  newSrc = `${['http'].findIndex(startPattern => newSrc && newSrc.startsWith(startPattern)) > -1 ? '' : host}${newSrc}`

  return newSrc
}

export default function ImageWithFallback({ src = fallbackImg, fallbackSrc = fallbackImg, className = '', useImg, useMocked, width, ...rest }) {
  fallbackImg = typeof useMocked === 'number' ? `/images/addresses/${(useMocked % 8) + 1}.png` : fallbackImg

  const [imgSrc, setImgSrc] = useState(src || fallbackImg)

  useEffect(() => {
    setImgSrc(customSrc(src || fallbackImg, window.location.origin))
  }, [src])

  return (
    useImg ?
      <img
        {...rest}
        src={imgSrc}
        width={width}
        className={`image-logo${width <= 16 ? '-mini' : ''} ${className}`}
      />
      :
      <Image
        {...rest}
        loader={myLoader}
        src={imgSrc}
        width={width}
        onError={() => setImgSrc(customSrc(fallbackSrc, window.location.origin))}
        className={`image-logo${width <= 16 ? '-mini' : ''} ${className}`}
      />
  )
}