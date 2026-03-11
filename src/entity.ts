export type Wallet = {
  id: number
  name: string
  assets: string[]
}

export type Asset = {
  code: string
  price: number
}

interface ITransaction {
  date: Date
}

export interface WalletTopUpTransaction extends ITransaction {
  type: 'WALLET_TOP_UP'
  walletId: number
  assetCode: string
  amount: number
}

export type Transaction = WalletTopUpTransaction
