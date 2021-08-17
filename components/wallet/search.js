import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FiSearch } from 'react-icons/fi'
import { generateUrl } from '../../lib/utils'

export default function search() {
	const router = useRouter()
	const { query } = { ...router }
	const { chain_name, asset } = { ...query }

  const [inputSearch, setInputSearch] = useState('')

  const { handleSubmit } = useForm()

  const onSubmit = () => router.push(generateUrl(`/wallet/${chain_name}/${inputSearch}`, asset ? { asset } : null))

  return (
		<form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative">
        <input
          value={inputSearch}
          onChange={event => setInputSearch(event.target.value)}
          type="search"
          placeholder="Search by Address"
          className="w-72 sm:w-96 h-8 sm:h-10 bg-white dark:bg-gray-800 rounded border-0 text-xs pl-2 sm:pl-8 pr-0 sm:pr-3"
        />
        <div className="hidden sm:block absolute top-0 left-0 mt-3 ml-2.5">
          <FiSearch size={14} className="stroke-current" />
        </div>
      </div>
    </form>
  )
}