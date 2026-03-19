import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

type FormValues = {
  amount: number
  date: string
}

export function WithdrawDialog({
  state,
  onClose,
}: {
  state: WithdrawModalState | null
  onClose: () => void
}) {
  const addTransaction = useTransactionStore((s) => s.add)

  const schema = useMemo(
    () =>
      z.object({
        amount: z
          .number()
          .positive('Must be > 0')
          .max(state?.maxBalance ?? Number.MAX_VALUE, `Max available: ${state?.maxBalance}`),
        date: z.string().min(1, 'Select a date'),
      }),
    [state?.maxBalance],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
    },
  })

  useEffect(() => {
    if (state !== null) {
      reset({ amount: 0, date: new Date().toISOString().slice(0, 10) })
    }
  }, [state, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: FormValues) => {
    addTransaction({
      type: 'WALLET_WITHDRAW',
      walletId: state!.walletId,
      assetCode: state!.assetCode,
      amount: data.amount,
      date: new Date(data.date),
    })
    handleClose()
  }

  return (
    <Dialog open={state !== null} onClose={handleClose}>
      <DialogTitle>Withdraw — {state?.assetCode}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              size="small"
              label="Amount"
              type="number"
              fullWidth
              error={!!errors.amount}
              helperText={errors.amount?.message}
              {...register('amount', { valueAsNumber: true })}
            />
            <TextField
              size="small"
              label="Date"
              type="date"
              fullWidth
              error={!!errors.date}
              helperText={errors.date?.message}
              {...register('date')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} size="small">
            Cancel
          </Button>
          <Button size="small" variant="contained" type="submit">
            Withdraw
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}