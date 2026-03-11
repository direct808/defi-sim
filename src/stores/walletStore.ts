import type { Wallet } from '../entity.ts'
import { create } from 'zustand'
import { getWalletBalance } from './transactionStore.ts'
import { useAssetStore } from './assetStore.ts'

export const useWalletStore = create<{ wallets: Wallet[] }>((set) => ({
  wallets: [
    {
      id: 1,
      name: 'Base',
      assets: ['BTC', 'ETH'],
    },
  ],
  add: (wallet: Wallet) =>
    set((state) => ({ wallets: [...state.wallets, wallet] })),
}))

export const useWalletView = () => {
  return useWalletStore.getState().wallets.map((wallet) => {
    let totalUsd = 0
    return {
      id: wallet.id,
      name: wallet.name,

      balances: useAssetStore.getState().assets.map((asset) => {
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
}
