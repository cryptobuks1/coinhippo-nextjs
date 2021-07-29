import numeral from 'numeral'

const url = (url, params) => {
  if (url) {
    url = new URL(url)

    if (params) {
      Object.keys(params).filter(key => typeof params[key] !== 'undefined').forEach(key => url.searchParams.append(key, params[key]))
    }
  }

  return url
}

export const getUrl = (base_url, path, params) => {
  params = { ...params, path }

  return url(base_url, params)
}

const numberOptimizeDecimal = number => {
  if (typeof number === 'number') {
    number = number.toString()
  }

  if (number === 'NaN') {
    return '<0.00000001'
  }

  if (typeof number === 'string') {
    if (number.indexOf('.') > -1) {
      let decimal = number.substring(number.indexOf('.') + 1)

      while (decimal.endsWith('0')) {
        decimal = decimal.substring(0, decimal.length - 1)
      }

      if (number.substring(0, number.indexOf('.')).length >= 7 && decimal.length > 2 && !isNaN(`0.${decimal}`)) {
        decimal = Number(`0.${decimal}`).toFixed(2).toString()
        if (decimal.indexOf('.') > -1) {
          decimal = decimal.substring(decimal.indexOf('.') + 1)
          while (decimal.endsWith('0')) {
            decimal = decimal.substring(0, decimal.length - 1)
          }
        }
      }

      return `${number.substring(0, number.indexOf('.'))}${decimal ? '.' : ''}${decimal}`
    }

    return number
  }

  return ''
}

export const numberFormat = (number, format) => numberOptimizeDecimal(numeral(number).format(format.includes('.000') && Number(number) >= 1.01 ? `${format.substring(0, format.indexOf('.') + 3)}` : format))

const capitalize = s => typeof s !== 'string' ? '' : s.trim().split(' ').join('_').split('-').join('_').split('_').map(x => x.trim()).filter(x => x).map(x => `${x.substr(0, 1).toUpperCase()}${x.substr(1)}`).join(' ')

export const getName = (s, data) => {
  const names = {
    defi: 'DeFi',
    nfts: 'NFTs',
    fear_and_greed: 'Fear & Greed',
  }
  return names[s] ? names[s] : data && data.name && data.id === s ? data.name : s && s.length <= 3 ? s.toUpperCase() : capitalize(s)
}

export const ellipseAddress = (address, width = 10) => !address ? '' : `${address.slice(0, width)}...${address.slice(-width)}`

export const weightedRand = values => {
  values = Array.isArray(values) ? values : typeof values === 'object' ? values : [values]
  const valuesWeight = Array.isArray(values) ? { ...(values.map(value => 1 / values.length)) } : values

  let i, sum = 0, rand = Math.random()
  for (i in valuesWeight) {
    sum += valuesWeight[i]
    if (rand <= sum) return Array.isArray(values) ? values[i] : i
  }
}