import type { Transaction } from '../entity.ts'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTransactionStore = create<{
  transactions: Transaction[]
  add: (transaction: Transaction) => void
  remove: (index: number) => void
}>()(
  persist(
    (set) => ({
      transactions: [
        {
          type: 'WALLET_TOP_UP',
          walletId: 1,
          amount: 0.195,
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
        {
          type: 'LANDING_SUPPLY',
          walletId: 1,
          amount: 6.91,
          landingId: 2,
          assetCode: 'ETH',
          date: new Date(),
        },
        {
          type: 'LANDING_SUPPLY',
          walletId: 1,
          amount: 0.195,
          landingId: 1,
          assetCode: 'BTC',
          date: new Date(),
        },
        {
          type: 'LANDING_BORROW',
          walletId: 1,
          amount: 1483.88,
          landingId: 1,
          assetCode: 'USDC',
          date: new Date(),
        },
        {
          type: 'LANDING_BORROW',
          walletId: 1,
          amount: 4396.29,
          landingId: 2,
          assetCode: 'USDC',
          date: new Date(),
        },
      ],
      add: (transaction: Transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),
      remove: (index: number) =>
        set((state) => ({
          transactions: state.transactions.filter((_, i) => i !== index),
        })),
    }),
    {
      name: 'transactions',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.transactions = state.transactions.map((t) => ({
            ...t,
            date: new Date(t.date),
          }))
        }
      },
    },
  ),
)

export const getLandingSupply = (landingId: number, assetCode: string) => {
  let balance = 0
  for (const trx of useTransactionStore.getState().transactions) {
    if (
      trx.type === 'LANDING_SUPPLY' &&
      trx.landingId === landingId &&
      trx.assetCode === assetCode
    ) {
      balance += trx.amount
    }
  }
  return balance
}

export const getLandingBorrow = (landingId: number, assetCode: string) => {
  let balance = 0
  for (const trx of useTransactionStore.getState().transactions) {
    if (
      trx.type === 'LANDING_BORROW' &&
      trx.landingId === landingId &&
      trx.assetCode === assetCode
    ) {
      balance += trx.amount
    }
  }
  return balance
}

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
    if (
      trx.assetCode === asset &&
      trx.walletId === id &&
      trx.type === 'LANDING_SUPPLY'
    ) {
      balance -= trx.amount
    }
    if (
      trx.assetCode === asset &&
      trx.walletId === id &&
      trx.type === 'LANDING_BORROW'
    ) {
      balance += trx.amount
    }
  }

  return balance
}
