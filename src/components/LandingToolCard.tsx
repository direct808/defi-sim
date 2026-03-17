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
  balances: Balance[]
}

export function LandingToolCard({ name, hf, balances }: Props) {
  return (
    <Card>
      <CardHeader
        title={name}
        subheader={`HF: ${hf !== null ? hf.toFixed(2) : '—'}`}
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