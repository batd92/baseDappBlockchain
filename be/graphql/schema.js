async function s_getToken(address) {
    return `
    {
      token(id: "${address}") {
        id
        symbol
        name
        decimals
      }
    }
    `
}

// Get thông tin pair address của cặp token
async function s_getPair(token0_address, token1_address) {
  const query = 
  `
    {
      pairs(
        first: 1,
        skip: 0,
        where: {
          token0: "${token0_address}",
          token1: "${token1_address}"
        }
        ) {
          id
          token0 {
          id
          symbol
          name,
          decimals
        }
        token1 {
          id
          symbol
          name,
          decimals
        }
      }
    }
  `;
  return query;
}

// Get thông tin 500 pair address
async function s_getPairs(limit = 100) {
  return `
    {
        pairs(
          first: ${limit},
          skip: 0
        ) {
          id
          token0 {
            id
            symbol
            name,
            decimals
          }
          token1 {
            id
            symbol
            name,
            decimals
          }
        }
    }
  `
}

// Get thông tin by pair address
// Note: Bất ổn ở API này
async function s_getPairHourDatas(pair_address) {
  return `
  {
    pairHourDatas(
      first: 24,
      orderBy: hourStartUnix,
      orderDirection: desc,
      where: {
        pair: "${pair_address}",
      }
    ) {
      id
      hourStartUnix
      reserve0
      reserve1
      totalSupply
      reserveUSD
      hourlyVolumeToken0
      hourlyVolumeToken1
      hourlyVolumeUSD
    }
  }
  `;
}

// Get thông tin của token trong vòng 7 ngày
// Note: Bất ổn ở API này
async function s_getTokenDayData(token_address, number_day = 7) {
  return `
    {
      tokenDayDatas( first: ${number_day}, skip: 0,  
      where: {
        token: "${token_address}"
      }
      )
       { 
        id
        date
        dailyVolumeUSD
        priceUSD
        totalLiquidityUSD
        totalLiquidityBNB
        totalLiquidityToken
        dailyVolumeUSD
        dailyVolumeBNB
        dailyVolumeToken
      }
   }
  `
}

module.exports = {
    s_getPair,
    s_getPairs,
    s_getTokenDayData,
    s_getPairHourDatas,
    s_getToken
}