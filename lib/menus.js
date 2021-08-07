import { FiCompass, FiHash } from 'react-icons/fi'
import { RiDashboardLine, RiHandCoinLine, RiSeedlingLine } from 'react-icons/ri'
import { CgTag, CgWebsite } from 'react-icons/cg'
import { BsGraphUp } from 'react-icons/bs'
import { RiExchangeBoxLine } from 'react-icons/ri'
import { HiOutlineViewGridAdd } from 'react-icons/hi'
import { BiWallet } from 'react-icons/bi'

export const navigation = [
  {
    title: 'Overview',
    items: [
      {
        url: '/',
        icon: <FiCompass size={20} />,
        title: 'Dashboard',
        items: [],
      },
      {
        url: '/feeds',
        icon: <RiDashboardLine size={20} />,
        title: 'Latest Feeds',
        items: [],
      },
    ],
  },
  {
    title: 'Cryptocurrencies',
    items: [
      {
        url: '/coins',
        icon: <FiHash size={20} />,
        title: 'Ranking',
        items: [
          {
            url: '/coins',
            title: 'Market Cap',
            index_shortcut: 'Market Cap',
            items: [],
          },
          {
            url: '/coins/high-volume',
            title: 'High Volume',
            items: [],
          },
          {
            url: '/coins/categories',
            title: 'Categories',
            items: [],
            is_shortcut: true,
          },
        ],
      },
      {
        url: '/coins/categories',
        icon: <CgTag size={20} />,
        title: 'Categories',
        items: [
          {
            url: '/coins/categories',
            title: 'All',
            index_shortcut: 'Categories',
            items: [],
          },
          {
            url: '/coins/decentralized-finance-defi',
            title: 'DeFi',
            index_shortcut: 'DeFi',
            items: [],
          },
          {
            url: '/coins/non-fungible-tokens-nft',
            title: 'NFTs',
            index_shortcut: 'NFTs',
            items: [],
          },
          {
            url: '/coins/binance-smart-chain',
            title: 'Binance Smart Chain',
            items: [],
          },
          {
            url: '/coins/dot-ecosystem',
            title: 'Polkadot',
            items: [],
          },
          {
            url: '/coins/polygon-ecosystem',
            title: 'Polygon',
            items: [],
          },
          {
            url: '/coins/solana-ecosystem',
            title: 'Solana',
            items: [],
          },
          {
            url: '/coins/heco-chain-ecosystem',
            title: 'Heco',
            items: [],
          },
          {
            url: '/coins/gaming',
            title: 'Play to Earn',
            items: [],
          },
        ],
      },
      {
        url: '/derivatives',
        icon: <BsGraphUp size={20} />,
        title: 'Derivatives',
        items: [
          {
            url: '/derivatives',
            title: 'Perpetuals',
            items: [],
          },
          {
            url: '/derivatives/futures',
            title: 'Futures',
            items: [],
          },
          {
            url: '/exchanges/derivatives',
            title: 'Exchanges',
            items: [],
            is_shortcut: true,
          },
        ],
      },
      {
        url: '/exchanges',
        icon: <RiExchangeBoxLine size={20} />,
        title: 'Exchanges',
        items: [
          {
            url: '/exchanges',
            title: 'Spot',
            index_shortcut: 'Exchanges',
            items: [],
          },
          {
            url: '/exchanges/dex',
            title: 'DEX',
            index_shortcut: 'DEX',
            items: [],
          },
          {
            url: '/exchanges/derivatives',
            title: 'Derivatives',
            items: [],
          },
        ],
      },
      {
        url: '/public-companies',
        icon: <RiHandCoinLine size={20} />,
        title: 'Public Companies',
        items: [
          {
            url: '/public-companies/bitcoin',
            title: 'Bitcoin Treasury',
            image: 'https://bitcoin.org/favicon.png',
            symbol: 'btc',
            items: [],
          },
          {
            url: '/public-companies/ethereum',
            title: 'Ethereum Treasury',
            image: 'https://ethereum.org/favicon-32x32.png',
            symbol: 'eth',
            items: [],
          },
        ],
      },
    ],
  },
  {
    title: 'Explore Tools',
    items: [
      {
        url: '/wallet',
        icon: <BiWallet size={20} />,
        title: 'Scan Wallet',
        items: [
          {
            url: '/wallet/eth-mainnet',
            title: 'Ethereum',
            items: [],
          },
          {
            url: '/wallet/bsc-mainnet',
            title: 'Binance Smart Chain',
            items: [],
          },
          {
            url: '/wallet/matic-mainnet',
            title: 'Polygon',
            items: [],
          },
        ],
      },
      {
        url: '/farm',
        icon: <RiSeedlingLine size={20} />,
        title: 'Farming',
        items: [
          {
            url: '/farm/sushiswap',
            title: 'SushiSwap',
            items: [],
          },
          {
            url: '/farm/quickswap',
            title: 'QuickSwap',
            items: [],
          },
          {
            url: '/farm/pangolin',
            title: 'Pangolin',
            items: [],
          },
        ],
      },
    ],
  },
  {
    title: 'Resources',
    items: [
      {
        url: '/widgets',
        icon: <HiOutlineViewGridAdd size={20} />,
        title: 'Widgets',
        items: [],
      },
      {
        url: '/blog/beginner-guide-2021',
        icon: <CgWebsite size={20} />,
        title: 'Blog',
        items: [],
      },
    ],
  },
]

export const currencies = [
  {
    id: 'usd',
    title: 'US Dollar',
    symbol: '$',
    background: 'bg-red-400',
  },
  {
    id: 'btc',
    title: 'Bitcoin',
    symbol: '₿',
    image: 'https://bitcoin.org/favicon.png',
  },
  {
    id: 'eur',
    title: 'Euro',
    symbol: '€',
    background: 'bg-indigo-900',
  },
  {
    id: 'eth',
    title: 'Ethereum',
    symbol: 'Ξ',
    image: 'https://ethereum.org/favicon-32x32.png',
  },
  {
    id: 'gbp',
    title: 'Pound Sterling',
    symbol: '£',
    background: 'bg-indigo-700',
  },
  {
    id: 'bnb',
    title: 'Binance Coin',
    image: 'https://bin.bnbstatic.com/static/images/common/favicon.ico',
  },
  {
    id: 'chf',
    title: 'Swiss Franc',
    symbol: 'Fr',
    background: 'bg-red-500',
  },
  {
    id: 'xrp',
    title: 'XRP',
    image: 'https://xrpl.org/assets/favicons/favicon-32x32.png',
  },
  {
    id: 'jpy',
    title: 'Japanese Yen',
    symbol: '¥',
    background: 'bg-red-500',
  },
  {
    id: 'dot',
    title: 'Polkadot',
    image: 'https://polkadot.network/content/images/2019/05/Polkadot_symbol_color.png',
  },
  {
    id: 'krw',
    title: 'South Korean',
    symbol: '₩',
    background: 'bg-blue-800',
  },
  {
    id: 'sats',
    title: 'Satoshi',
    symbol: '§',
    image: 'https://bitcoin.org/favicon.png',
  },
]