import { useState } from 'react'
import { useAssetStore } from '../stores/assetStore'
import { useWalletView } from '../stores/walletStore'
import { useTransactionStore } from '../stores/transactionStore'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'

type ModalState = {
  walletId: number
}

export function WalletWidget() {
  const walletsView = useWalletView()
  const addTransaction = useTransactionStore((s) => s.add)
  const assets = useAssetStore((s) => s.assets)

  const [modal, setModal] = useState<ModalState | null>(null)
  const [assetCode, setAssetCode] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  const openModal = (walletId: number) => {
    setModal({ walletId })
    setAssetCode(assets[0]?.code ?? '')
    setAmount('')
    setDate(new Date().toISOString().slice(0, 10))
  }

  const handleCancel = () => setModal(null)

  const handleAdd = () => {
    if (!modal || !amount || !assetCode) return
    addTransaction({
      type: 'WALLET_TOP_UP',
      walletId: modal.walletId,
      assetCode,
      amount: parseFloat(amount),
      date: new Date(date),
    })
    setModal(null)
  }

  return (
    <>
      {walletsView.map((wallet) => (
        <Card key={wallet.id}>
          <CardHeader title={wallet.name} />
          <CardContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell align="right">USD</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {wallet.balances.map((balance) => (
                  <TableRow key={balance.code}>
                    <TableCell>{balance.code}</TableCell>
                    <TableCell align="right">
                      {balance.balance.toLocaleString('ru')}
                    </TableCell>
                    <TableCell align="right">
                      {balance.balanceUsd.toLocaleString('ru')} $
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => openModal(wallet.id)}>
              Top up
            </Button>
          </CardActions>
        </Card>
      ))}

      <Dialog open={modal !== null} onClose={handleCancel}>
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
          <Button onClick={handleCancel} size="small">
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
    </>
  )
}
