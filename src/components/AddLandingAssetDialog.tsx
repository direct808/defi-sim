import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { useAssetStore } from '../stores/assetStore'
import { useToolsStore } from '../stores/toolsStore'

interface Props {
  open: boolean
  toolId: number
  onClose: () => void
}

export function AddLandingAssetDialog({ open, toolId, onClose }: Props) {
  const assets = useAssetStore((s) => s.assets)
  const addAssetToTool = useToolsStore((s) => s.addAssetToTool)

  const [code, setCode] = useState<string>('')
  const [supplyApy, setSupplyApy] = useState('')
  const [borrowApy, setBorrowApy] = useState('')
  const [ltv, setLtv] = useState('')

  const handleAdd = () => {
    if (!code || supplyApy === '' || borrowApy === '' || ltv === '') return
    addAssetToTool(toolId, {
      code,
      supplyApy: Number(supplyApy),
      borrowApy: Number(borrowApy),
      ltv: Number(ltv),
    })
    handleClose()
  }

  const handleClose = () => {
    setCode('')
    setSupplyApy('')
    setBorrowApy('')
    setLtv('')
    onClose()
  }

  const isValid =
    code !== '' &&
    supplyApy !== '' &&
    borrowApy !== '' &&
    ltv !== '' &&
    Number(supplyApy) >= 0 &&
    Number(supplyApy) <= 100 &&
    Number(borrowApy) >= 0 &&
    Number(borrowApy) <= 100 &&
    Number(ltv) >= 0 &&
    Number(ltv) <= 100

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Asset</DialogTitle>
      <DialogContent>
        <FormControl size="small" fullWidth sx={{ mt: 1, mb: 2 }}>
          <InputLabel>Asset</InputLabel>
          <Select label="Asset" value={code} onChange={(e) => setCode(e.target.value)}>
            {assets.map((a) => (
              <MenuItem key={a.code} value={a.code}>
                {a.code}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="Supply APY (%)"
          type="number"
          value={supplyApy}
          onChange={(e) => setSupplyApy(e.target.value)}
          inputProps={{ min: 0, max: 100, step: 0.01 }}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          size="small"
          label="Borrow APY (%)"
          type="number"
          value={borrowApy}
          onChange={(e) => setBorrowApy(e.target.value)}
          inputProps={{ min: 0, max: 100, step: 0.01 }}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          size="small"
          label="LTV (%)"
          type="number"
          value={ltv}
          onChange={(e) => setLtv(e.target.value)}
          inputProps={{ min: 0, max: 100, step: 1 }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={handleClose}>
          Cancel
        </Button>
        <Button size="small" variant="contained" onClick={handleAdd} disabled={!isValid}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}