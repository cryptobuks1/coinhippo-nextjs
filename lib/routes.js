const routes = [
  { pathname: '/' },
  { pathname: '/feeds' },
  { pathname: '/coins' },
  { pathname: '/coins/high-volume' },
  { pathname: '/coins/categories' },
  { pathname: '/coins/[coin_type]' },
  { pathname: '/coin' },
  { pathname: '/coin/[coin_id]' },
  { pathname: '/watchlist' },
  { pathname: '/watchlist/[watchlist_id]' },
  { pathname: '/derivatives' },
  { pathname: '/derivatives/[derivative_type]' },
  { pathname: '/exchanges' },
  { pathname: '/exchanges/[exchange_type]' },
  { pathname: '/exchange' },
  { pathname: '/exchange/[exchange_id]' },
  { pathname: '/public-companies' },
  { pathname: '/public-companies/[coin_id]' },
  { pathname: '/parachains' },
  { pathname: '/parachains/[chain]' },
  { pathname: '/wallet' },
  { pathname: '/wallet/[chain_id]' },
  { pathname: '/wallet/[chain_id]/[address]' },
  { pathname: '/farm' },
  { pathname: '/farm/[dex_name]' },
  { pathname: '/widgets' },
  { pathname: '/blog' },
  { pathname: '/blog/[category_id]' },
  { pathname: '/blog/[category_id]/[post_id]' },
  { pathname: '/404' },
  { pathname: '/500' },
]

export const isMatchRoute = pathname => {
  return routes.findIndex((route, i) => {
    if (route.pathname === pathname) {
      return true
    }
    else if (route.pathname.split('/').filter(path => path).length === pathname.split('/').filter(path => path).length) {
      const routePathnameSplit = route.pathname.split('/').filter(path => path)
      const pathnameSplit = pathname.split('/').filter(path => path)

      return routePathnameSplit.findIndex((path, j) => !(path.startsWith('[') && path.endsWith(']')) && path !== pathnameSplit[j]) > -1 ? false : true
    }
    else {
      return false
    }
  }) > -1
}