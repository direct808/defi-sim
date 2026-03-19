import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import { LandingSupplyDialog } from './LandingSupplyDialog'
import { ConfirmDialog } from './ConfirmDialog'
import { useToolsStore } from '../stores/toolsStore'

type Balance = {
  code: string
  supply: number
  supplyUsd: number
  supplyApy: number
  borrow: number
  borrowUsd: number
  borrowApy: number
  ltv: number
}

type Props = {
  id: number
  name: string
  hf: number | null
  walletId: number
  balances: Balance[]
}

export function LandingToolCard({ id, name, hf, walletId, balances }: Props) {
  const [supplyOpen, setSupplyOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const removeTool = useToolsStore((s) => s.removeTool)

  return (
    <Card>
      <CardHeader
        title={name}
        subheader={`HF: ${hf !== null ? hf.toFixed(2) : '—'}`}
        action={
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" onClick={() => setSupplyOpen(true)}>
              Supply
            </Button>
            <Button size="small" variant="outlined" color="error" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </Stack>
        }
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Удалить протокол"
        message={`Удалить «${name}»?`}
        confirmLabel="Удалить"
        onConfirm={() => { removeTool(id); setConfirmOpen(false) }}
        onClose={() => setConfirmOpen(false)}
      />
      <LandingSupplyDialog
        open={supplyOpen}
        landingId={id}
        walletId={walletId}
        onClose={() => setSupplyOpen(false)}
      />
      <CardContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell align="right">Supply APY</TableCell>
              <TableCell align="right">Supply</TableCell>
              <TableCell align="right">Borrow APY</TableCell>
              <TableCell align="right">Borrow</TableCell>
              <TableCell align="right">LTV</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {balances.map((balance) => (
              <TableRow key={balance.code}>
                <TableCell>{balance.code}</TableCell>
                <TableCell align="right">{balance.supplyApy}%</TableCell>
                <TableCell align="right">
                  {balance.supply.toLocaleString('ru')} (
                  {balance.supplyUsd.toLocaleString('ru')} $)
                </TableCell>
                <TableCell align="right">{balance.borrowApy}%</TableCell>
                <TableCell align="right">
                  {balance.borrow.toLocaleString('ru')} (
                  {balance.borrowUsd.toLocaleString('ru')} $)
                </TableCell>
                <TableCell align="right">{balance.ltv}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}