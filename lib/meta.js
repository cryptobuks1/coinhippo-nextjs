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
      title = `Top Cryptocurrency Prices by Volume | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Get the top latest cryptocurrency prices ranking by their volume - including their trade volume, percentage changes, chart, liquidity, and more.`
    }
    else if (pathSplit[1] === 'categories') {
      title = `Top Cryptocurrency Categories by Market Cap | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Get the top latest cryptocurrency categories ranking by their market cap - including their trade volume, percentage changes, chart, liquidity, and more.`
    }
    else if (pathSplit[1]) {
      title = `${getName(pathSplit[1], data)} by Market Cap | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Get top latest coins built on top of or are a part of the ${getName(pathSplit[1], data)} with their prices, market cap, percentage changes, chart, liquidity, and more.`
    }
    else {
      title = `Top Cryptocurrency Prices by Market Cap | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Get the top latest cryptocurrency prices ranking by their market cap - including their trade volume, percentage changes, chart, liquidity, and more.`
    }
  }
  else if (pathSplit[0] === 'coin') {
    if (data) {
      title = `${data.name} Price to USD | ${data.symbol ? data.symbol.toUpperCase() : data.name} Value, Markets, Chart | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Explore what ${data.name} is. Get the ${data.symbol ? data.symbol.toUpperCase() : data.name} price today and convert it to your currencies; USDT, Dollars, CNY, JPY, HKD, AUD, NAIRA, EUR, GBP, THB, INR. See the BUY SELL indicator, chart history analysis, and news for FREE.`
      image = data.image && data.image.large ? data.image.large : image
    }
  }
  else if (pathSplit[0] === 'derivatives') {
    if (pathSplit[1] === 'futures') {
      title = `Today's Top Cryptocurrency Futures Contract by Open Interest | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Get the top cryptocurrency futures contract by open interest and trading volume. See their volume, changes percentage, prices history, and so on.`
    }
    else {
      title = `Today's Top Cryptocurrency Derivatives by Open Interest | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `Get the top cryptocurrency derivatives perpetual contract by open interest and trading volume. See their volume, changes percentage, prices history, and so on.`
    }
  }
  else if (pathSplit[0] === 'exchanges') {
    if (pathSplit[1] === 'dex') {
      title = `Today's Top Decentralized Exchanges by Volume | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the top decentralized exchanges (DEX) ranking by volume. See their information including country, volume, market share, and so on.`
    }
    else if (pathSplit[1] === 'derivatives') {
      title = `Today's Top Cryptocurrency Derivatives Exchanges by Volume | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the top cryptocurrency derivatives exchanges ranking by open interest. See their information including country, volume, market share, and so on.`
    }
    else {
      title = `Today's Top Cryptocurrency Exchanges by Confidence | ${process.env.NEXT_PUBLIC_APP_NAME}`
      description = `See the top spot cryptocurrency exchanges ranking by confidence. See their information including country, volume, market share, and so on.`
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

  }
  else if (pathSplit[0] === 'public-companies') {
    if (pathSplit[1]) {

    }
    else {

    }
  }
  else if (pathSplit[0] === 'parachains') {

  }
  else if (pathSplit[0] === 'wallet') {
    if (pathSplit[1]) {

    }
    else {

    }
  }
  else if (pathSplit[0] === 'farm') {
    if (pathSplit[1]) {

    }
    else {

    }
  }
  else if (pathSplit[0] === 'feeds') {
    title = `Today's Latest Cryptocurrency Feeds | ${process.env.NEXT_PUBLIC_APP_NAME}`
    description = `Keep up with breaking news on cryptocurrencies that influence the market.`
  }
  else if (pathSplit[0] === 'widgets') {
    title = `Free Cryptocurrency Widgets | ${process.env.NEXT_PUBLIC_APP_NAME}`
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