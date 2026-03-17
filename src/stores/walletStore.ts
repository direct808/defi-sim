import type { Wallet } from '../entity.ts'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useTransactionStore, getWalletBalance } from './transactionStore.ts'
import { useAssetStore } from './assetStore.ts'

export const useWalletStore = create<{ wallets: Wallet[]; add: (wallet: Wallet) => void }>()(
  persist(
    (set) => ({
      wallets: [
        {
          id: 1,
          name: 'Base',
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

  const transactions = useTransactionStore.getState().transactions
  return wallets.map((wallet) => {
    const assetCodesWithTxs = new Set(
      transactions
        .filter((t) => t.walletId === wallet.id)
        .map((t) => t.assetCode),
    )
    let totalUsd = 0
    const balances = assets
      .filter((asset) => assetCodesWithTxs.has(asset.code))
      .map((asset) => {
        const balance = getWalletBalance(wallet.id, asset.code)
        const balanceUsd = balance * asset.price
        totalUsd += balanceUsd
        return {
          code: asset.code,
          balance: balance,
          balanceUsd: balanceUsd,
        }
      })
    return {
      id: wallet.id,
      name: wallet.name,
      balances,
      totalUsd,
    }
  })
}
