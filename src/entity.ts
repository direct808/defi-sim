export type Wallet = {
  id: number
  name: string
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

export interface LandingSupplyTransaction extends ITransaction {
  type: 'LANDING_SUPPLY'
  walletId: number
  assetCode: string
  landingId: number
  amount: number
}

export interface WalletWithdrawTransaction extends ITransaction {
  type: 'WALLET_WITHDRAW'
  walletId: number
  assetCode: string
  amount: number
}

export interface LandingBorrowTransaction extends ITransaction {
  type: 'LANDING_BORROW'
  walletId: number
  assetCode: string
  landingId: number
  amount: number
}

export type Transaction =
  | WalletTopUpTransaction
  | WalletWithdrawTransaction
  | LandingSupplyTransaction
  | LandingBorrowTransaction

export type ToolAsset = {
  code: string
  supplyApy: number
  borrowApy: number
  ltv: number
}

export type Tool = {
  id: number
  name: string
  type: 'LANDING'
  assets: ToolAsset[]
}
