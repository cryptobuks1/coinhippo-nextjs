import _ from 'lodash'
import { getName } from './utils'

export default function getMeta(path, data) {
  path = !path ? '/' : path.toLowerCase()
  path = path.startsWith('/widget/') ? path.substring('/widget'.length) : path
  path = path.includes('?') ? path.substring(0, path.indexOf('?')) : path

  const pathSplit = path.split('/').filter(x => x)

  let title = `${_.cloneDeep(pathSplit).reverse().map(x => getName(x, data)).join(' - ')}${pathSplit.length > 0 ? ` | ${process.env.NEXT_PUBLIC_APP_NAME}` : process.env.NEXT_PUBLIC_DEFAULT_TITLE}`
  let description = process.env.NEXT_PUBLIC_DEFAULT_DESCRIPTION
  let image = `${process.env.NEXT_PUBLIC_SITE_URL}/images/ogimage.png`
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}${path}`

  if (pathSplit[0] === 'coins') {
    if (pathSplit[1] === 'high-volume') {
      title = `Coins - High Volume | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of top cryptocurrency prices by volume, along with their statistics that matter.`
    }
    else if (pathSplit[1] === 'categories') {
      title = `Coins - Category | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of cryptocurrencies by category, along with their statistics that matter.`
    }
    else if (pathSplit[1]) {
      title = `${getName(pathSplit[1], data)} | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of cryptocurrencies by type, along with their statistics that matter.`
    }
    else {
      title = `Coins | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of top cryptocurrency prices by market capitalization, along with their statistics that matter.`
    }
  }
  else if (pathSplit[0] === 'coin') {
    if (data) {
      title = `${data.name} ${data.symbol ? `${data.symbol.toUpperCase()} ` : ''}| ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Get the latest ${data.name} price, ${data.symbol ? `${data.symbol.toUpperCase()} ` : ''}market cap, Technical charts and other information related to ${data.name}.`
      image = data.image && data.image.large ? data.image.large : image
    }
  }
  else if (pathSplit[0] === 'derivatives') {
    if (pathSplit[1] === 'futures') {
      title = `Top Cryptocurrencies' Derivatives Futures Contract | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of cryptocurrencies' derivatives contracts by open interest, along with their statistics that matter.`
    }
    else {
      title = `Top Cryptocurrencies' Derivatives Perpetual Contract | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of cryptocurrencies' derivatives contracts by open interest, along with their statistics that matter.`
    }
  }
  else if (pathSplit[0] === 'exchanges') {
    if (pathSplit[1] === 'dex') {
      title = `Top Decentralized Exchanges by Volume | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of top decentralized exchanges by volume, along with their statistics that matter.`
    }
    else if (pathSplit[1] === 'derivatives') {
      title = `Top Derivatives Exchanges by Volume | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of top derivatives exchanges by volume, along with their statistics that matter.`
    }
    else {
      title = `Top Exchanges by Confidence | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of top exchanges by confidence, along with their statistics that matter.`
    }
  }
  else if (pathSplit[0] === 'exchange') {
    if (data) {
      title = `${data.name} Trade Volume, Trade Pairs, Market Listing | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Find out ${data.name} trading volume, fees, pair list and other updated information. See the most actively traded coins on ${data.name}.`
      image = typeof data.image === 'string' ? data.image.replace('small', 'large') : image
    }
  }
  else if (pathSplit[0] === 'watchlist') {
    title = `Watchlist | ${process.env.NEXT_PUBLIC_APP_NAME}`
    description = `Build your own personalized watchlist, and keep track of your favorite cryptocurrencies.`
  }
  else if (pathSplit[0] === 'public-companies') {
    if (pathSplit[1]) {
      title = `${getName(pathSplit[1])} Holdings by Public Companies | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of publicly traded companies that are buying ${getName(pathSplit[1])} as part of corporate treasury.`
    }
    else {
      title = `Crypto Holdings by Public Companies | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the list of publicly traded companies that are buying crypto as part of corporate treasury.`
    }
  }
  else if (pathSplit[0] === 'parachains') {
    title = `${getName(pathSplit[1])} Parachain | ${process.env.NEXT_PUBLIC_APP_NAME}`
    description = `See the list of ${getName(pathSplit[1])} parachain projects`
  }
  else if (pathSplit[0] === 'wallet') {
    if (pathSplit[1]) {
      description = `Scan wallet and see assets inside`
    }
    else {
      title = `Wallet Explorer | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Scan wallet and see assets inside`
    }
  }
  else if (pathSplit[0] === 'farm') {
    if (pathSplit[1]) {
      title = `DeFi Farming in ${getName(pathSplit[1], data)} | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See top available pools in ${getName(pathSplit[1], data)}, along with their liquidity, volume, and other important information.`
    }
    else {
      title = `DeFi Farming | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See top available pools, along with their liquidity, volume, and other important information.`
    }
  }
  else if (pathSplit[0] === 'feeds') {
    title = `Cryptocurrency Feed | ${process.env.NEXT_PUBLIC_APP_NAME}`
    description = `Catch up on price changes, trading signals, trends, and news in #crypto world.`
  }
  else if (pathSplit[0] === 'widgets') {
    title = `Widgets | ${process.env.NEXT_PUBLIC_APP_NAME}`
    description = `Embed ${process.env.NEXT_PUBLIC_APP_NAME}'s cryptocurrency widgets to your website or blog for free.`
  }
  else if (pathSplit[0] === 'blog') {
    if (pathSplit[1] && data && data.meta) {
      const baseUrl = `${process.env.NEXT_PUBLIC_AWS_S3_URL}/${process.env.NEXT_PUBLIC_AWS_S3_BUCKET}/blog`
      title = data.meta.title ? data.meta.title : title
      description = data.meta.description ? data.meta.description : description
      image = data.meta.image ? `${baseUrl}/${pathSplit[1]}/${pathSplit[2] ? `posts/${pathSplit[2]}/` : ''}assets/${data.meta.image}` : image
    }
    else {
      title = `Cryptocurrency, Blockchain Technology, and Trading Blog | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Read our high-quality and free blog post covering the cryptocurrency world and blockchain technology.`
    }
  }

  return { title, description, image, url }
}