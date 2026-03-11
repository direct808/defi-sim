import { useState } from 'react'
import { useAssetStore } from '../stores'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'

function AddAssetDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { add } = useAssetStore()
  const [code, setCode] = useState('')
  const [price, setPrice] = useState('')

  const handleSave = () => {
    add({ code, price: +price })
    setCode('')
    setPrice('')
    onClose()
  }

  const handleCancel = () => {
    setCode('')
    setPrice('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Add Asset</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Code"
            size="small"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <TextField
            label="Price"
            size="small"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Отмена</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!code || !price}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export function AssetsWidget() {
  const { assets, updatePrice } = useAssetStore()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card>
        <CardHeader
          title="Assets"
          action={
            <Button
              sx={{ pt: 1 }}
              size="small"
              onClick={() => setDialogOpen(true)}
            >
              + Add
            </Button>
          }
        />
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

      <AddAssetDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
