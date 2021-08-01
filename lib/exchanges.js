const cex = ['aax','aax_futures','abcc','abit','acdx','acdx_futures','aex','allcoin','alpha_five','alterdice','altilly','altmarkets','aprobit','artisturba','atomars','b2bx','bakkt','bankera','basefex','bcex','beaxy','bgogo','bibo','bibox','bibox_futures','bidesk','bigone','bigone_futures','biki','biki_futures','bilaxy','binance','binance_futures','binance_jersey','binance_us','equos','bione','bit2c','bitalong','bitbank','bitbay','bitbns','bitbox','bitci','bitcoin_com','bit_com_futures','bitex','bitexbook','bitexlive','bitfex','bitfinex','bitfinex_futures','bitflyer','bitflyer_futures','bitforex','bitforex_futures','bitget','bitget_futures','bithash','bitholic','bithumb','bithumb_futures','bithumb_global','bitinfi','bitkonan','bitkub','bitmart','bitmax','bitmax_futures','bitmesh','bitmex','bitoffer','bitonbay','bitopro','bitpanda','bitrabbit','altcointrader','delta_spot','bitrue','bits_blockchain','bitsdaq','bitso','bitsonic','lcx','bitstamp','bitsten','bitstorage','bittrex','bitubu','bit_z','bitz_futures','bkex','bleutrade','blockchain_com','boa','braziliex','btc_alpha','btcbox','btcc','btc_exchange','btcmarkets','btcmex','btcnext','btcsquare','btc_trade_ua','btcturk','btse','btse_futures','buyucoin','bvnex','bw','flybit','bybit','c2cx','catex','cbx','ccex','cex','chainex','changelly','chiliz','coinzoom','citex','cme_futures','coinall','coinasset','coinbene','coinbig','coinbit','coincheck','coindcx','coindeal','coindirect','coineal','coin_egg','coinex','coinfalcon','coinfield','coinflex','coinflex_futures','coinfloor','coingi','coinhe','coinhub','coinjar','coinlim','coinlist','coinmargin','coin_metro','coinone','coinpark','coinplace','coinsbank','coinsbit','coinsuper','cointiger','cointiger_futures','coinxpro','coinzo','c_patex','cpdax','crex24','crxzone','cryptaldash','cryptex','cryptlocex','crypto_com','kickex','cryptology','crytrex','c_trade','currency','darb_finance','daybit','dcoin','decoin','delta_futures','deribit','dextrade','digifinex','dobitrade','dove_wallet','dragonex','dsx','duedex','ecxx','elitex','emirex','eterbase','etherflyer','etorox','exmarkets','exmo','exnce','exrates','exx','fatbtc','fex','financex','finexbox','floatsv','freiexchange','ftx','ftx_spot','ftx_us','gate','gate_futures','gbx','gdac','gdax','gemini','getbtc','gmo_japan','gmo_japan_futures','gobaba','goku','gopax','graviex','hanbitco','hbtc','hbtc_futures','hb_top','hitbtc','hoo','hopex','hotbit','hpx','hubi','huobi','huobi_dm','huobi_id','huobi_japan','huobi_korea','huobi_thailand','ice3x','idcm','incorex','independent_reserve','indodax','infinity_coin','instantbitex','iqfinex','itbit','jex','jex_futures','kkcoin','k_kex','korbit','kraken','kraken_futures','kucoin','kumex','kuna','lakebtc','latoken','lbank','liquid_derivatives','localtrade','lucent','lukki','luno','lykke','max_maicoin','mercado_bitcoin','mercatox','mercuriex','multi','mxc','mxc_futures','mycoinstory','namebase','nami_exchange','nanu_exchange','narkasa','negociecoins','neraex','nice_hash','nlexch','nominex','novadax','oceanex','okcoin','okex','okex_korea','okex_swap','omgfin','omnitrade','otcbtc','ovex','p2pb2b','paribu','paroexchange','paymium','phemex','phemex_futures','poloniex','poloniex_futures','prime_xbt','probit','qtrade','quoine','resfinex','rfinex','safe_trade','satoexchange','secondbtc','shortex','simex','sinegy','zbx','sistemkoin','six_x','south_xchange','stake_cube','stocks_exchange','stormgain','stormgain_futures','swiftex','tdax','therocktrading','thodex','tidebit','tidex','tokenize','tokenomy','tokens_net','toko_crypto','tokok','tokpie','topbtc','trade_ogre','txbit','unnamed','upbit','upbit_indonesia','vb','vcc','vebitcoin','velic','vindax','vinex','virgox','waves','wazirx','whale_ex','whitebit','xcoex','xfutures','xt','yobit','yunex','zaif','zb','zbg','zbg_futures','zebitex','zebpay','zg','zgtop','zipmex','biconomy','wootrade']

const dex = ['aave','allbit','anyswap','bakeryswap','balancer','balancer_v1','bamboo_relay','bancor','bepswap','binance_dex','binance_dex_mini','birake','bisq','bitcratic','blockonix','bscswap','burgerswap','compound_finance','cream_swap','cream_swap_v1','curve','wault_swap','cybex','ddex','dem_exchange','deversifi','dex_blue','dodo','dolomite','dydx','dydx_perpetual','defi_swap','zero_exchange','value_liquid_bsc','apeswap','comethswap','unicly','sushiswap_fantom','polyzap','ethex','everbloom','forkdelta','swop_fi','secretswap','pantherswap','zilswap','dydx_perpetual_l1','futureswap','honeyswap','spookyswap','idex','dodo_bsc','joyso','justswap','kyber_network','zkswap','leverj','linkswap','loopring','loopring_amm','luaswap','dmm','sushiswap_polygon','swapr','mdex_bsc','ubeswap','sushiswap_xdai','mcdex','mdex','mesa','mirror','mooniswap','nash','viperswap','neblidex','newdex','nexus_mutual','oasis_trade','one_inch','one_inch_liquidity_protocol','spiritswap','orderbook','pancakeswap','pangolin','paraswap','raydium','perpetual_protocol','polyient_dex','quickswap','julswap','radar_relay','sakeswap','sashimiswap','saturn_network','serum_dex','serumswap','stellar_term','streetswap','sushiswap','switcheo','synthetix','tokenlon','token_sets','tomodex','dfyn','levinswap_xdai','tron_trade','trx_market','uniswap','uniswap_v1','uniswap_v2','vitex','value_liquid','zero_ex','pancakeswap_others','kuswap','shibaswap','pancakeswap_new','osmosis','waultswap_polygon']

export const getExchangeType = id => cex.includes(id) ? 'centralized' : dex.includes(id) ? 'decentralized' : ''

const referrals = {
  ftx: { id: 'ftx_spot', code: '10237779', reward_commission_percent: 25, discount_commission_percent: 5, exchange_ids: ['ftx_spot', 'ftx'] },
  binance: { id: 'binance', code: 'U2QW5HSA', reward_commission_percent: 10, discount_commission_percent: 10, exchange_ids: ['binance', 'binance_futures'] },
  coinbase: { id: 'gdax', code: '9251' },
  kraken: { id: 'kraken', code: '10583' },
  bitfinex: { id: 'bitfinex', code: 'BG4ZysMMB' },
  gate: { id: 'gate', code: '3159833', reward_commission_percent: 20, discount_commission_percent: 20, exchange_ids: ['gate', 'gate_futures'] },
  gemini: { id: 'gemini', code: '' },
  crypto: { id: 'crypto_com', code: '' },
  huobi_global: { id: 'huobi', code: '8z6g8' },
  okex: { id: 'okex', code: '3781714' },
  kucoin: { id: 'kucoin', code: 'rJ31MYJ' },
  poloniex: { id: 'poloniex', code: 'LS632G9R', reward_commission_percent: 20, discount_commission_percent: 10, exchange_ids: ['poloniex'] },
  latoken: { id: 'latoken', code: 'cpy9ir968m' },
  bithumb_pro: { id: 'bithumb_global', code: '299eat', reward_commission_percent: 10, discount_commission_percent: 10, exchange_ids: ['bithumb_global'] },
  bitkub: { id: 'bitkub', code: '52244' },
  bkex: { id: 'bkex', code: 'FUWQBRWQ' },
  bitrue: { id: 'bitrue', code: 'UBBSmjbe' },
  bitmex: { id: 'bitmex', code: 'fdc3ji' },
  bybit: { id: 'bybit', code: '15895' },
  cex: { id: 'cex', code: 'up136014827' },
  changelly: { id: 'changelly', code: 'zlv6bmmuf7vv9rwe' },
  bitmart: { id: 'bitmart', code: 'Pp5xEb' },
  mxc: { id: 'mxc', code: '15fmF' },
  coinlist: { id: 'coinlist', code: 'FGKPXQ' },
  xcoins: { code: '1586' },
  paxful: { code: 'Z3k3RpbAqYb' },
  changenow: { code: 'b6b2d58cce293d' },
}

export const setAffiliateLinks = urls => {
  const isArray = Array.isArray(urls)

  urls = (typeof urls === 'string' ? [urls] : urls) || []

  urls = urls.map(url => {
    try {
      const u = new URL(url)
      const hostname = u.hostname

      if (hostname === 'www.binance.com' || hostname === 'www.binance.us') {
        url = `${u.protocol}//${hostname}${u.pathname}?ref=${referrals.binance.code}`
      }
      else if (hostname === 'www.coinbase.com') {
        url = `${u.protocol}//coinbase-consumer.sjv.io/c/2664740/552039/${referrals.coinbase.code}`
      }
      else if (hostname === 'r.kraken.com' || hostname === 'futures.kraken.com') {
        if (u.pathname.indexOf('/dashboard') < 0) {
          url = `${u.protocol}//r.kraken.com/c/2664740/741638/${referrals.kraken.code}`
        }
      }
      else if (hostname === 'www.bitfinex.com') {
        url = `${u.protocol}//${hostname}${u.pathname}?refcode=${referrals.bitfinex.code}`
      }
      else if (hostname === 'gate.io' || hostname === 'www.gate.io') {
        url = `${u.protocol}//${hostname}${u.pathname.indexOf('trade/') > -1 ? `${u.pathname}?ref=` : '/signup/'}${referrals.gate.code}`
      }
      else if (hostname === 'ftx.com' || hostname === 'ftx.us') {
        if (u.pathname.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}/#a=${referrals.ftx.code}`
        }
      }
      else if (hostname === 'crypto.com') {
        if (u.pathname.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}${u.pathname}/${referrals.crypto.code}`
        }
      }
      else if (hostname === 'gemini.sjv.io') {
        // url = `${u.protocol}//${hostname}/${referrals.gemini.code}`
        url = `${u.protocol}//www.gemini.com`
      }
      else if (hostname === 'www.huobi.com' || hostname === 'www.hbdm.com' || hostname === 'dm.huobi.com') {
        url = `${u.protocol}//www.huobi.com/en-us/topic/invited/?invite_code=${referrals.huobi_global.code}`
      }
      else if (hostname === 'www.okex.com') {
        if (u.pathname.indexOf('/market') < 0 && u.pathname.indexOf('/future') < 0 && u.pathname.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}/join/${referrals.okex.code}`
        }
        else if (u.pathname.indexOf('/market') > -1) {
          url = `${u.protocol}//${hostname}/spot/trade${u.search.replace('?product=', '/').replace('_', '-')}`
        }
      }
      else if (hostname === 'www.bitstamp.net') {
        // wait
      }
      else if (hostname === 'www.kucoin.com' || hostname === 'futures.kucoin.com') {
        if (u.pathname.indexOf('/trade') < 0 || hostname === 'futures.kucoin.com') {
          url = `${u.protocol}//www.kucoin.com/ucenter/signup?rcode=${referrals.kucoin.code}`
        }
      }
      else if (hostname === 'bittrex.com') {

      }
      else if (hostname === 'poloniex.com') {
        if (u.pathname.indexOf('/exchange') < 0 && u.pathname.indexOf('/futures') < 0) {
          url = `${u.protocol}//${hostname}/signup?c=${referrals.poloniex.code}`
        }
      }
      else if (hostname === 'latoken.com') {
        if (u.pathname.indexOf('/exchange') < 0) {
          url = `${u.protocol}//${hostname}/invite?r=${referrals.latoken.code}`
        }
      }
      else if (hostname === 'bithumb.pro') {
        url = `${u.protocol}//${hostname}/register;i=${referrals.bithumb_pro.code}`
      }
      else if (hostname === 'www.bitkub.com') {
        if (u.pathname.indexOf('/market') < 0) {
          url = `${u.protocol}//${hostname}/signup?ref=${referrals.bitkub.code}`
        }
      }
      else if (hostname === 'www.bitopro.com') {

      }
      else if (hostname === 'www.nicehash.com') {
        // wait
      }
      else if (hostname === 'www.bkex.com') {
        if (u.pathname.indexOf('/trade') < 0 && u.hash.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}/register/${referrals.bkex.code}`
        }
      }
      else if (hostname === 'www.xt.com') {

      }
      else if (hostname === 'whitebit.com') {

      }
      else if (hostname === 'www.bitrue.com') {
        if (u.pathname.indexOf('/trading') < 0 && u.pathname.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}/activity/task/task-landing?inviteCode=${referrals.bitrue.code}&cn=900000`
        }
        else if (u.pathname.indexOf('/trade') > -1) {
          url = `${u.protocol}//${hostname}${u.pathname}?inviteCode=${referrals.bitrue.code}`
        }
      }
      else if (hostname === 'www.hoo.com') {

      }
      else if (hostname === 'coinsbit.io') {

      }
      else if (hostname === 'www.coinbene.com') {

      }
      else if (hostname === 'bitflyer.com') {
        // wait
      }
      else if (hostname === 'www.bitmex.com') {
        if (u.pathname.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}/register/${referrals.bitmex.code}`
        }
      }
      else if (hostname === 'www.bybit.com') {
        if (u.pathname.indexOf('/exchange') > -1) {
          url = `${u.protocol}//${hostname}${u.pathname}?affiliate_id=${referrals.bybit.code}&language=en-US&group_id=0&group_type=1`
        }
        else {
          url = `${u.protocol}//partner.bybit.com/b/${referrals.bybit.code}`
        }
      }
      else if (hostname === 'cex.io') {
        url = `${u.protocol}//${hostname}/r/0/${referrals.cex.code}/0/`
      }
      else if (hostname === 'pro.changelly.com') {
        url = `${u.protocol}//changelly.com${u.search ? u.search.toLowerCase() : '?from=btc&to=usdt'}&amount=0.1&ref_id=${referrals.changelly.code}`
      }
      else if (hostname === 'etoro.com') {
        // wait
      }
      else if (hostname === 'exmo.com') {
        // wait
      }
      else if (hostname === 'www.bitmart.com') {
        url = `${u.protocol}//${hostname}${u.pathname}${u.search ? `${u.search}&` : '?'}r=${referrals.bitmart.code}`
      }
      else if (hostname === 'www.mxc.com') {
        if (u.pathname.indexOf('/trade') < 0) {
          url = `${u.protocol}//${hostname}/auth/signup?inviteCode=${referrals.mxc.code}`
        }
      }
      else if (hostname === 'pro.coinlist.co') {
        if (u.pathname.indexOf('/trader') < 0) {
          url = `${u.protocol}//coinlist.co/clt?referral_code=${referrals.coinlist.code}`
        }
      }
      // not on list
      else if (hostname === 'www.xcoins.com') {
        url = `${u.protocol}//${hostname}/2020/r.php?id=${referrals.xcoins.code}`
      }
      else if (hostname === 'paxful.com') {
        url = `${u.protocol}//${hostname}/?r=${referrals.paxful.code}`
      }
      else if (hostname === 'www.coinmama.com') {
        // wait
      }
      else if (hostname === 'changenow.io') {
        url = `${u.protocol}//${hostname}?link_id=${referrals.changenow.code}`
      }
    } catch (error) {}

    return url
  })

  return isArray ? urls : urls.join('')
}