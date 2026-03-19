import { useState } from 'react'
import { useAssetStore } from '../stores/assetStore'
import { useWalletStore } from '../stores/walletStore'
import { useTransactionStore } from '../stores/transactionStore'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'

type Props = {
  open: boolean
  landingId: number
  onClose: () => void
}

export function LandingSupplyDialog({ open, landingId, onClose }: Props) {
  const assets = useAssetStore((s) => s.assets)
  const wallets = useWalletStore((s) => s.wallets)
  const addTransaction = useTransactionStore((s) => s.add)

  const [assetCode, setAssetCode] = useState(() => assets[0]?.code ?? '')
  const [amount, setAmount] = useState('')
  const [walletId, setWalletId] = useState(() => wallets[0]?.id ?? 0)

  const handleClose = () => {
    setAmount('')
    onClose()
  }

  const handleAdd = () => {
    if (!amount || !assetCode || !walletId) return
    addTransaction({
      type: 'LANDING_SUPPLY',
      landingId,
      walletId,
      assetCode,
      amount: parseFloat(amount),
      date: new Date(),
    })
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Supply</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            select
            size="small"
            label="Asset"
            value={assetCode}
            onChange={(e) => setAssetCode(e.target.value)}
            fullWidth
          >
            {assets.map((asset) => (
              <MenuItem key={asset.code} value={asset.code}>
                {asset.code}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
          <TextField
            select
            size="small"
            label="Wallet"
            value={walletId}
            onChange={(e) => setWalletId(Number(e.target.value))}
            fullWidth
          >
            {wallets.map((wallet) => (
              <MenuItem key={wallet.id} value={wallet.id}>
                {wallet.name}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} size="small">
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleAdd}
          disabled={!amount || !assetCode || !walletId}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}