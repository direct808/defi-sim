import './App.css'
import { useAssetStore } from './stores'
import { useWalletView } from './stores/walletStore.ts'
import { useToolsView } from './stores/toolsStore.ts'

function App() {
  const { assets, updatePrice } = useAssetStore()

  const walletsView = useWalletView()
  const toolsView = useToolsView()

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
      Tools
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>Assets</th>
            <th>HF</th>
          </tr>
        </thead>
        <tbody>
          {toolsView.map((tool) => (
            <tr>
              <td>{tool.id}</td>
              <td>{tool.name}</td>
              <td>
                {tool.balances.map((balance) => (
                  <div>
                    <span>{balance.code} </span>
                    <span>supply: {balance.supply.toLocaleString('ru')} ({balance.supplyUsd.toLocaleString('ru')} $) </span>
                    <span>borrow: {balance.borrow.toLocaleString('ru')} ({balance.borrowUsd.toLocaleString('ru')} $)</span>
                  </div>
                ))}
              </td>
              <td>{tool.hf !== null ? tool.hf.toFixed(2) : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App
