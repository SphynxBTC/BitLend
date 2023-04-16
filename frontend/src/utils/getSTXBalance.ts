const getSTXBalance = (address: string, isMainnet: boolean) => {
  const network = isMainnet ? "mainnet" : "testnet"
  const url = `https://stacks-node-api.${network}.stacks.co/v2/accounts/${address}`
  
  return fetch(url)
    .then(async res => {
      if (res.ok) {
        const data = await res.json()
        let balance = parseInt(data.balance, 16)
        balance = Math.trunc(balance / 10000) / 100
        return balance
      }
    })
    .catch(err => {
      console.log(err)
      return 0
    })
}

export default getSTXBalance