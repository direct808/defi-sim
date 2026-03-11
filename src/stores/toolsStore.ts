import type { Tool } from '../entity.ts'
import { create } from 'zustand'
import { getLandingBalance } from './transactionStore.ts'
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

export const useToolsView = () => {
  const assets = useAssetStore.getState().assets
  return useToolsStore.getState().tools.map((tool) => {
    let totalUsd = 0
    const balances = tool.assets.map((toolAsset) => {
      const asset = assets.find((a) => a.code === toolAsset.code)
      const balance = getLandingBalance(tool.id, toolAsset.code)
      const balanceUsd = balance * (asset?.price ?? 0)
      totalUsd += balanceUsd
      return {
        code: toolAsset.code,
        balance,
        balanceUsd,
      }
    })
    return {
      id: tool.id,
      name: tool.name,
      balances,
      totalUsd,
    }
  })
}