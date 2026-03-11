import type { Wallet } from '../entity.ts'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useTransactionStore, getWalletBalance } from './transactionStore.ts'
import { useAssetStore } from './assetStore.ts'

export const useWalletStore = create<{ wallets: Wallet[] }>()(
  persist(
    (set) => ({
      wallets: [
        {
          id: 1,
          name: 'Base',
          assets: ['BTC', 'ETH'],
        },
      ],
      add: (wallet: Wallet) =>
        set((state) => ({ wallets: [...state.wallets, wallet] })),
    }),
    { name: 'wallets' },
  ),
)

export const useWalletView = () => {
  const wallets = useWalletStore((s) => s.wallets)
  const assets = useAssetStore((s) => s.assets)
  useTransactionStore((s) => s.transactions) // подписка для реактивности

  return wallets.map((wallet) => {
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
}
