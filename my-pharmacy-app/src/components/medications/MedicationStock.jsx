import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus } from 'lucide-react';

const MedicationStock = ({ medication }) => {
  const [stock, setStock] = useState(medication);

  const handleDeleteExpiredLot = (lotNumber) => {
    const updatedLots = stock.lots.filter(lot => lot.lotNumber !== lotNumber);
    const newCurrentStock = updatedLots.reduce((sum, lot) => sum + lot.quantity, 0);
    setStock({
      ...stock,
      lots: updatedLots,
      currentStock: newCurrentStock
    });
  };

  const handleUpdateQuantity = (lotNumber, increment) => {
    const updatedLots = stock.lots.map(lot => {
      if (lot.lotNumber === lotNumber) {
        const newQuantity = lot.quantity + (increment ? 1 : -1);
        return { ...lot, quantity: Math.max(0, newQuantity) };
      }
      return lot;
    });
    const newCurrentStock = updatedLots.reduce((sum, lot) => sum + lot.quantity, 0);
    setStock({
      ...stock,
      lots: updatedLots,
      currentStock: newCurrentStock
    });
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'normal': return 'bg-green-500';
      case 'low': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div>
              {medication.name} {medication.dose} - {medication.form}
              <Badge className={`ml-2 ${getStockStatusColor(medication.stockStatus)}`}>
                Stock: {medication.currentStock}
              </Badge>
            </div>
            <Badge variant="outline">CIP13: {medication.cip13}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {medication.currentStock < medication.minQuantity && (
            <Alert className="mb-4 bg-yellow-50">
              <AlertDescription>
                Stock faible ! Quantité actuelle sous le minimum requis ({medication.minQuantity})
              </AlertDescription>
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° de Lot</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Date de Péremption</TableHead>
                <TableHead>État</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stock.lots.map((lot) => (
                <TableRow key={lot.lotNumber} className={lot.isExpired ? 'bg-red-50' : ''}>
                  <TableCell>{lot.lotNumber}</TableCell>
                  <TableCell>{lot.quantity}</TableCell>
                  <TableCell>{formatDate(lot.expirationDate)}</TableCell>
                  <TableCell>
                    <Badge variant={lot.isExpired ? 'destructive' : 'outline'}>
                      {lot.isExpired ? 'Périmé' : 'Valide'}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleUpdateQuantity(lot.lotNumber, true)}
                      disabled={lot.isExpired}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleUpdateQuantity(lot.lotNumber, false)}
                      disabled={lot.isExpired || lot.quantity === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    {lot.isExpired && (
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleDeleteExpiredLot(lot.lotNumber)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationStock;