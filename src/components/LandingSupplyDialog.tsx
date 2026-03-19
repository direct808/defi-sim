import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTransactionStore, useToolsStore } from '../stores'
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

const schema = z.object({
  assetCode: z.string().min(1, 'Select an asset'),
  amount: z.number().positive('Must be > 0'),
  date: z.string().min(1, 'Select a date'),
})

type FormValues = z.infer<typeof schema>

type Props = {
  open: boolean
  landingId: number
  walletId: number
  onClose: () => void
}

export function LandingSupplyDialog({ open, landingId, walletId, onClose }: Props) {
  const toolAssets = useToolsStore((s) => s.tools.find((t) => t.id === landingId)?.assets ?? [])
  const addTransaction = useTransactionStore((s) => s.add)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      assetCode: toolAssets[0]?.code ?? '',
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        assetCode: toolAssets[0]?.code ?? '',
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
      })
    }
  }, [open, reset, toolAssets])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: FormValues) => {
    addTransaction({
      type: 'LANDING_SUPPLY',
      landingId,
      walletId,
      assetCode: data.assetCode,
      amount: data.amount,
      date: new Date(data.date),
    })
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Supply</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Controller
              name="assetCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  size="small"
                  label="Asset"
                  fullWidth
                  error={!!errors.assetCode}
                  helperText={errors.assetCode?.message}
                >
                  {toolAssets.map((asset) => (
                    <MenuItem key={asset.code} value={asset.code}>
                      {asset.code}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
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
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}