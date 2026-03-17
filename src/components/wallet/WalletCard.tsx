import DeleteIcon from '@mui/icons-material/Delete'
import CallReceivedIcon from '@mui/icons-material/CallReceived'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import type { useWalletView } from '../../stores/walletStore'

type WalletView = ReturnType<typeof useWalletView>[number]

export function WalletCard({
  wallet,
  onTopUp,
  onWithdraw,
  onDelete,
}: {
  wallet: WalletView
  onTopUp: (walletId: number) => void
  onWithdraw: (walletId: number, assetCode: string, maxBalance: number) => void
  onDelete: (walletId: number, walletName: string) => void
}) {
  return (
    <Card>
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
                    onClick={() => onWithdraw(wallet.id, balance.code, balance.balance)}
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
        <Button size="small" onClick={() => onTopUp(wallet.id)}>
          Top up
        </Button>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(wallet.id, wallet.name)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  )
}