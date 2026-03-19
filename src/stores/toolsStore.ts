import type { Tool } from '../entity.ts'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  getLandingSupply,
  getLandingBorrow,
  useTransactionStore,
} from './transactionStore.ts'
import { useAssetStore } from './assetStore.ts'

export const useToolsStore = create<{
  tools: Tool[]
  removeTool: (id: number) => void
  addTool: (tool: Tool) => void
  addAssetToTool: (toolId: number, asset: Tool['assets'][number]) => void
}>()(
  persist(
    (set) => ({
      addTool: (tool) => set((s) => ({ tools: [...s.tools, tool] })),
      removeTool: (id) =>
        set((s) => ({ tools: s.tools.filter((t) => t.id !== id) })),
      addAssetToTool: (toolId, asset) =>
        set((s) => ({
          tools: s.tools.map((t) =>
            t.id === toolId ? { ...t, assets: [...t.assets, asset] } : t,
          ),
        })),
      tools: [
        {
          id: 1,
          name: 'Aave - Avalanche',
          type: 'LANDING',
          walletId: 1,
          assets: [
            { code: 'BTC', supplyApy: 0.02, borrowApy: 0.36, ltv: 75 },
            { code: 'USDC', supplyApy: 3.65, borrowApy: 5.2, ltv: 75 },
          ],
        },
        {
          id: 2,
          walletId: 2,
          name: 'Aave - Arbitrum',
          type: 'LANDING',
          assets: [
            { code: 'ETH', supplyApy: 1.85, borrowApy: 2.53, ltv: 85 },
            { code: 'USDC', supplyApy: 3.37, borrowApy: 4.96, ltv: 75 },
          ],
        },
      ],
    }),
    { name: 'tools' },
  ),
)

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
        supplyApy: toolAsset.supplyApy,
        borrowApy: toolAsset.borrowApy,
        ltv: toolAsset.ltv,
      }
    })

    const hf = totalBorrowUsd > 0 ? weightedCollateral / totalBorrowUsd : null

    return {
      id: tool.id,
      walletId: tool.walletId,
      name: tool.name,
      type: tool.type,
      balances,
      totalSupplyUsd,
      totalBorrowUsd,
      hf,
    }
  })
}
