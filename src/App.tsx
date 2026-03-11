import './App.css'
import { getWalletBalance, useAssetStore, useWalletStore } from './stores.ts'

function App() {
  const { assets, updatePrice } = useAssetStore()

  const wallets = useWalletStore((sds) => sds.wallets)

  const walletsView = wallets.map((wallet) => {
    let totalUsd = 0
    return {
      id: wallet.id,
      name: wallet.name,

      balances: assets.map((asset) => {
        const balance = getWalletBalance(wallet.id, asset.code)
        const balanceUsd = balance * asset.price
        totalUsd += balanceUsd
        return {
          code: asset.code,
          balance: balance,
          balanceUsd: balanceUsd,
        }
      }),
      totalUsd,
    }
  })

  return (
    <>
      Assets
      <table>
        <thead>
          <tr>
            <th>code</th>
            <th>price</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr>
              <td>{asset.code}</td>
              <td>
                <input
                  type="text"
                  value={asset.price}
                  onChange={(event) =>
                    updatePrice(asset.code, +event.target.value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      Wallets
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>Assets</th>
          </tr>
        </thead>
        <tbody>
          {walletsView.map((wallet) => (
            <tr>
              <td>{wallet.id}</td>
              <td>{wallet.name}</td>
              <td>
                {wallet.balances.map((balance) => (
                  <div>
                    <span>{balance.code} </span>
                    <span>{balance.balance.toLocaleString('ru')} </span>
                    <span>{balance.balanceUsd.toLocaleString('ru')} $</span>
                  </div>
                ))}
                {wallet.totalUsd.toLocaleString('ru')} $
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App
