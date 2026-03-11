import type { Asset, Transaction, Wallet } from './entity.ts'
import { create } from 'zustand'

export const useAssetStore = create<{
  assets: Asset[]
  add: (asset: Asset) => void
  updatePrice: (assetCode: string, price: number) => void
}>((set) => ({
  assets: [
    {
      code: 'BTC',
      price: 68800,
    },
    {
      code: 'ETH',
      price: 2025,
    },
  ],
  add: (asset: Asset) => set((state) => ({ assets: [...state.assets, asset] })),

  updatePrice: (assetCode: string, price: number) =>
    set((state) => {
      const asset = state.assets.find((asset) => asset.code === assetCode)
      if (!asset) {
        throw new Error('Asset not found')
      }
      asset.price = price
      return { assets: [...state.assets] }
    }),
}))

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

export const useTransactionStore = create<{ transactions: Transaction[] }>(
  (set) => ({
    transactions: [
      {
        type: 'WALLET_TOP_UP',
        walletId: 1,
        amount: 0.1952,
        assetCode: 'BTC',
        date: new Date(),
      },
      {
        type: 'WALLET_TOP_UP',
        walletId: 1,
        amount: 6.91,
        assetCode: 'ETH',
        date: new Date(),
      },
    ],
    add: (transaction: Transaction) =>
      set((state) => ({ transactions: [...state.transactions, transaction] })),
  }),
)

export const getWalletBalance = (id: number, asset: string) => {
  let balance = 0
  for (const trx of useTransactionStore.getState().transactions) {
    if (
      trx.assetCode === asset &&
      trx.walletId === id &&
      trx.type === 'WALLET_TOP_UP'
    ) {
      balance += trx.amount
    }
  }

  return balance
}

export const useToolsStore = create((set) => ({
  tools: [
    {
      id: 1,
      name: 'Aave - Avalanche',
      type: 'LANDING',
      assets: [
        {
          code: 'BTC',
          supplyApy: 0.02,
          borrowApy: 0.36,
          ltv: 70,
        },
        {
          code: 'USDC',
          supplyApy: 3.65,
          borrowApy: 5.2,
          ltv: 75,
        },
      ],
    },
    {
      id: 2,
      name: 'Aave - Arbitrum',
      type: 'LANDING',
      assets: [
        {
          code: 'ETH',
          supplyApy: 1.85,
          borrowApy: 2.53,
          ltv: 80,
        },
        {
          code: 'USDC',
          supplyApy: 3.37,
          borrowApy: 4.96,
          ltv: 75,
        },
      ],
    },
  ],
}))
