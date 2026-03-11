import { useTransactionStore, useWalletStore, useToolsStore } from '../stores'
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
import type { Transaction } from '../entity'

export function TransactionsWidget() {
  const { transactions } = useTransactionStore()
  const { wallets } = useWalletStore()
  const { tools } = useToolsStore()

  const getToolName = (id: number) =>
    tools.find((t) => t.id === id)?.name ?? String(id)

  const getTransactionLabel = (trx: Transaction): string => {
    switch (trx.type) {
      case 'WALLET_TOP_UP':
        return 'Top Up'
      case 'LANDING_SUPPLY':
        return `Supply (${getToolName(trx.landingId)})`
      case 'LANDING_BORROW':
        return `Borrow (${getToolName(trx.landingId)})`
    }
  }

  const getWalletName = (id: number) =>
    wallets.find((w) => w.id === id)?.name ?? String(id)

  return (
    <Card>
      <CardHeader title="Transactions" />
      <CardContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Wallet</TableCell>
              <TableCell>Asset</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((trx, i) => (
              <TableRow key={i}>
                <TableCell>{trx.date.toLocaleDateString('ru')}</TableCell>
                <TableCell>{getTransactionLabel(trx)}</TableCell>
                <TableCell>{getWalletName(trx.walletId)}</TableCell>
                <TableCell>{trx.assetCode}</TableCell>
                <TableCell align="right">
                  {trx.amount.toLocaleString('ru')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
