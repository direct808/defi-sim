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
  Typography,
} from '@mui/material'

function App() {
  const { assets, updatePrice } = useAssetStore()

  const walletsView = useWalletView()
  const toolsView = useToolsView()

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
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

        <Card>
          <CardHeader title="Wallets" />
          <CardContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Assets</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {walletsView.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell>{wallet.id}</TableCell>
                    <TableCell>{wallet.name}</TableCell>
                    <TableCell>
                      {wallet.balances.map((balance) => (
                        <Typography key={balance.code} variant="body2">
                          {balance.code}: {balance.balance.toLocaleString('ru')} ({balance.balanceUsd.toLocaleString('ru')} $)
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell align="right">
                      {wallet.totalUsd.toLocaleString('ru')} $
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Tools" />
          <CardContent>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Assets</TableCell>
                  <TableCell align="right">HF</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {toolsView.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell>{tool.id}</TableCell>
                    <TableCell>{tool.name}</TableCell>
                    <TableCell>
                      {tool.balances.map((balance) => (
                        <Typography key={balance.code} variant="body2">
                          {balance.code}: supply {balance.supply.toLocaleString('ru')} ({balance.supplyUsd.toLocaleString('ru')} $)
                          {' / '}borrow {balance.borrow.toLocaleString('ru')} ({balance.borrowUsd.toLocaleString('ru')} $)
                        </Typography>
                      ))}
                    </TableCell>
                    <TableCell align="right">
                      {tool.hf !== null ? tool.hf.toFixed(2) : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  )
}

export default App
