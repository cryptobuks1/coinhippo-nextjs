import Link from 'next/link'

// const colors = {
//   black: '#000',
//   white: '#fff',
//   rose: {
//     50: '#fff1f2',
//     100: '#ffe4e6',
//     200: '#fecdd3',
//     300: '#fda4af',
//     400: '#fb7185',
//     500: '#f43f5e',
//     600: '#e11d48',
//     700: '#be123c',
//     800: '#9f1239',
//     900: '#881337'
//   },
//   pink: {
//     50: '#fdf2f8',
//     100: '#fce7f3',
//     200: '#fbcfe8',
//     300: '#f9a8d4',
//     400: '#f472b6',
//     500: '#ec4899',
//     600: '#db2777',
//     700: '#be185d',
//     800: '#9d174d',
//     900: '#831843'
//   },
//   fuchsia: {
//     50: '#fdf4ff',
//     100: '#fae8ff',
//     200: '#f5d0fe',
//     300: '#f0abfc',
//     400: '#e879f9',
//     500: '#d946ef',
//     600: '#c026d3',
//     700: '#a21caf',
//     800: '#86198f',
//     900: '#701a75'
//   },
//   purple: {
//     50: '#faf5ff',
//     100: '#f3e8ff',
//     200: '#e9d5ff',
//     300: '#d8b4fe',
//     400: '#c084fc',
//     500: '#a855f7',
//     600: '#9333ea',
//     700: '#7e22ce',
//     800: '#6b21a8',
//     900: '#581c87'
//   },
//   violet: {
//     50: '#f5f3ff',
//     100: '#ede9fe',
//     200: '#ddd6fe',
//     300: '#c4b5fd',
//     400: '#a78bfa',
//     500: '#8b5cf6',
//     600: '#7c3aed',
//     700: '#6d28d9',
//     800: '#5b21b6',
//     900: '#4c1d95'
//   },
//   indigo: {
//     50: '#eef2ff',
//     100: '#e0e7ff',
//     200: '#c7d2fe',
//     300: '#a5b4fc',
//     400: '#818cf8',
//     500: '#6366f1',
//     600: '#4f46e5',
//     700: '#4338ca',
//     800: '#3730a3',
//     900: '#312e81'
//   },
//   blue: {
//     50: '#eff6ff',
//     100: '#dbeafe',
//     200: '#bfdbfe',
//     300: '#93c5fd',
//     400: '#60a5fa',
//     500: '#3b82f6',
//     600: '#2563eb',
//     700: '#1d4ed8',
//     800: '#1e40af',
//     900: '#1e3a8a'
//   },
//   lightBlue: {
//     50: '#f0f9ff',
//     100: '#e0f2fe',
//     200: '#bae6fd',
//     300: '#7dd3fc',
//     400: '#38bdf8',
//     500: '#0ea5e9',
//     600: '#0284c7',
//     700: '#0369a1',
//     800: '#075985',
//     900: '#0c4a6e'
//   },
//   cyan: {
//     50: '#ecfeff',
//     100: '#cffafe',
//     200: '#a5f3fc',
//     300: '#67e8f9',
//     400: '#22d3ee',
//     500: '#06b6d4',
//     600: '#0891b2',
//     700: '#0e7490',
//     800: '#155e75',
//     900: '#164e63'
//   },
//   teal: {
//     50: '#f0fdfa',
//     100: '#ccfbf1',
//     200: '#99f6e4',
//     300: '#5eead4',
//     400: '#2dd4bf',
//     500: '#14b8a6',
//     600: '#0d9488',
//     700: '#0f766e',
//     800: '#115e59',
//     900: '#134e4a'
//   },
//   emerald: {
//     50: '#ecfdf5',
//     100: '#d1fae5',
//     200: '#a7f3d0',
//     300: '#6ee7b7',
//     400: '#34d399',
//     500: '#10b981',
//     600: '#059669',
//     700: '#047857',
//     800: '#065f46',
//     900: '#064e3b'
//   },
//   green: {
//     50: '#f0fdf4',
//     100: '#dcfce7',
//     200: '#bbf7d0',
//     300: '#86efac',
//     400: '#4ade80',
//     500: '#22c55e',
//     600: '#16a34a',
//     700: '#15803d',
//     800: '#166534',
//     900: '#14532d'
//   },
//   lime: {
//     50: '#f7fee7',
//     100: '#ecfccb',
//     200: '#d9f99d',
//     300: '#bef264',
//     400: '#a3e635',
//     500: '#84cc16',
//     600: '#65a30d',
//     700: '#4d7c0f',
//     800: '#3f6212',
//     900: '#365314'
//   },
//   yellow: {
//     50: '#fefce8',
//     100: '#fef9c3',
//     200: '#fef08a',
//     300: '#fde047',
//     400: '#facc15',
//     500: '#eab308',
//     600: '#ca8a04',
//     700: '#a16207',
//     800: '#854d0e',
//     900: '#713f12'
//   },
//   amber: {
//     50: '#fffbeb',
//     100: '#fef3c7',
//     200: '#fde68a',
//     300: '#fcd34d',
//     400: '#fbbf24',
//     500: '#f59e0b',
//     600: '#d97706',
//     700: '#b45309',
//     800: '#92400e',
//     900: '#78350f'
//   },
//   orange: {
//     50: '#fff7ed',
//     100: '#ffedd5',
//     200: '#fed7aa',
//     300: '#fdba74',
//     400: '#fb923c',
//     500: '#f97316',
//     600: '#ea580c',
//     700: '#c2410c',
//     800: '#9a3412',
//     900: '#7c2d12'
//   },
//   red: {
//     50: '#fef2f2',
//     100: '#fee2e2',
//     200: '#fecaca',
//     300: '#fca5a5',
//     400: '#f87171',
//     500: '#ef4444',
//     600: '#dc2626',
//     700: '#b91c1c',
//     800: '#991b1b',
//     900: '#7f1d1d'
//   },
//   warmGray: {
//     50: '#fafaf9',
//     100: '#f5f5f4',
//     200: '#e7e5e4',
//     300: '#d6d3d1',
//     400: '#a8a29e',
//     500: '#78716c',
//     600: '#57534e',
//     700: '#44403c',
//     800: '#292524',
//     900: '#1c1917'
//   },
//   trueGray: {
//     50: '#fafafa',
//     100: '#f5f5f5',
//     200: '#e5e5e5',
//     300: '#d4d4d4',
//     400: '#a3a3a3',
//     500: '#737373',
//     600: '#525252',
//     700: '#404040',
//     800: '#262626',
//     900: '#171717'
//   },
//   gray: {
//     50: '#fafafa',
//     100: '#f4f4f5',
//     200: '#e4e4e7',
//     300: '#d4d4d8',
//     400: '#a1a1aa',
//     500: '#71717a',
//     600: '#52525b',
//     700: '#3f3f46',
//     800: '#27272a',
//     900: '#18181b'
//   },
//   coolGray: {
//     50: '#f9fafb',
//     100: '#f3f4f6',
//     200: '#e5e7eb',
//     300: '#d1d5db',
//     400: '#9ca3af',
//     500: '#6b7280',
//     600: '#4b5563',
//     700: '#374151',
//     800: '#1f2937',
//     900: '#111827'
//   },
//   blueGray: {
//     50: '#f8fafc',
//     100: '#f1f5f9',
//     200: '#e2e8f0',
//     300: '#cbd5e1',
//     400: '#94a3b8',
//     500: '#64748b',
//     600: '#475569',
//     700: '#334155',
//     800: '#1e293b',
//     900: '#0f172a'
//   }
// }

// const widths = {
//   '1/2': '50%',
//   '1/3': '33.333333%',
//   '2/3': '66.666667%',
//   '1/4': '25%',
//   '2/4': '50%',
//   '3/4': '75%',
//   '1/5': '20%',
//   '2/5': '40%',
//   '3/5': '60%',
//   '4/5': '80%',
//   '1/6': '16.666667%',
//   '2/6': '33.333333%',
//   '3/6': '50%',
//   '4/6': '66.666667%',
//   '5/6': '83.333333%',
//   '1/12': '8.333333%',
//   '2/12': '16.666667%',
//   '3/12': '25%',
//   '4/12': '33.333333%',
//   '5/12': '41.666667%',
//   '6/12': '50%',
//   '7/12': '58.333333%',
//   '8/12': '66.666667%',
//   '9/12': '75%',
//   '10/12': '83.333333%',
//   '11/12': '91.666667%',
//   full: '100%',
//   screen: '100vw',
//   min: 'min-content',
//   max: 'max-content',
// }

// const heights = {
//   '1/2': '50%',
//   '1/3': '33.333333%',
//   '2/3': '66.666667%',
//   '1/4': '25%',
//   '2/4': '50%',
//   '3/4': '75%',
//   '1/5': '20%',
//   '2/5': '40%',
//   '3/5': '60%',
//   '4/5': '80%',
//   '1/6': '16.666667%',
//   '2/6': '33.333333%',
//   '3/6': '50%',
//   '4/6': '66.666667%',
//   '5/6': '83.333333%',
//   full: '100%',
//   screen: '100vh',
// }

// const cssLoader = () => {
//   return (
//     <>
//       {['bg', 'text'].map(key => Object.entries(colors).map(([color, data]) => typeof data !== 'object' ?
//         <span key={color} className={`${key}-${color}`} />
//         :
//         Object.entries(data).map(([weight, hex]) => (
//           <span key={weight} className={`${key}-${color}-${weight}`} />
//         ))
//       ))}
//       {['w'].map(key => Object.entries(widths).map(([width, data]) => (
//         <span key={width} className={`${key}-${width}`} />
//       )))}
//       {['h'].map(key => Object.entries(heights).map(([height, data]) => (
//         <span key={height} className={`${key}-${height}`} />
//       )))}
//     </>
//   )
// }

export default function ErrorPage() {
  return (
    <div className="w-full max-w-xl flex flex-col text-center mx-2 md:mx-auto">
      <img
        src="/images/illustration.svg"
        alt="500"
        className="w-auto h-64 sm:h-40 lg:h-64 object-contain mb-8 sm:mb-4 lg:mb-8"
      />
      <h1 className="text-6xl text-blue-500 mb-4">500</h1>

      <div className="text-center text-gray-900 mb-8 sm:mb-4 lg:mb-8">
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
      {/*cssLoader()*/}
      <span class="bg-black"></span><span class="bg-white"></span><span class="bg-rose-50"></span><span class="bg-rose-100"></span><span class="bg-rose-200"></span><span class="bg-rose-300"></span><span class="bg-rose-400"></span><span class="bg-rose-500"></span><span class="bg-rose-600"></span><span class="bg-rose-700"></span><span class="bg-rose-800"></span><span class="bg-rose-900"></span><span class="bg-pink-50"></span><span class="bg-pink-100"></span><span class="bg-pink-200"></span><span class="bg-pink-300"></span><span class="bg-pink-400"></span><span class="bg-pink-500"></span><span class="bg-pink-600"></span><span class="bg-pink-700"></span><span class="bg-pink-800"></span><span class="bg-pink-900"></span><span class="bg-fuchsia-50"></span><span class="bg-fuchsia-100"></span><span class="bg-fuchsia-200"></span><span class="bg-fuchsia-300"></span><span class="bg-fuchsia-400"></span><span class="bg-fuchsia-500"></span><span class="bg-fuchsia-600"></span><span class="bg-fuchsia-700"></span><span class="bg-fuchsia-800"></span><span class="bg-fuchsia-900"></span><span class="bg-purple-50"></span><span class="bg-purple-100"></span><span class="bg-purple-200"></span><span class="bg-purple-300"></span><span class="bg-purple-400"></span><span class="bg-purple-500"></span><span class="bg-purple-600"></span><span class="bg-purple-700"></span><span class="bg-purple-800"></span><span class="bg-purple-900"></span><span class="bg-violet-50"></span><span class="bg-violet-100"></span><span class="bg-violet-200"></span><span class="bg-violet-300"></span><span class="bg-violet-400"></span><span class="bg-violet-500"></span><span class="bg-violet-600"></span><span class="bg-violet-700"></span><span class="bg-violet-800"></span><span class="bg-violet-900"></span><span class="bg-indigo-50"></span><span class="bg-indigo-100"></span><span class="bg-indigo-200"></span><span class="bg-indigo-300"></span><span class="bg-indigo-400"></span><span class="bg-indigo-500"></span><span class="bg-indigo-600"></span><span class="bg-indigo-700"></span><span class="bg-indigo-800"></span><span class="bg-indigo-900"></span><span class="bg-blue-50"></span><span class="bg-blue-100"></span><span class="bg-blue-200"></span><span class="bg-blue-300"></span><span class="bg-blue-400"></span><span class="bg-blue-500"></span><span class="bg-blue-600"></span><span class="bg-blue-700"></span><span class="bg-blue-800"></span><span class="bg-blue-900"></span><span class="bg-lightBlue-50"></span><span class="bg-lightBlue-100"></span><span class="bg-lightBlue-200"></span><span class="bg-lightBlue-300"></span><span class="bg-lightBlue-400"></span><span class="bg-lightBlue-500"></span><span class="bg-lightBlue-600"></span><span class="bg-lightBlue-700"></span><span class="bg-lightBlue-800"></span><span class="bg-lightBlue-900"></span><span class="bg-cyan-50"></span><span class="bg-cyan-100"></span><span class="bg-cyan-200"></span><span class="bg-cyan-300"></span><span class="bg-cyan-400"></span><span class="bg-cyan-500"></span><span class="bg-cyan-600"></span><span class="bg-cyan-700"></span><span class="bg-cyan-800"></span><span class="bg-cyan-900"></span><span class="bg-teal-50"></span><span class="bg-teal-100"></span><span class="bg-teal-200"></span><span class="bg-teal-300"></span><span class="bg-teal-400"></span><span class="bg-teal-500"></span><span class="bg-teal-600"></span><span class="bg-teal-700"></span><span class="bg-teal-800"></span><span class="bg-teal-900"></span><span class="bg-emerald-50"></span><span class="bg-emerald-100"></span><span class="bg-emerald-200"></span><span class="bg-emerald-300"></span><span class="bg-emerald-400"></span><span class="bg-emerald-500"></span><span class="bg-emerald-600"></span><span class="bg-emerald-700"></span><span class="bg-emerald-800"></span><span class="bg-emerald-900"></span><span class="bg-green-50"></span><span class="bg-green-100"></span><span class="bg-green-200"></span><span class="bg-green-300"></span><span class="bg-green-400"></span><span class="bg-green-500"></span><span class="bg-green-600"></span><span class="bg-green-700"></span><span class="bg-green-800"></span><span class="bg-green-900"></span><span class="bg-lime-50"></span><span class="bg-lime-100"></span><span class="bg-lime-200"></span><span class="bg-lime-300"></span><span class="bg-lime-400"></span><span class="bg-lime-500"></span><span class="bg-lime-600"></span><span class="bg-lime-700"></span><span class="bg-lime-800"></span><span class="bg-lime-900"></span><span class="bg-yellow-50"></span><span class="bg-yellow-100"></span><span class="bg-yellow-200"></span><span class="bg-yellow-300"></span><span class="bg-yellow-400"></span><span class="bg-yellow-500"></span><span class="bg-yellow-600"></span><span class="bg-yellow-700"></span><span class="bg-yellow-800"></span><span class="bg-yellow-900"></span><span class="bg-amber-50"></span><span class="bg-amber-100"></span><span class="bg-amber-200"></span><span class="bg-amber-300"></span><span class="bg-amber-400"></span><span class="bg-amber-500"></span><span class="bg-amber-600"></span><span class="bg-amber-700"></span><span class="bg-amber-800"></span><span class="bg-amber-900"></span><span class="bg-orange-50"></span><span class="bg-orange-100"></span><span class="bg-orange-200"></span><span class="bg-orange-300"></span><span class="bg-orange-400"></span><span class="bg-orange-500"></span><span class="bg-orange-600"></span><span class="bg-orange-700"></span><span class="bg-orange-800"></span><span class="bg-orange-900"></span><span class="bg-red-50"></span><span class="bg-red-100"></span><span class="bg-red-200"></span><span class="bg-red-300"></span><span class="bg-red-400"></span><span class="bg-red-500"></span><span class="bg-red-600"></span><span class="bg-red-700"></span><span class="bg-red-800"></span><span class="bg-red-900"></span><span class="bg-warmGray-50"></span><span class="bg-warmGray-100"></span><span class="bg-warmGray-200"></span><span class="bg-warmGray-300"></span><span class="bg-warmGray-400"></span><span class="bg-warmGray-500"></span><span class="bg-warmGray-600"></span><span class="bg-warmGray-700"></span><span class="bg-warmGray-800"></span><span class="bg-warmGray-900"></span><span class="bg-trueGray-50"></span><span class="bg-trueGray-100"></span><span class="bg-trueGray-200"></span><span class="bg-trueGray-300"></span><span class="bg-trueGray-400"></span><span class="bg-trueGray-500"></span><span class="bg-trueGray-600"></span><span class="bg-trueGray-700"></span><span class="bg-trueGray-800"></span><span class="bg-trueGray-900"></span><span class="bg-gray-50"></span><span class="bg-gray-100"></span><span class="bg-gray-200"></span><span class="bg-gray-300"></span><span class="bg-gray-400"></span><span class="bg-gray-500"></span><span class="bg-gray-600"></span><span class="bg-gray-700"></span><span class="bg-gray-800"></span><span class="bg-gray-900"></span><span class="bg-coolGray-50"></span><span class="bg-coolGray-100"></span><span class="bg-coolGray-200"></span><span class="bg-coolGray-300"></span><span class="bg-coolGray-400"></span><span class="bg-coolGray-500"></span><span class="bg-coolGray-600"></span><span class="bg-coolGray-700"></span><span class="bg-coolGray-800"></span><span class="bg-coolGray-900"></span><span class="bg-blueGray-50"></span><span class="bg-blueGray-100"></span><span class="bg-blueGray-200"></span><span class="bg-blueGray-300"></span><span class="bg-blueGray-400"></span><span class="bg-blueGray-500"></span><span class="bg-blueGray-600"></span><span class="bg-blueGray-700"></span><span class="bg-blueGray-800"></span><span class="bg-blueGray-900"></span><span class="text-black"></span><span class="text-white"></span><span class="text-rose-50"></span><span class="text-rose-100"></span><span class="text-rose-200"></span><span class="text-rose-300"></span><span class="text-rose-400"></span><span class="text-rose-500"></span><span class="text-rose-600"></span><span class="text-rose-700"></span><span class="text-rose-800"></span><span class="text-rose-900"></span><span class="text-pink-50"></span><span class="text-pink-100"></span><span class="text-pink-200"></span><span class="text-pink-300"></span><span class="text-pink-400"></span><span class="text-pink-500"></span><span class="text-pink-600"></span><span class="text-pink-700"></span><span class="text-pink-800"></span><span class="text-pink-900"></span><span class="text-fuchsia-50"></span><span class="text-fuchsia-100"></span><span class="text-fuchsia-200"></span><span class="text-fuchsia-300"></span><span class="text-fuchsia-400"></span><span class="text-fuchsia-500"></span><span class="text-fuchsia-600"></span><span class="text-fuchsia-700"></span><span class="text-fuchsia-800"></span><span class="text-fuchsia-900"></span><span class="text-purple-50"></span><span class="text-purple-100"></span><span class="text-purple-200"></span><span class="text-purple-300"></span><span class="text-purple-400"></span><span class="text-purple-500"></span><span class="text-purple-600"></span><span class="text-purple-700"></span><span class="text-purple-800"></span><span class="text-purple-900"></span><span class="text-violet-50"></span><span class="text-violet-100"></span><span class="text-violet-200"></span><span class="text-violet-300"></span><span class="text-violet-400"></span><span class="text-violet-500"></span><span class="text-violet-600"></span><span class="text-violet-700"></span><span class="text-violet-800"></span><span class="text-violet-900"></span><span class="text-indigo-50"></span><span class="text-indigo-100"></span><span class="text-indigo-200"></span><span class="text-indigo-300"></span><span class="text-indigo-400"></span><span class="text-indigo-500"></span><span class="text-indigo-600"></span><span class="text-indigo-700"></span><span class="text-indigo-800"></span><span class="text-indigo-900"></span><span class="text-blue-50"></span><span class="text-blue-100"></span><span class="text-blue-200"></span><span class="text-blue-300"></span><span class="text-blue-400"></span><span class="text-blue-500"></span><span class="text-blue-600"></span><span class="text-blue-700"></span><span class="text-blue-800"></span><span class="text-blue-900"></span><span class="text-lightBlue-50"></span><span class="text-lightBlue-100"></span><span class="text-lightBlue-200"></span><span class="text-lightBlue-300"></span><span class="text-lightBlue-400"></span><span class="text-lightBlue-500"></span><span class="text-lightBlue-600"></span><span class="text-lightBlue-700"></span><span class="text-lightBlue-800"></span><span class="text-lightBlue-900"></span><span class="text-cyan-50"></span><span class="text-cyan-100"></span><span class="text-cyan-200"></span><span class="text-cyan-300"></span><span class="text-cyan-400"></span><span class="text-cyan-500"></span><span class="text-cyan-600"></span><span class="text-cyan-700"></span><span class="text-cyan-800"></span><span class="text-cyan-900"></span><span class="text-teal-50"></span><span class="text-teal-100"></span><span class="text-teal-200"></span><span class="text-teal-300"></span><span class="text-teal-400"></span><span class="text-teal-500"></span><span class="text-teal-600"></span><span class="text-teal-700"></span><span class="text-teal-800"></span><span class="text-teal-900"></span><span class="text-emerald-50"></span><span class="text-emerald-100"></span><span class="text-emerald-200"></span><span class="text-emerald-300"></span><span class="text-emerald-400"></span><span class="text-emerald-500"></span><span class="text-emerald-600"></span><span class="text-emerald-700"></span><span class="text-emerald-800"></span><span class="text-emerald-900"></span><span class="text-green-50"></span><span class="text-green-100"></span><span class="text-green-200"></span><span class="text-green-300"></span><span class="text-green-400"></span><span class="text-green-500"></span><span class="text-green-600"></span><span class="text-green-700"></span><span class="text-green-800"></span><span class="text-green-900"></span><span class="text-lime-50"></span><span class="text-lime-100"></span><span class="text-lime-200"></span><span class="text-lime-300"></span><span class="text-lime-400"></span><span class="text-lime-500"></span><span class="text-lime-600"></span><span class="text-lime-700"></span><span class="text-lime-800"></span><span class="text-lime-900"></span><span class="text-yellow-50"></span><span class="text-yellow-100"></span><span class="text-yellow-200"></span><span class="text-yellow-300"></span><span class="text-yellow-400"></span><span class="text-yellow-500"></span><span class="text-yellow-600"></span><span class="text-yellow-700"></span><span class="text-yellow-800"></span><span class="text-yellow-900"></span><span class="text-amber-50"></span><span class="text-amber-100"></span><span class="text-amber-200"></span><span class="text-amber-300"></span><span class="text-amber-400"></span><span class="text-amber-500"></span><span class="text-amber-600"></span><span class="text-amber-700"></span><span class="text-amber-800"></span><span class="text-amber-900"></span><span class="text-orange-50"></span><span class="text-orange-100"></span><span class="text-orange-200"></span><span class="text-orange-300"></span><span class="text-orange-400"></span><span class="text-orange-500"></span><span class="text-orange-600"></span><span class="text-orange-700"></span><span class="text-orange-800"></span><span class="text-orange-900"></span><span class="text-red-50"></span><span class="text-red-100"></span><span class="text-red-200"></span><span class="text-red-300"></span><span class="text-red-400"></span><span class="text-red-500"></span><span class="text-red-600"></span><span class="text-red-700"></span><span class="text-red-800"></span><span class="text-red-900"></span><span class="text-warmGray-50"></span><span class="text-warmGray-100"></span><span class="text-warmGray-200"></span><span class="text-warmGray-300"></span><span class="text-warmGray-400"></span><span class="text-warmGray-500"></span><span class="text-warmGray-600"></span><span class="text-warmGray-700"></span><span class="text-warmGray-800"></span><span class="text-warmGray-900"></span><span class="text-trueGray-50"></span><span class="text-trueGray-100"></span><span class="text-trueGray-200"></span><span class="text-trueGray-300"></span><span class="text-trueGray-400"></span><span class="text-trueGray-500"></span><span class="text-trueGray-600"></span><span class="text-trueGray-700"></span><span class="text-trueGray-800"></span><span class="text-trueGray-900"></span><span class="text-gray-50"></span><span class="text-gray-100"></span><span class="text-gray-200"></span><span class="text-gray-300"></span><span class="text-gray-400"></span><span class="text-gray-500"></span><span class="text-gray-600"></span><span class="text-gray-700"></span><span class="text-gray-800"></span><span class="text-gray-900"></span><span class="text-coolGray-50"></span><span class="text-coolGray-100"></span><span class="text-coolGray-200"></span><span class="text-coolGray-300"></span><span class="text-coolGray-400"></span><span class="text-coolGray-500"></span><span class="text-coolGray-600"></span><span class="text-coolGray-700"></span><span class="text-coolGray-800"></span><span class="text-coolGray-900"></span><span class="text-blueGray-50"></span><span class="text-blueGray-100"></span><span class="text-blueGray-200"></span><span class="text-blueGray-300"></span><span class="text-blueGray-400"></span><span class="text-blueGray-500"></span><span class="text-blueGray-600"></span><span class="text-blueGray-700"></span><span class="text-blueGray-800"></span><span class="text-blueGray-900"></span><span class="w-1/2"></span><span class="w-1/3"></span><span class="w-2/3"></span><span class="w-1/4"></span><span class="w-2/4"></span><span class="w-3/4"></span><span class="w-1/5"></span><span class="w-2/5"></span><span class="w-3/5"></span><span class="w-4/5"></span><span class="w-1/6"></span><span class="w-2/6"></span><span class="w-3/6"></span><span class="w-4/6"></span><span class="w-5/6"></span><span class="w-1/12"></span><span class="w-2/12"></span><span class="w-3/12"></span><span class="w-4/12"></span><span class="w-5/12"></span><span class="w-6/12"></span><span class="w-7/12"></span><span class="w-8/12"></span><span class="w-9/12"></span><span class="w-10/12"></span><span class="w-11/12"></span><span class="w-full"></span><span class="w-screen"></span><span class="w-min"></span><span class="w-max"></span><span class="h-1/2"></span><span class="h-1/3"></span><span class="h-2/3"></span><span class="h-1/4"></span><span class="h-2/4"></span><span class="h-3/4"></span><span class="h-1/5"></span><span class="h-2/5"></span><span class="h-3/5"></span><span class="h-4/5"></span><span class="h-1/6"></span><span class="h-2/6"></span><span class="h-3/6"></span><span class="h-4/6"></span><span class="h-5/6"></span><span class="h-full"></span><span class="h-screen"></span>
    </div>
  )
}