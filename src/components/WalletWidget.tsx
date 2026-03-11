import { useWalletView } from '../stores/walletStore'
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'

export function WalletWidget() {
  const walletsView = useWalletView()

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
        </Card>
      ))}
    </>
  )
}