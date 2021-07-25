const url = (url, params) => {
  if (url) {
    url = new URL(url)

    if (params) {
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    }
  }

  return url
}

export const getUrl = (base_url, path, params) => {
  params = { ...params, path }

  return url(base_url, params)
}

export const numberOptimizeDecimal = number => {
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

export const ellipseAddress = (address, width = 10) => {
  if (!address) {
    return ''
  }

  return `${address.slice(0, width)}...${address.slice(-width)}`
}

export const capitalize = s => typeof s !== 'string' ? '' : s.trim().replaceAll(' ', '_').replaceAll('-', '_').split('_').map(x => x.trim()).filter(x => x).map(x => `${x.substr(0, 1).toUpperCase()}${x.substr(1)}`).join(' ')

export const getName = (name, isCapitalize, data) => {
  const namesMap = {
    defi: 'DeFi',
    nfts: 'NFTs',
  }
  return namesMap[name] ? namesMap[name] : isCapitalize ? name && name.length <= 3 ? name.toUpperCase() : capitalize(name) : name
}