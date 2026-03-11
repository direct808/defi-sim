import './App.css'
import { useAssetStore } from './stores'
import { useWalletView } from './stores/walletStore.ts'
import { useToolsView } from './stores/toolsStore.ts'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'

function App() {
  const { assets, updatePrice } = useAssetStore()

  const walletsView = useWalletView()
  const toolsView = useToolsView()

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={1} direction="row" useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Card>
          <CardHeader title="Assets" />
          <CardContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.code}>
                    <TableCell>{asset.code}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        type="number"
                        value={asset.price}
                        onChange={(event) =>
                          updatePrice(asset.code, +event.target.value)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

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
      </Stack>
    </Box>
  )
}

export default App
