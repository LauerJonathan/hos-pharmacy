import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Trash2, Plus, Minus, AlertTriangle } from "lucide-react";
import {
  selectMedicationByCIP13,
  selectStockStatus,
  selectMedicationsLoading,
  selectMedicationsError,
  selectMedicationsSuccess,
} from "../store/features/medications/medicationSlice";
import {
  searchMedicationByCIP13,
  updateLotQuantity,
  deleteLot,
} from "../store/features/medications/medicationThunks";

import Header from "../layouts/Header";
import { RestockProvider } from "../components/medications/RestockContext";
import RestockButton from "../components/medications/RestockButton";

const StockMedPage = () => {
  const { cip13 } = useParams();
  const dispatch = useDispatch();
  const [lotToDelete, setLotToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const medication = useSelector((state) =>
    selectMedicationByCIP13(state, cip13)
  );
  const stockStatus = useSelector((state) => selectStockStatus(state, cip13));
  const loading = useSelector(selectMedicationsLoading);
  const error = useSelector(selectMedicationsError);
  const success = useSelector(selectMedicationsSuccess);
  const isLowStock = true;

  useEffect(() => {
    if (cip13) {
      dispatch(searchMedicationByCIP13(cip13));
    }
  }, [cip13, dispatch]);

  const handleUpdateQuantity = (lotNumber, increment) => {
    dispatch(updateLotQuantity(cip13, lotNumber, increment));
  };

  const handleDeleteConfirm = () => {
    if (lotToDelete) {
      dispatch(deleteLot(cip13, lotToDelete));
      setLotToDelete(null);
      setShowModal(false);
    }
  };

  const openDeleteModal = (lotNumber) => {
    setLotToDelete(lotNumber);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setLotToDelete(null);
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "bg-green-500 text-white";
      case "low":
        return "bg-yellow-500 text-white";
      case "critical":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-4 p-4 bg-red-50 border border-red-400 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!medication) {
    return (
      <div className="max-w-4xl mx-auto mt-4 p-4 bg-yellow-50 border border-yellow-400 rounded-lg">
        <p className="text-yellow-700">
          Aucun médicament trouvé avec le CIP13: {cip13}
        </p>
      </div>
    );
  }

  return (
    <RestockProvider>
      <Header showBackButton={true} />
      <div className="p-4 max-w-4xl mx-auto">
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-400 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {medication.name} {medication.dose} - {medication.form}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStockStatusColor(
                    stockStatus?.status
                  )}`}>
                  Stock: {medication.currentStock}
                </span>
              </div>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                CIP13: {cip13}
              </span>
            </div>
          </div>

          <div className="p-6">
            {stockStatus?.isLow && (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-400 rounded-lg">
                <p className="text-yellow-700">
                  Stock faible ! Quantité actuelle sous le minimum requis (
                  {stockStatus.minQuantity})
                </p>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      N° de Lot
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de Péremption
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      État
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medication.lots.map((lot) => (
                    <tr
                      key={lot.lotNumber}
                      className={lot.isExpired ? "bg-red-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lot.lotNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {lot.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(lot.expirationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            lot.isExpired
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                          {lot.isExpired ? "Périmé" : "Valide"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                              handleUpdateQuantity(lot.lotNumber, true)
                            }
                            disabled={lot.isExpired}>
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                              handleUpdateQuantity(lot.lotNumber, false)
                            }
                            disabled={lot.isExpired || lot.quantity === 0}>
                            <Minus className="h-4 w-4" />
                          </button>
                          <RestockButton
                            medication={medication}
                            isLowStock={isLowStock}
                          />
                          <button
                            className="p-2 rounded bg-red-50 hover:bg-red-100 text-red-600"
                            onClick={() => openDeleteModal(lot.lotNumber)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal de confirmation de suppression */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}>
            <div
              className="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto transform transition-all"
              onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-center text-gray-900">
                  Confirmer la suppression
                </h3>
                <div className="mt-4 space-y-3 text-gray-500">
                  <p>
                    Attention ! La suppression du lot sera définitive et ne
                    pourra pas être annulée.
                  </p>
                  <p>
                    Les médicaments périmés ou rendu inutilisable doivent être
                    retirés du stock pour :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Maintenir un inventaire précis</li>
                    <li>Éviter les erreurs de distribution</li>
                    <li>Assurer la traçabilité des médicaments</li>
                  </ul>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={closeModal}>
                  Annuler
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleDeleteConfirm}>
                  Confirmer la suppression
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RestockProvider>
  );
};

export default StockMedPage;
