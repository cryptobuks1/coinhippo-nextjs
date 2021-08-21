import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className="w-full max-w-xl flex flex-col text-center mx-2 md:mx-auto">
      <img
        src="/images/illustration.svg"
        alt="404"
        className="w-auto h-64 sm:h-40 lg:h-64 object-contain mb-8 sm:mb-4 lg:mb-8"
      />
      <h1 className="text-blue-500 text-6xl mb-4">404</h1>
      <div className="text-gray-900 text-center mb-8 sm:mb-4 lg:mb-8">
        We're sorry. The page you requested could not be found. Please go back
        to the homepage or contact us
      </div>
      <div className="w-full flex">
        <Link href="/">
          <a className="btn btn-lg btn-rounded btn-block bg-blue-500 hover:bg-blue-600 text-white">
            Go back
          </a>
        </Link>
      </div>
    </div>
  )
}