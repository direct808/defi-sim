import type { Tool } from '../entity.ts'
import { create } from 'zustand'
import {
  getLandingSupply,
  getLandingBorrow,
  useTransactionStore,
} from './transactionStore.ts'
import { useAssetStore } from './assetStore.ts'

export const useToolsStore = create<{ tools: Tool[] }>(() => ({
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
          ltv: 75,
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
          ltv: 85,
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

export const useToolsView = () => {
  const assets = useAssetStore((s) => s.assets)
  const tools = useToolsStore((s) => s.tools)
  useTransactionStore((s) => s.transactions) // подписка для реактивности

  return tools.map((tool) => {
    let totalSupplyUsd = 0
    let totalBorrowUsd = 0
    let weightedCollateral = 0

    const balances = tool.assets.map((toolAsset) => {
      const asset = assets.find((a) => a.code === toolAsset.code)
      const price = asset?.price ?? 0

      const supply = getLandingSupply(tool.id, toolAsset.code)
      const borrow = getLandingBorrow(tool.id, toolAsset.code)
      const supplyUsd = supply * price
      const borrowUsd = borrow * price

      totalSupplyUsd += supplyUsd
      totalBorrowUsd += borrowUsd
      weightedCollateral += supplyUsd * (toolAsset.ltv / 100)

      return {
        code: toolAsset.code,
        supply,
        supplyUsd,
        borrow,
        borrowUsd,
      }
    })

    const hf = totalBorrowUsd > 0 ? weightedCollateral / totalBorrowUsd : null

    return {
      id: tool.id,
      name: tool.name,
      balances,
      totalSupplyUsd,
      totalBorrowUsd,
      hf,
    }
  })
}
