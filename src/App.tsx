import './App.css'
import { Box, Stack } from '@mui/material'
import { AssetsWidget } from './components/AssetsWidget'
import { WalletWidget } from './components/WalletWidget'
import { ToolWidget } from './components/ToolWidget'
import { TransactionsWidget } from './components/TransactionsWidget'

function App() {
  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={1} direction="row" useFlexGap sx={{ flexWrap: 'wrap' }}>
        <AssetsWidget />
        <WalletWidget />
        <ToolWidget />
        <TransactionsWidget />
      </Stack>
    </Box>
  )
}

export default App