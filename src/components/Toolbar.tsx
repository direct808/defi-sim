import { useState } from 'react'
import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Toolbar as MuiToolbar,
} from '@mui/material'
import { useWalletStore } from '../stores/walletStore'

export function Toolbar() {
  const { wallets, add } = useWalletStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    const nextId = wallets.length > 0 ? Math.max(...wallets.map((w) => w.id)) + 1 : 1
    add({ id: nextId, name: name.trim() })
    setOpen(false)
    setName('')
  }

  const handleCancel = () => {
    setOpen(false)
    setName('')
  }

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <MuiToolbar variant="dense">
          <Button size="small" variant="outlined" onClick={() => setOpen(true)}>
            Add Wallet
          </Button>
        </MuiToolbar>
      </AppBar>

      <Dialog open={open} onClose={handleCancel}>
        <DialogTitle>Add Wallet</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            size="small"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            fullWidth
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="small" variant="contained" onClick={handleAdd} disabled={!name.trim()}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}