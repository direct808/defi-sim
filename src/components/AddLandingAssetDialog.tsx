import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useAssetStore, useToolsStore } from '../stores'

const schema = z.object({
  code: z.string().min(1, 'Select an asset'),
  supplyApy: z.number().min(0, 'Min 0').max(100, 'Max 100'),
  borrowApy: z.number().min(0, 'Min 0').max(100, 'Max 100'),
  ltv: z.number().min(0, 'Min 0').max(100, 'Max 100'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  toolId: number
  onClose: () => void
}

export function AddLandingAssetDialog({ open, toolId, onClose }: Props) {
  const assets = useAssetStore((s) => s.assets)
  const toolAssets = useToolsStore((s) => s.tools.find((t) => t.id === toolId)?.assets ?? [])
  const addAssetToTool = useToolsStore((s) => s.addAssetToTool)

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: '', supplyApy: 0, borrowApy: 0, ltv: 0 },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = (data: FormValues) => {
    if (toolAssets.some((a) => a.code === data.code)) {
      setError('code', { message: 'Asset already added' })
      return
    }
    addAssetToTool(toolId, data)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Asset</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <FormControl size="small" fullWidth sx={{ mt: 1, mb: 2 }} error={!!errors.code}>
                <InputLabel>Asset</InputLabel>
                <Select label="Asset" {...field}>
                  {assets.map((a) => (
                    <MenuItem key={a.code} value={a.code}>
                      {a.code}
                    </MenuItem>
                  ))}
                </Select>
                {errors.code && <FormHelperText>{errors.code.message}</FormHelperText>}
              </FormControl>
            )}
          />
          <TextField
            size="small"
            label="Supply APY (%)"
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            slotProps={{ htmlInput: { min: 0, max: 100, step: 0.01 } }}
            error={!!errors.supplyApy}
            helperText={errors.supplyApy?.message}
            {...register('supplyApy', { valueAsNumber: true })}
          />
          <TextField
            size="small"
            label="Borrow APY (%)"
            type="number"
            fullWidth
            sx={{ mb: 2 }}
            slotProps={{ htmlInput: { min: 0, max: 100, step: 0.01 } }}
            error={!!errors.borrowApy}
            helperText={errors.borrowApy?.message}
            {...register('borrowApy', { valueAsNumber: true })}
          />
          <TextField
            size="small"
            label="LTV (%)"
            type="number"
            fullWidth
            slotProps={{ htmlInput: { min: 0, max: 100, step: 1 } }}
            error={!!errors.ltv}
            helperText={errors.ltv?.message}
            {...register('ltv', { valueAsNumber: true })}
          />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleClose}>
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