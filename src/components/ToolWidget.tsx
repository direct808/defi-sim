import { useToolsView } from '../stores/toolsStore'
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

export function ToolWidget() {
  const toolsView = useToolsView()

  return (
    <>
      {toolsView.map((tool) => (
        <Card key={tool.id}>
          <CardHeader
            title={tool.name}
            subheader={`HF: ${tool.hf !== null ? tool.hf.toFixed(2) : '—'}`}
          />
          <CardContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell align="right">Supply</TableCell>
                  <TableCell align="right">Borrow</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tool.balances.map((balance) => (
                  <TableRow key={balance.code}>
                    <TableCell>{balance.code}</TableCell>
                    <TableCell align="right">
                      {balance.supply.toLocaleString('ru')} (
                      {balance.supplyUsd.toLocaleString('ru')} $)
                    </TableCell>
                    <TableCell align="right">
                      {balance.borrow.toLocaleString('ru')} (
                      {balance.borrowUsd.toLocaleString('ru')} $)
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