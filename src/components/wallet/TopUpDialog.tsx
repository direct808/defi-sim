import { useState } from 'react'
import { useAssetStore } from '../../stores/assetStore'
import { useTransactionStore } from '../../stores/transactionStore'
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

export function TopUpDialog({
  walletId,
  onClose,
}: {
  walletId: number | null
  onClose: () => void
}) {
  const assets = useAssetStore((s) => s.assets)
  const addTransaction = useTransactionStore((s) => s.add)

  const [assetCode, setAssetCode] = useState(() => assets[0]?.code ?? '')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  const handleClose = () => {
    setAmount('')
    setDate(new Date().toISOString().slice(0, 10))
    onClose()
  }

  const handleAdd = () => {
    if (!walletId || !amount || !assetCode) return
    addTransaction({
      type: 'WALLET_TOP_UP',
      walletId,
      assetCode,
      amount: parseFloat(amount),
      date: new Date(date),
    })
    handleClose()
  }

  return (
    <Dialog open={walletId !== null} onClose={handleClose}>
      <DialogTitle>Top up</DialogTitle>
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
            size="small"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
          />
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
          disabled={!amount || !assetCode}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}