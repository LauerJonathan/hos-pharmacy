import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { PlusCircle, X } from 'lucide-react';
import { useRestock } from './RestockContext';

const RestockButton = ({ medication, onRestock, isLowStock }) => {
  const { openMedicationId, setOpenMedicationId } = useRestock();
  const [currentStock, setCurrentStock] = useState(medication.currentStock);
  const [minQuantity, setMinQuantity] = useState(medication.minQuantity);
  
  const isExpanded = openMedicationId === medication.id;

  // Vérifie si le nouveau stock est suffisant
  const isNewStockSufficient = useMemo(() => {
    return currentStock >= minQuantity;
  }, [currentStock, minQuantity]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onRestock(medication.id, { currentStock, minQuantity });
    setOpenMedicationId(null);
  };

  const handleCancel = () => {
    setCurrentStock(medication.currentStock);
    setMinQuantity(medication.minQuantity);
    setOpenMedicationId(null);
  };

  return (
    <>
      <Button
        onClick={() => !isExpanded && setOpenMedicationId(medication.id)}
        variant={isLowStock ? "default" : "outline"}
        size="icon"
        className={`w-10 h-10 transition-colors duration-200 ${
          isLowStock 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'hover:bg-gray-100'
        }`}
        title="Réapprovisionner"
      >
        <PlusCircle className="w-5 h-5" />
      </Button>

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 p-6 bg-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{medication.name}</h3>
                <p className="text-gray-500">{medication.form} - {medication.dose}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 hover:bg-gray-100"
                onClick={handleCancel}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={`rounded-lg p-4 ${isLowStock ? 'bg-red-50' : 'bg-gray-50'}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isLowStock ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                      Stock actuel
                    </span>
                    <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                      {medication.currentStock} unités
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stock minimum</span>
                    <span className="font-medium text-gray-900">
                      {medication.minQuantity} unités
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Nouveau stock</label>
                  <Input
                    type="number"
                    value={currentStock}
                    onChange={(e) => setCurrentStock(Number(e.target.value))}
                    min="0"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Nouveau minimum</label>
                  <Input
                    type="number"
                    value={minQuantity}
                    onChange={(e) => setMinQuantity(Number(e.target.value))}
                    min="0"
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${isNewStockSufficient ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={isNewStockSufficient ? 'text-green-600' : 'text-red-600'}>
                    {isNewStockSufficient 
                      ? 'Stock suffisant' 
                      : 'Stock insuffisant'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  type="submit" 
                  className={`flex-1 text-white transition-colors ${
                    isNewStockSufficient 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Valider
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
};

export default RestockButton;