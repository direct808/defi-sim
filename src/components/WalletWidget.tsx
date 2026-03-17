import { useState } from 'react'
import { useAssetStore } from '../stores/assetStore'
import { useWalletView, useWalletStore } from '../stores/walletStore'
import { useTransactionStore } from '../stores/transactionStore'
import DeleteIcon from '@mui/icons-material/Delete'
import CallReceivedIcon from '@mui/icons-material/CallReceived'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
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

type WithdrawModalState = {
  walletId: number
  assetCode: string
}

type DeleteModalState = {
  walletId: number
  walletName: string
}

export function WalletWidget() {
  const walletsView = useWalletView()
  const addTransaction = useTransactionStore((s) => s.add)
  const assets = useAssetStore((s) => s.assets)
  const removeWallet = useWalletStore((s) => s.remove)

  const [modal, setModal] = useState<ModalState | null>(null)
  const [assetCode, setAssetCode] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  const [withdrawModal, setWithdrawModal] = useState<WithdrawModalState | null>(null)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawDate, setWithdrawDate] = useState(() => new Date().toISOString().slice(0, 10))

  const [deleteModal, setDeleteModal] = useState<DeleteModalState | null>(null)

  const openModal = (walletId: number) => {
    setModal({ walletId })
    setAssetCode(assets[0]?.code ?? '')
    setAmount('')
    setDate(new Date().toISOString().slice(0, 10))
  }

  const openWithdrawModal = (walletId: number, assetCode: string) => {
    setWithdrawModal({ walletId, assetCode })
    setWithdrawAmount('')
    setWithdrawDate(new Date().toISOString().slice(0, 10))
  }

  const handleCancel = () => setModal(null)

  const handleWithdrawCancel = () => setWithdrawModal(null)

  const handleDeleteConfirm = () => {
    if (!deleteModal) return
    removeWallet(deleteModal.walletId)
    setDeleteModal(null)
  }

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

  const handleWithdraw = () => {
    if (!withdrawModal || !withdrawAmount) return
    addTransaction({
      type: 'WALLET_WITHDRAW',
      walletId: withdrawModal.walletId,
      assetCode: withdrawModal.assetCode,
      amount: parseFloat(withdrawAmount),
      date: new Date(withdrawDate),
    })
    setWithdrawModal(null)
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
                  <TableCell />
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
                    <TableCell align="right" sx={{ py: 0 }}>
                      <IconButton
                        size="small"
                        onClick={() => openWithdrawModal(wallet.id, balance.code)}
                      >
                        <CallReceivedIcon fontSize="small" />
                      </IconButton>
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
            <IconButton
              size="small"
              color="error"
              onClick={() =>
                setDeleteModal({ walletId: wallet.id, walletName: wallet.name })
              }
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </CardActions>
        </Card>
      ))}

      <Dialog open={deleteModal !== null} onClose={() => setDeleteModal(null)}>
        <DialogTitle>Delete wallet</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete &quot;{deleteModal?.walletName}
            &quot;?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setDeleteModal(null)}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={withdrawModal !== null} onClose={handleWithdrawCancel}>
        <DialogTitle>Withdraw — {withdrawModal?.assetCode}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              size="small"
              label="Amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              fullWidth
            />
            <TextField
              size="small"
              label="Date"
              type="date"
              value={withdrawDate}
              onChange={(e) => setWithdrawDate(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWithdrawCancel} size="small">
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleWithdraw}
            disabled={!withdrawAmount}
          >
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>

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
