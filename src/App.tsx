import './App.css'
import { Box, Stack } from '@mui/material'
import { AssetsWidget } from './components/AssetsWidget'
import { WalletWidget } from './components/wallet'
import { ToolWidget } from './components/ToolWidget'
import { TransactionsWidget } from './components/TransactionsWidget'
import { Toolbar } from './components/Toolbar'

function App() {
  return (
    <Box>
      <Toolbar />
      <Box sx={{ p: 1 }}>
        <Stack spacing={1}>
          <Stack
            spacing={1}
            direction="row"
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
          >
            <AssetsWidget />
            <WalletWidget />
            <ToolWidget />
          </Stack>
          <TransactionsWidget />
        </Stack>
      </Box>
    </Box>
  )
}

export default App
