import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import Widget from '../widget'
import CopyClipboard from '../copy-clipboard'
import Image from '../image'
import { FiLoader } from 'react-icons/fi'
import Slider from 'react-slick'
import { Img } from 'react-image'
import { Player } from 'video-react'
import parse from 'html-react-parser'
import Linkify from 'react-linkify'
import { generateUrl, numberFormat, ellipseAddress } from '../../lib/utils'

const NFTWidget = ({ data = null, i }) => {
  const router = useRouter()
  const { query } = { ...router }
  const { chain_name, asset } = { ...query }

  const isSkeleton = data && data.skeleton

  const slickSettings = {
    centerMode: true,
    dots: true,
    arrows: false,
    infinite: true,
    speed: 1000,
    centerPadding: 0,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
  }

  return (
    <Widget className="p-0">
      {isSkeleton ?
        <div className="flex flex-col m-3">
          <div className="flex items-center">
            <div className="skeleton w-6 h-6 rounded-full mr-2" />
            <div className="skeleton w-28 h-4 rounded" />
            <div className="skeleton w-8 h-4 rounded ml-1.5" />
          </div>
          <div className="skeleton w-24 h-3 rounded ml-8" />
        </div>
        :
        <div className="m-3">
          <Link href={generateUrl(`/wallet/${chain_name}/${data.contract_address}`, asset ? { asset } : null)}>
            <a className="flex flex-col whitespace-pre-wrap text-blue-600 dark:text-blue-400 font-semibold">
              <div className="coin-column flex items-center space-x-2">
                <Image
                  src={data.logo_url}
                  useMocked={i}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="space-x-1">
                  <span>{data.contract_name}</span>
                  {data.contract_ticker_symbol && (<span className={`uppercase text-gray-400 font-normal ${data.contract_ticker_symbol.length > 6 ? 'break-all' : ''}`}>{data.contract_ticker_symbol}</span>)}
                </span>
              </div>
            </a>
          </Link>
          <div className="flex items-center text-gray-400 text-xs font-normal space-x-1 ml-8">
            <span>{ellipseAddress(data.contract_address, 6)}</span>
            <CopyClipboard text={data.contract_address} size={14} />
          </div>
        </div>
      }
      {isSkeleton ?
        <>
          <div className="skeleton w-full h-60" />
          <div className="mx-3">
            <div className="skeleton w-40 h-4 rounded my-4" />
            <div className="skeleton w-full h-3 rounded my-3" />
            <div className="skeleton w-full h-3 rounded my-3" />
            <div className="skeleton w-full h-3 rounded my-3" />
            <div className="skeleton w-full h-3 rounded my-3" />
            <div className="skeleton w-5/6 h-3 rounded my-3" />
            <div className="skeleton w-28 h-4 rounded my-4" />
          </div>
        </>
        :
        data.nft_data && data.nft_data.length > 0 ?
          <Slider {...slickSettings}>
            {data.nft_data.map((nft, i) => (
              <div key={i}>
                {nft.external_data && nft.external_data.animation_url ?
                  <Player
                    playsInline
                    poster={Array.isArray(nft.external_data.image) ? nft.external_data.image[0] : nft.external_data.image}
                    src={nft.external_data.animation_url}
                    className="w-full h-full mx-auto"
                    style={{ minHeight: '10rem', maxHeight: '30rem' }}
                  />
                  :
                  <a href={nft.external_data ? nft.external_data.image ? Array.isArray(nft.external_data.image) ? nft.external_data.image[0] : nft.external_data.image : nft.external_data.external_url ? nft.external_data.external_url : nft.token_url : nft.token_url} target="_blank" rel="noopener noreferrer" style={{ minHeight: '10rem' }}>
                    <Img
                      src={nft.external_data ? nft.external_data.image : null}
                      loader={<div className="flex items-center justify-center" style={{ minHeight: '15rem', maxHeight: '15rem' }}>
                        <FiLoader size={24} className="animate-spin" />
                      </div>}
                      unloader={nft.external_data && nft.external_data.image ?
                        <img
                          src={Array.isArray(nft.external_data.image) ? nft.external_data.image[0] : nft.external_data.image}
                          alt=""
                          className="w-full h-full mx-auto"
                        style={{ maxHeight: '30rem' }}
                        />
                        :
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-light text-center py-16">
                          Data not found
                        </div>
                      }
                      alt=""
                      className="w-full h-full mx-auto"
                      style={{ maxHeight: '30rem' }}
                    />
                  </a>
                }
                <div className={`space-y-1.5 mt-4 mb-${data.nft_data.length > 1 ? 0 : 4} mx-3`}>
                  <a href={nft.token_url} target="_blank" rel="noopener noreferrer">
                    {nft.external_data && nft.external_data.name ?
                      <span title={nft.external_data.name} className="text-blue-600 dark:text-blue-400 font-medium whitespace-pre-wrap overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' }}>
                        {nft.external_data.name}
                      </span>
                      :
                      '-'
                    }
                  </a>
                  {nft.external_data && nft.external_data.description && (
                    <span title={nft.external_data.description} className="text-gray-500 font-light whitespace-pre-wrap overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: '5', WebkitBoxOrient: 'vertical' }}>
                      <Linkify>{parse(nft.external_data.description)}</Linkify>
                    </span>
                  )}
                  <div className="text-gray-600 dark:text-gray-400 font-medium space-x-1">
                    <span>Token ID:</span>
                    <span title={nft.token_id}>
                      {nft.token_id ?
                        <>#{ellipseAddress(nft.token_id)}</>
                        :
                        '-'
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
          :
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-light text-center py-16">
            No data available
          </div>
      }
    </Widget>
  )
}

NFTWidget.propTypes = {
  data: PropTypes.any,
}

export default NFTWidget