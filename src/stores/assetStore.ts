import type { Asset } from '../entity.ts'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAssetStore = create<{
  assets: Asset[]
  add: (asset: Asset) => void
  remove: (assetCode: string) => void
  updatePrice: (assetCode: string, price: number) => void
}>()(
  persist(
    (set) => ({
      assets: [
        {
          code: 'BTC',
          price: 69300,
        },
        {
          code: 'ETH',
          price: 2022,
        },
        {
          code: 'USDC',
          price: 1,
        },
      ],
      add: (asset: Asset) =>
        set((state) => ({ assets: [...state.assets, asset] })),

      remove: (assetCode: string) =>
        set((state) => ({ assets: state.assets.filter((a) => a.code !== assetCode) })),

      updatePrice: (assetCode: string, price: number) =>
        set((state) => {
          const asset = state.assets.find((asset) => asset.code === assetCode)
          if (!asset) {
            throw new Error('Asset not found')
          }
          asset.price = price
          return { assets: [...state.assets] }
        }),
    }),
    { name: 'assets' },
  ),
)
