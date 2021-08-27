import { FiCompass, FiHash } from 'react-icons/fi'
import { RiDashboardLine, RiHandCoinLine, RiSeedlingLine } from 'react-icons/ri'
import { CgTag, CgWebsite } from 'react-icons/cg'
import { BsGraphUp } from 'react-icons/bs'
import { TiStarOutline } from 'react-icons/ti'
import { HiOutlineDocumentSearch, HiOutlineViewGridAdd } from 'react-icons/hi'
import { VscRocket } from 'react-icons/vsc'
import { GiParachute } from 'react-icons/gi'
import { BiTransferAlt, BiWallet } from 'react-icons/bi'
import { IoGameControllerOutline } from 'react-icons/io5'

export const navigations = [
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
             url: '/coins/avalanche-ecosystem',
            title: 'Avalanche',
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
        url: '/watchlist',
        icon: <TiStarOutline size={20} />,
        title: 'Watchlist',
        items: [],
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
        icon: <BiTransferAlt size={20} />,
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
      {
        icon: <IoGameControllerOutline size={20} />,
        title: 'NFTs',
        items: [
          {
            title: 'NonFungible',
            url: 'https://nonfungible.com',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'CryptoSlam!',
            url: 'https://cryptoslam.io',
            items: [],
            isExternalUrl: true,
          },
        ],
      },
    ],
  },
  {
    title: 'Events',
    items: [
      {
        url: 'https://icodrops.com',
        icon: <VscRocket size={20} />,
        title: 'ICOs',
        items: [],
        isExternalUrl: true,
      },
      {
        url: '/parachains',
        icon: <GiParachute size={20} />,
        title: 'Parachains',
        items: [
          {
            url: '/parachains/kusama',
            title: 'Kusama',
            items: [],
            image: 'https://assets.coingecko.com/coins/images/9568/large/m4zRhP5e_400x400.jpg',
            explorer: {
              name: 'Subscan',
              url: 'https://kusama.subscan.io',
              parachain_path: '/parachain/{para_id}',
              fund_path: '/crowdloan/{fund_id}',
              address_path: '/account/{address}',
              auction_path: '/auction_board',
            },
          },
          {
            url: '/parachains/polkadot',
            title: 'Polkadot',
            items: [],
            image: 'https://assets.coingecko.com/coins/images/12171/large/aJGBjJFU_400x400.jpg',
            isComing: true,
            explorer: {
              name: 'Subscan',
              url: 'https://polkadot.subscan.io',
              parachain_path: '/parachain/{para_id}',
              fund_path: '/crowdloan/{fund_id}',
              address_path: '/account/{address}',
              auction_path: '/auction_board',
            },
          },
        ],
      },
    ],
  },
  {
    title: 'Explore Tools',
    items: [
      {
        icon: <HiOutlineDocumentSearch size={20} />,
        title: 'Explorers',
        itemsClassName: 'max-h-60 overflow-y-scroll',
        items: [
          {
            title: 'Bitcoin',
            url: 'https://blockchain.com/explorer',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'Ethereum',
            url: 'https://etherscan.io',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'BSC',
            url: 'https://bscscan.com',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'Polygon',
            url: 'https://polygonscan.com',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'Polkadot',
            url: 'https://polkadot.subscan.io',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'Solana',
            url: 'https://explorer.solana.com',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'Cardano',
            url: 'https://cardanoscan.io',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'XRP',
            url: 'https://xrpscan.com',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'VeChain',
            url: 'https://explore.vechain.org',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'Tron',
            url: 'https://tronscan.org',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'Avalanche',
            url: 'https://avascan.info',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'Cosmos',
            url: 'https://atomscan.com',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'Kusama',
            url: 'https://kusama.subscan.io',
            items: [],
            isExternalUrl: true,
          },
          {
            title: 'Flow',
            url: 'https://flowscan.org',
            items: [],
            isExternalUrl: true,
          },
        ],
      },
      {
        url: '/wallet',
        icon: <BiWallet size={20} />,
        title: 'Scan Wallet',
        itemsClassName: 'max-h-60 overflow-y-scroll',
        items: [
          {
            url: '/wallet/eth-mainnet',
            title: 'Ethereum',
            items: [],
            image: 'https://www.covalenthq.com/static/images/icons/display-icons/ethereum-eth-logo.png',
            chain_id: 1,
            currency_symbol: 'eth',
            explorer: {
              name: 'Etherscan',
              url: 'https://etherscan.io',
              block_path: '/block/{block}',
              address_path: '/address/{address}',
              contract_path: '/token/{address}',
            },
          },
          {
            url: '/wallet/bsc-mainnet',
            title: 'Binance Smart Chain',
            items: [],
            image: 'https://www.covalenthq.com/static/images/icons/display-icons/binance-coin-bnb-logo.png',
            chain_id: 56,
            currency_symbol: 'bnb',
            explorer: {
              name: 'BscScan',
              url: 'https://bscscan.com',
              block_path: '/block/{block}',
              address_path: '/address/{address}',
              contract_path: '/token/{address}',
            },
          },
          {
            url: '/wallet/matic-mainnet',
            title: 'Polygon',
            items: [],
            image: 'https://www.covalenthq.com/static/images/icons/display-icons/polygon-matic-logo.png',
            chain_id: 137,
            currency_symbol: 'matic',
            explorer: {
              name: 'PolygonScan',
              url: 'https://polygonscan.com',
              block_path: '/block/{block}',
              address_path: '/address/{address}',
              contract_path: '/token/{address}',
            },
          },
          {
            url: '/wallet/avalanche-mainnet',
            title: 'Avalanche',
            items: [],
            image: 'https://www.covalenthq.com/static/images/icons/display-icons/avalanche-avax-logo.png',
            chain_id: 43114,
            currency_symbol: 'avax',
            explorer: {
              name: 'AVASCAN',
              url: 'https://avascan.info',
              block_path: '/blockchain/c/block/{block}',
              address_path: '/blockchain/c/address/{address}',
              contract_path: '/blockchain/c/token/{address}',
            },
          },
          {
            url: '/wallet/fantom-mainnet',
            title: 'Fantom',
            items: [],
            image: 'https://www.covalenthq.com/static/images/icons/display-icons/fantom-ftm-logo.png',
            chain_id: 250,
            currency_symbol: 'ftm',
            explorer: {
              name: 'FTMScan',
              url: 'https://ftmscan.com',
              block_path: '/block/{block}',
              address_path: '/address/{address}',
              contract_path: '/token/{address}',
            },
          },
          {
            url: '/wallet/moonbeam-moonriver',
            title: 'Moonbeam Moonriver',
            items: [],
            image: 'https://www.covalenthq.com/static/images/icons/display-icons/moonbeam-logo.png',
            chain_id: 1285,
            currency_symbol: 'movr',
            explorer: {
              name: 'SUBSCAN',
              url: 'https://moonriver.subscan.io',
              block_path: '/block/{block}',
              address_path: '/account/{address}',
              contract_path: '/account/{address}',
            },
          },
        ],
      },
      {
        url: '/farm',
        icon: <RiSeedlingLine size={20} />,
        title: 'Farming',
        itemsClassName: 'max-h-60 overflow-y-scroll',
        items: [
          {
            url: 'https://info.uniswap.org',
            title: 'Uniswap',
            items: [],
            image: 'https://assets.coingecko.com/markets/images/665/large/uniswap-v3.png',
            isExternalUrl: true,
          },
          {
            url: 'https://pancakeswap.info',
            title: 'PancakeSwap',
            items: [],
            image: 'https://assets.coingecko.com/markets/images/657/large/pancakeswap.png',
            isExternalUrl: true,
          },
          {
            url: '/farm/sushiswap',
            title: 'SushiSwap',
            items: [],
            image: 'https://assets.coingecko.com/markets/images/576/large/2048x2048_Logo.png',
            chain_id: 1,
            contract_address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
            currency_symbol: 'sushi',
            gas: {
              id: 'ethereum',
              symbol: 'eth',
            },
            explorer: {
              name: 'Etherscan',
              url: 'https://etherscan.io',
              block_path: '/block/{block}',
              address_path: '/address/{address}',
              contract_path: '/token/{address}',
            },
            dex: {
              exchange: {
                url: 'https://app.sushi.com',
                liquidity_path: '/add/{token_0}/{token_1}',
                swap_path: '/swap?inputCurrency={token_0}&outputCurrency={token_1}',
              },
              analytic: {
                url: 'https://analytics.sushi.com',
                pairs_path: '/pairs',
                fees_path: '/bar',
                pair_path: '/pairs/{address}',
                token_path: '/tokens/{address}',
              },
            },
          },
          {
            url: 'https://app.1inch.io/#/1/dao/analytics',
            title: '1inch',
            items: [],
            image: 'https://assets.coingecko.com/markets/images/553/large/1inch-v2.png',
            isExternalUrl: true,
          },
          {
            url: '/farm/quickswap',
            title: 'QuickSwap',
            items: [],
            image: 'https://assets.coingecko.com/markets/images/629/large/1_pOU6pBMEmiL-ZJVb0CYRjQ_%281%29.png',
            chain_id: 137,
            contract_address: '0x831753dd7087cac61ab5644b308642cc1c33dc13',
            currency_symbol: 'quick',
            gas: {
              id: 'matic-network',
              symbol: 'matic',
            },
            explorer: {
              name: 'PolygonScan',
              url: 'https://polygonscan.com',
              block_path: '/block/{block}',
              address_path: '/address/{address}',
              contract_path: '/token/{address}',
            },
            dex: {
              exchange: {
                url: 'https://quickswap.exchange',
                liquidity_path: '/#/add/{token_0}/{token_1}',
                swap_path: '/#/swap?inputCurrency={token_0}&outputCurrency={token_1}',
              },
              analytic: {
                url: 'https://info.quickswap.exchange',
                pairs_path: '/pairs',
                fees_path: '',
                pair_path: '/pair/{address}',
                token_path: '/token/{address}',
              },
            },
          },
          {
            url: '/farm/pangolin',
            title: 'Pangolin',
            items: [],
            image: 'https://assets.coingecko.com/markets/images/627/large/pangolin.jpg',
            chain_id: 43114,
            contract_address: '0x60781c2586d68229fde47564546784ab3faca982',
            currency_symbol: 'png',
            gas: {
              id: 'avalanche-2',
              symbol: 'avax',
            },
            explorer: {
              name: 'AVASCAN',
              url: 'https://avascan.info',
              block_path: '/blockchain/c/block/{block}',
              address_path: '/blockchain/c/address/{address}',
              contract_path: '/blockchain/c/token/{address}',
            },
            dex: {
              exchange: {
                url: 'https://app.pangolin.exchange',
                liquidity_path: '/#/add/{token_0}/{token_1}',
                swap_path: '/#/swap?inputCurrency={token_0}&outputCurrency={token_1}',
              },
              analytic: {
                url: 'https://info.pangolin.exchange',
                pairs_path: '/#/pairs',
                fees_path: '',
                pair_path: '/#/pair/{address}',
                token_path: '/#/token/{address}',
              },
            },
          },
          {
            url: '/farm/spiritswap',
            title: 'SpiritSwap',
            items: [],
            image: 'https://assets.coingecko.com/markets/images/671/large/spiritswap.png',
            chain_id: 250,
            contract_address: '0x5cc61a78f164885776aa610fb0fe1257df78e59b',
            currency_symbol: 'spirit',
            gas: {
              id: 'fantom',
              symbol: 'ftm',
            },
            explorer: {
              name: 'FTMScan',
              url: 'https://ftmscan.com',
              block_path: '/block/{block}',
              address_path: '/address/{address}',
              contract_path: '/token/{address}',
            },
            dex: {
              exchange: {
                url: 'https://swap.spiritswap.finance',
                liquidity_path: '/#/add/{token_0}/{token_1}',
                swap_path: '/#/swap?inputCurrency={token_0}&outputCurrency={token_1}',
              },
              analytic: {
                url: 'https://info.spiritswap.finance',
                pairs_path: '/pairs',
                fees_path: '',
                pair_path: '/pair/{address}',
                token_path: '/token/{address}',
              },
            },
          },
          {
            url: '/farm/spookyswap',
            title: 'SpookySwap',
            items: [],
            image: 'https://assets.coingecko.com/markets/images/662/large/spookyswap.png',
            chain_id: 250,
            contract_address: '0x841fad6eae12c286d1fd18d1d525dffa75c7effe',
            currency_symbol: 'boo',
            gas: {
              id: 'fantom',
              symbol: 'ftm',
            },
            explorer: {
              name: 'FTMScan',
              url: 'https://ftmscan.com',
              block_path: '/block/{block}',
              address_path: '/address/{address}',
              contract_path: '/token/{address}',
            },
            dex: {
              exchange: {
                url: 'https://spookyswap.finance',
                liquidity_path: '/add/{token_0}/{token_1}',
                swap_path: '/swap?inputCurrency={token_0}&outputCurrency={token_1}',
              },
              analytic: {
                url: 'https://info.spookyswap.finance',
                pairs_path: '/pairs',
                fees_path: '',
                pair_path: '/pair/{address}',
                token_path: '/token/{address}',
              },
            },
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
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
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
    image: 'https://assets.coingecko.com/coins/images/12171/large/aJGBjJFU_400x400.jpg',
  },
  {
    id: 'krw',
    title: 'South Korean',
    symbol: '₩',
    background: 'bg-blue-800',
  },
  {
    id: 'bch',
    title: 'Bitcoin Cash',
    image: 'https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png',
  },
  {
    id: 'aud',
    title: 'Australian',
    symbol: 'A$',
    background: 'bg-blue-900',
  },
  {
    id: 'link',
    title: 'Chainlink',
    image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
  },
  {
    id: 'brl',
    title: 'Brazil Real',
    symbol: 'R$',
    background: 'bg-green-600',
  },
  {
    id: 'ltc',
    title: 'Litecoin',
    image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
  },
  {
    id: 'cny',
    title: 'Chinese Yuan',
    symbol: 'CN¥',
    background: 'bg-red-500',
  },
  {
    id: 'xlm',
    title: 'Stellar',
    image: 'https://assets.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png',
  },
  {
    id: 'hkd',
    title: 'Hong Kong',
    symbol: 'HK$',
    background: 'bg-red-600',
  },
  {
    id: 'eos',
    title: 'Eos',
    image: 'https://assets.coingecko.com/coins/images/738/large/eos-eos-logo.png',
  },
  {
    id: 'idr',
    title: 'Rupiah',
    symbol: 'Rp',
    background: 'bg-red-500',
  },
  {
    id: 'yfi',
    title: 'Yearn.finance',
    image: 'https://assets.coingecko.com/coins/images/11849/large/yfi-192x192.png',
  },
  {
    id: 'inr',
    title: 'Indian Rupee',
    symbol: '₹',
    background: 'bg-green-800',
  },
  {
    id: 'sats',
    title: 'Satoshi',
    symbol: '§',
    image: 'https://bitcoin.org/favicon.png',
  },
  {
    id: 'sgd',
    title: 'Singapore',
    symbol: 'S$',
    background: 'bg-red-500',
  },
]