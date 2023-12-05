async function s_pancakeFactory() {
    return `
    
    `
}

async function s_getToken() {
    return `
    
    `
}

async function s_getPair(token0, token1) {
    const query = `
    {
        pairs(
          first: 1,
          skip: 0,
          where: {
            token0: "${token0}",
            token1: "${token1}"
          }
        ) {
          id
          token0 {
            id
            symbol
            name
          }
          token1 {
            id
            symbol
            name
          }
        }
      }
  `;
    return query;
}

async function s_getPairs(limit = 500) {
    return `
    {
        pairs(
          first: ${limit},
          skip: 0,
          where: {}
        ) {
          id
          token0 {
            id
            symbol
            name
            totalSupply
          }
          token1 {
            id
            symbol
            name
            totalSupply
          }
        }
    }
    `
}

async function s_getPancakeDayData() {
    return `
    
    `
}

async function s_getPairDayData() {
    return `
    
    `
}

async function s_getPairDayDatas() {
    return `
    
    `
}

async function s_getTokenDayData() {
    return `
    
    `
}

async function s_getTokenDayDatas() {
    return `
    
    `
}

module.exports = {
    s_getPair,
    s_getPairs
}