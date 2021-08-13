import CopyClipboard from '../copy-clipboard'

export default function widget({ src, title, width, height, copyText }) {
  return (
    <div>
      <iframe
        src={src}
        title={title}
        frameBorder="0"
        width={width}
        height={height}
      />
      <span className="flex items-center justify-center space-x-1">
        <CopyClipboard
          text={copyText}
          copyTitle="Copy iframe"
          size={20}
        />
      </span>
    </div>
  )
}