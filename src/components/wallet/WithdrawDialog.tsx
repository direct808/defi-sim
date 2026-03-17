import { useState } from 'react'
import { useTransactionStore } from '../../stores'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'

export type WithdrawModalState = {
  walletId: number
  assetCode: string
  maxBalance: number
}

export function WithdrawDialog({
  state,
  onClose,
}: {
  state: WithdrawModalState | null
  onClose: () => void
}) {
  const addTransaction = useTransactionStore((s) => s.add)

  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  const handleClose = () => {
    setAmount('')
    setDate(new Date().toISOString().slice(0, 10))
    onClose()
  }

  const handleWithdraw = () => {
    if (!state || !amount) return
    addTransaction({
      type: 'WALLET_WITHDRAW',
      walletId: state.walletId,
      assetCode: state.assetCode,
      amount: parseFloat(amount),
      date: new Date(date),
    })
    handleClose()
  }

  const parsedAmount = parseFloat(amount)
  const overMax = !!amount && parsedAmount > (state?.maxBalance ?? 0)

  return (
    <Dialog open={state !== null} onClose={handleClose}>
      <DialogTitle>Withdraw — {state?.assetCode}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            size="small"
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            error={overMax}
            helperText={
              overMax ? `Max available: ${state?.maxBalance}` : undefined
            }
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
          onClick={handleWithdraw}
          disabled={!amount || parsedAmount <= 0 || overMax}
        >
          Withdraw
        </Button>
      </DialogActions>
    </Dialog>
  )
}
