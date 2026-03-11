import { useAssetStore } from '../stores'
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'

export function AssetsWidget() {
  const { assets, updatePrice } = useAssetStore()

  return (
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
  )
}