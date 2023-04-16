const getBTCBalance = (address: string, isMainnet: boolean) => {
  const network = isMainnet ? "main" : "test3"
  const url = `https://api.blockcypher.com/v1/btc/${network}/addrs/${address}`
  
  return fetch(url)
    .then(async res => {
      if (res.ok) {
        const data = await res.json()
        let balance = data.balance
        balance = Math.trunc(balance / 1000) / 100000
        return balance
      }
    })
    .catch(err => {
      console.log(err)
      return 0
    })
}

export default getBTCBalance