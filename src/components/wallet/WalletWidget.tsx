import { useState } from 'react'
import { useWalletView, useWalletStore } from '../../stores/walletStore'
import { ConfirmDialog } from '../ConfirmDialog'
import { WalletCard } from './WalletCard'
import { TopUpDialog } from './TopUpDialog'
import { WithdrawDialog } from './WithdrawDialog'
import type { WithdrawModalState } from './WithdrawDialog'

type DeleteModalState = {
  walletId: number
  walletName: string
}

export function WalletWidget() {
  const walletsView = useWalletView()
  const removeWallet = useWalletStore((s) => s.remove)

  const [topUpWalletId, setTopUpWalletId] = useState<number | null>(null)
  const [withdrawModal, setWithdrawModal] = useState<WithdrawModalState | null>(null)
  const [deleteModal, setDeleteModal] = useState<DeleteModalState | null>(null)

  return (
    <>
      {walletsView.map((wallet) => (
        <WalletCard
          key={wallet.id}
          wallet={wallet}
          onTopUp={setTopUpWalletId}
          onWithdraw={(walletId, assetCode, maxBalance) =>
            setWithdrawModal({ walletId, assetCode, maxBalance })
          }
          onDelete={(walletId, walletName) => setDeleteModal({ walletId, walletName })}
        />
      ))}

      <TopUpDialog walletId={topUpWalletId} onClose={() => setTopUpWalletId(null)} />

      <WithdrawDialog state={withdrawModal} onClose={() => setWithdrawModal(null)} />

      <ConfirmDialog
        open={deleteModal !== null}
        title="Delete wallet"
        message={`Are you sure you want to delete "${deleteModal?.walletName}"?`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteModal) removeWallet(deleteModal.walletId)
          setDeleteModal(null)
        }}
        onClose={() => setDeleteModal(null)}
      />
    </>
  )
}