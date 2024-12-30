// src/components/medications/MedicationCard.jsx
import React from 'react';
import { Card } from '../ui/card';

const MedicationCard = ({ medication }) => {
  const isLowStock = medication.currentStock <= medication.minQuantity;
  const isExpired = new Date(medication.expirationDate) < new Date();
  
  // Formatage de la date d'expiration
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full p-4 hover:shadow-lg transition-shadow duration-200">
      {/* En-tête avec le nom et les badges */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {medication.form} - {medication.dose}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {isLowStock && (
            <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full whitespace-nowrap">
              Stock bas
            </span>
          )}
          {isExpired && (
            <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full whitespace-nowrap">
              Expiré
            </span>
          )}
          {medication.prescriptionRequired && (
            <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full whitespace-nowrap">
              Ordonnance requise
            </span>
          )}
        </div>
      </div>
      
      {/* Informations sur le stock */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Stock actuel</span>
          <span className={`font-medium ${
            isLowStock ? 'text-red-600' : 'text-gray-900'
          }`}>
            {medication.currentStock} unités
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Quantité minimum</span>
          <span className="font-medium text-gray-900">
            {medication.minQuantity} unités
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Date d'expiration</span>
          <span className={`font-medium ${
            isExpired ? 'text-yellow-600' : 'text-gray-900'
          }`}>
            {formatDate(medication.expirationDate)}
          </span>
        </div>
      </div>
      
      {/* Barre de progression du stock */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              isLowStock ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{
              width: `${Math.min((medication.currentStock / Math.max(medication.minQuantity * 2, medication.currentStock)) * 100, 100)}%`
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default MedicationCard;