import { useSelector, shallowEqual } from 'react-redux'
import Image from '../image'
import { FaHeart, FaTwitter, FaTelegram } from 'react-icons/fa'
import moment from 'moment'

export default function Footer() {
  const { theme } = useSelector(state => ({ theme: state.theme }), shallowEqual)
  const { background } = { ...theme }

  return (
    <div className={`footer flex flex-col md:flex-row items-center text-xs font-light p-3 ${background === 'dark' ? 'dark' : ''}`}>
      <span className="w-full md:w-1/3 flex items-center justify-center md:justify-start text-gray-400">
        Data from
        <a href="https://coingecko.com" target="_blank" rel="noopener noreferrer" className="flex items-center ml-2"><Image src="/logos/api/coingecko.png" alt="" width={24} height={24} /></a>
        <a href="https://covalenthq.com" target="_blank" rel="noopener noreferrer" className="flex items-center ml-2"><Image src="/logos/api/covalent.png" alt="" width={24} height={24} /></a>
        <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" className="flex items-center ml-2"><Image src="/logos/api/etherscan.png" alt="" width={24} height={24} className="bg-white rounded-full" /></a>
        <a href="https://subscan.io" target="_blank" rel="noopener noreferrer" className="flex items-center ml-2"><Image src="/logos/api/subscan.png" alt="" width={24} height={24} /></a>
        <a href="https://alternative.me/crypto" target="_blank" rel="noopener noreferrer" className="flex items-center ml-2"><Image src="/logos/api/alternative.png" alt="" width={24} height={24} /></a>
        <a href="https://whale-alert.io" target="_blank" rel="noopener noreferrer" className="flex items-center ml-2"><Image src="/logos/api/whalealert.png" alt="" width={24} height={24} /></a>
        <a href="https://cryptopanic.com" target="_blank" rel="noopener noreferrer" className="flex items-center ml-2"><Image src="/logos/api/cryptopanic.png" alt="" width={24} height={24} /></a>
      </span>
      <span className="w-full md:w-1/3 flex items-center justify-center text-gray-400 mt-4 md:mt-0">
        © {moment().format('YYYY')} made with <FaHeart className="text-red-400 text-xl mx-1" /> by <span className="font-semibold mx-1">{process.env.NEXT_PUBLIC_APP_NAME}</span> team.
      </span>
      <span className="w-full md:w-1/3 flex items-center justify-center md:justify-end text-gray-400 mt-4 md:mt-0">
        Follow us on
        <a href={`https://twitter.com/${process.env.NEXT_PUBLIC_TWITTER_USERNAME}`} target="_blank" rel="noopener noreferrer" className="flex items-center ml-2"><FaTwitter className="text-twitter text-2xl" /></a>
        <a href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_USERNAME}`} target="_blank" rel="noopener noreferrer" className="flex items-center ml-2"><FaTelegram className="text-telegram text-2xl" /></a>
      </span>
    </div>
  )
}