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
import { useWalletStore } from '../stores/walletStore'
import { useToolsStore } from '../stores/toolsStore'

interface Props {
  open: boolean
  onClose: () => void
}

export function CreateLandingToolDialog({ open, onClose }: Props) {
  const wallets = useWalletStore((s) => s.wallets)
  const addTool = useToolsStore((s) => s.addTool)
  const tools = useToolsStore((s) => s.tools)

  const [name, setName] = useState('')
  const [walletId, setWalletId] = useState<number | ''>('')

  const handleSave = () => {
    if (!name.trim() || walletId === '') return
    const nextId = tools.length > 0 ? Math.max(...tools.map((t) => t.id)) + 1 : 1
    addTool({ id: nextId, name: name.trim(), type: 'LANDING', walletId: walletId as number, assets: [] })
    handleClose()
  }

  const handleClose = () => {
    setName('')
    setWalletId('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Landing Tool</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          size="small"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mt: 1, mb: 2 }}
        />
        <FormControl size="small" fullWidth>
          <InputLabel>Wallet</InputLabel>
          <Select
            label="Wallet"
            value={walletId}
            onChange={(e) => setWalletId(e.target.value as number)}
          >
            {wallets.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleSave}
          disabled={!name.trim() || walletId === ''}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}