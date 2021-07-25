export default function Centered({ children }) {
  return (
    <div
      data-layout="centered"
      className="w-full h-screen flex items-center justify-center bg-gray-50"
    >
      {children}
    </div>
  )
}