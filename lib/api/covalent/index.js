import { getRequestUrl, toArray } from '../../utils'

const api_name = 'covalent'

const request = async (path, params) => {
  const res = await fetch(getRequestUrl(process.env.NEXT_PUBLIC_REQUESTER_URL, path, { ...params, api_name }))
  return await res.json()
}

export const status = async params => {
  const path = '/chains/status/'
  return await request(path, params)
}

export const balances = async (chain_id, address, params) => {
  const path = `/${chain_id}/address/${address}/balances_v2/`

  const response = await request(path, params)

  if (response && response.data && response.data.items) {
    for (let i = 0; i < response.data.items.length; i++) {
      if (response.data.items[i].type === 'nft' && response.data.items[i].nft_data) {
        for (let j = 0; j < response.data.items[i].nft_data.length; j++) {
          response.data.items[i].nft_data[j] = await nft(response.data.items[i].nft_data[j])
        }
      }
    }
  }

  return response
}

export const pricing = async (chain_id, address, params) => {
  const path = `/pricing/historical_by_addresses_v2/${chain_id}/usd/${address}/`
  return await request(path, params)
}

export const nfts = async (chain_id, address, params) => {
  const path = `/${chain_id}/tokens/${address}/nft_token_ids/`

  const response = await request(path, params)

  if (response && response.data && response.data.items) {
    for (let i = 0; i < response.data.items.length; i++) {
      if (typeof response.data.items[i].token_id === 'string') {
        const nftResponse = await nftData(chain_id, address, response.data.items[i].token_id)

        if (nftResponse && nftResponse.data && nftResponse.data.items && nftResponse.data.items[0]) {
          response.data.items[i] = { ...response.data.items[i], ...nftResponse.data.items[0] }
        }

        if (response.data.items[i].nft_data) {
          for (let j = 0; j < response.data.items[i].nft_data.length; j++) {
            response.data.items[i].nft_data[j] = await nft(response.data.items[i].nft_data[j])
          }
        }
      }
    }
  }

  return response
}

export const nftData = async (chain_id, address, token_id, params) => {
  const path = `/${chain_id}/tokens/${address}/nft_metadata/${token_id}/`
  return await request(path, params)
}

const nft = async nftData => {
  const videoKeywords = ['video', 'mp4']

  const needToRequestData = nftData => !nftData.external_data || !nftData.external_data.image || (nftData.external_data.description && videoKeywords.findIndex(keyword => nftData.external_data.description.toLowerCase().includes(keyword)) > -1)

  if (needToRequestData(nftData) && ((nftData.external_data && nftData.external_data.external_url) || nftData.token_url)) {
    if (nftData.external_data && nftData.external_data.external_url) {
      try {
        const res = await fetch(nftData.external_data.external_url)
        const data = await res.json()

        if (data) {
          nftData.external_data = {
            ...nftData.external_data,
            ...data,
            image: data.image ?
              typeof data.image === 'object' ?
                data.description ?
                  data.description
                  :
                  nftData.external_data.image
                :
                data.image
              :
              nftData.external_data.image,
          }
        }
      } catch (error) {}
    }

    if (needToRequestData(nftData) && nftData.token_url) {
      try {
        const res = await fetch(nftData.token_url)
        const data = await res.json()

        if (data) {
          nftData.external_data = {
            ...nftData.external_data,
            ...data,
            image: data.image ?
              typeof data.image === 'object' ?
                data.description ?
                  data.description
                  :
                  nftData.external_data.image
                :
                data.image
              :
              nftData.external_data.image,
          }
        }
      } catch (error) {}
    }
  }

  if (nftData.external_data) {
    const siteUrl = 'https://cloudflare-ipfs.com/'

    if (nftData.external_data.image && nftData.external_data.image.startsWith(siteUrl)) {
      const paths = nftData.external_data.image.replace(siteUrl, '').split('/').filter(path => path)

      if (paths[paths.length - 1] && paths[paths.length - 1].startsWith('image.')) {
        nftData.external_data.image = [nftData.external_data.image, `${siteUrl}${paths.filter((path, i) => !(path.startsWith('image.') && i === paths.length - 1)).join('/')}`]
      }
    }

    const sitePatterns = ['ipfs://', 'https://ipfs.daonomic.com/']

    sitePatterns.forEach(sitePattern => {
      if (nftData.external_data.image) {
        nftData.external_data.image = toArray(nftData.external_data.image).map(image => image.startsWith(sitePattern) ? image.replace(sitePattern, siteUrl) : image)
      }

      if (nftData.external_data.animation_url && nftData.external_data.animation_url.startsWith(sitePattern)) {
        nftData.external_data.animation_url = nftData.external_data.animation_url.replace(sitePattern, siteUrl)
      }
    })

    toArray(nftData.external_data.image).forEach(image => {
      if (image.endsWith('.mp4') && !nftData.external_data.animation_url) {
        nftData.external_data.animation_url = image
      }
    })

    nftData.external_data.animation_url = nftData.external_data.animation_url ? nftData.external_data.animation_url.startsWith(siteUrl) && !nftData.external_data.animation_url.startsWith(`${siteUrl}ipfs/`) ? nftData.external_data.animation_url.replace(siteUrl, `${siteUrl}ipfs/`) : nftData.external_data.animation_url : undefined

    nftData.external_data.image = toArray(nftData.external_data.image).map(image => image.startsWith(siteUrl) && !image.startsWith(`${siteUrl}ipfs/`) ? image.replace(siteUrl, `${siteUrl}ipfs/`) : image)

    if (nftData.external_data.animation_url && Array.isArray(nftData.external_data.image)) {
      nftData.external_data.image = nftData.external_data.image[0]
    }
  }

  return nftData
}

export const dexStatus = async (chain_id, dex_name, params) => {
  const path = `/${chain_id}/xy=k/${dex_name}/health/`
  return await request(path, params)
}

export const dexEcosystem = async (chain_id, dex_name, params) => {
  const path = `/${chain_id}/xy=k/${dex_name}/ecosystem/`
  return await request(path, params)
}

export const dexPools = async (chain_id, dex_name, params) => {
  const path = `/${chain_id}/xy=k/${dex_name}/pools/`
  return await request(path, params)
}