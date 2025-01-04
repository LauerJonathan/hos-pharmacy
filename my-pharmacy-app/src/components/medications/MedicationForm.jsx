import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createMedication,
  searchMedicationByCIP13,
} from "../../store/features/medications/medicationThunks";
import {
  resetStatus,
  selectSearchedMedication,
  selectMedicationsLoading,
  selectMedicationsError,
} from "../../store/features/medications/medicationSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2, Package, X, AlertCircle } from "lucide-react";

// État initial du formulaire
const initialFormState = {
  name: "",
  form: "comprime",
  dose: "",
  currentStock: "",
  minQuantity: "",
  cip13: "",
  prescriptionRequired: false,
  lots: [{ lotNumber: "", quantity: "", expirationDate: "" }],
};

const MedicationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const searchedMedication = useSelector(selectSearchedMedication);
  const loading = useSelector(selectMedicationsLoading);
  const apiError = useSelector(selectMedicationsError);

  // State local pour le formulaire
  const [formData, setFormData] = useState(initialFormState);
  const [cip13SearchTerm, setCip13SearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      dispatch(resetStatus());
    };
  }, [dispatch]);

  // Gestion du pré-remplissage si médicament trouvé
  useEffect(() => {
    if (searchedMedication) {
      if (searchedMedication.notFound) {
        // Médicament non trouvé : pré-remplir avec le CIP13
        setFormData((prev) => ({
          ...prev,
          cip13: searchedMedication.cip13,
          name: "",
          form: "comprime",
          dose: "",
          currentStock: "",
          minQuantity: "",
          prescriptionRequired: false,
          lots: [{ lotNumber: "", quantity: "", expirationDate: "" }],
        }));
      } else {
        // Médicament trouvé : pré-remplir avec ses informations
        setFormData({
          name: searchedMedication.name || "",
          form: searchedMedication.form || "comprime",
          dose: searchedMedication.dose || "",
          currentStock: searchedMedication.currentStock || "",
          minQuantity: searchedMedication.minQuantity || "",
          cip13: searchedMedication.cip13 || cip13SearchTerm,
          prescriptionRequired:
            searchedMedication.prescriptionRequired || false,
          lots: searchedMedication.lots?.length
            ? searchedMedication.lots.map((lot) => ({
                lotNumber: lot.lotNumber || "",
                quantity: lot.quantity || "",
                expirationDate: lot.expirationDate
                  ? lot.expirationDate.split("T")[0]
                  : "",
              }))
            : [{ lotNumber: "", quantity: "", expirationDate: "" }],
        });
      }
      setIsSearching(false);
      setSearchAttempted(true);
    }
  }, [searchedMedication, cip13SearchTerm]);

  // Fonction de recherche CIP13
  const handleCip13Search = useCallback(async () => {
    if (cip13SearchTerm.trim()) {
      setIsSearching(true);
      setSearchAttempted(true);
      try {
        await dispatch(searchMedicationByCIP13(cip13SearchTerm.trim()));
      } catch (error) {
        setSearchAttempted(false);
      } finally {
        setIsSearching(false);
      }
    }
  }, [dispatch, cip13SearchTerm]);

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Gestion des lots
  const handleLotChange = (index, field, value) => {
    const newLots = [...formData.lots];
    newLots[index][field] = value;
    setFormData((prev) => ({ ...prev, lots: newLots }));
  };

  const addLot = () => {
    setFormData((prev) => ({
      ...prev,
      lots: [...prev.lots, { lotNumber: "", quantity: "", expirationDate: "" }],
    }));
  };

  const removeLot = (index) => {
    if (formData.lots.length > 1) {
      setFormData((prev) => ({
        ...prev,
        lots: prev.lots.filter((_, i) => i !== index),
      }));
    }
  };

  // Réinitialisation de la recherche
  const resetSearch = () => {
    setCip13SearchTerm("");
    setFormData(initialFormState);
    setSearchAttempted(false);
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createMedication(formData));
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un nouveau médicament</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Barre de recherche CIP13 */}
          <div className="flex space-x-2 mb-4">
            <div className="relative flex-grow">
              <Input
                placeholder="Rechercher par CIP13"
                value={cip13SearchTerm}
                onChange={(e) => {
                  setCip13SearchTerm(e.target.value);
                  setSearchAttempted(false);
                }}
                className="pr-10"
              />
              {cip13SearchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={resetSearch}>
                  <X className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleCip13Search}
              disabled={isSearching || !cip13SearchTerm}
              className="w-16">
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Indication de recherche */}
          {searchAttempted && !searchedMedication && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Aucun médicament trouvé. Vous pouvez créer un nouveau
                médicament.
              </AlertDescription>
            </Alert>
          )}

          {/* Messages d'erreur */}
          {apiError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          {/* Champs principaux */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="name"
              placeholder="Nom du médicament"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Select
              value={formData.form}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, form: value }))
              }>
              <SelectTrigger>
                <SelectValue placeholder="Forme galénique" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprime">Comprimé</SelectItem>
                <SelectItem value="gelule">Gélule</SelectItem>
                <SelectItem value="sirop">Sirop</SelectItem>
                <SelectItem value="solution">Solution</SelectItem>
                <SelectItem value="pommade">Pommade</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              name="dose"
              placeholder="Dosage (ex: 500mg)"
              value={formData.dose}
              onChange={handleInputChange}
              required
            />
            <Input
              name="cip13"
              placeholder="Code CIP13"
              value={formData.cip13}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              name="currentStock"
              placeholder="Stock actuel"
              value={formData.currentStock}
              onChange={handleInputChange}
              required
              min="0"
            />
            <Input
              type="number"
              name="minQuantity"
              placeholder="Stock minimal"
              value={formData.minQuantity}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          {/* Gestion des lots */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Lots</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLot}>
                <Package className="h-4 w-4 mr-2" /> Ajouter un lot
              </Button>
            </div>

            {formData.lots.map((lot, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 items-center">
                <Input
                  placeholder="Numéro de lot"
                  value={lot.lotNumber}
                  onChange={(e) =>
                    handleLotChange(index, "lotNumber", e.target.value)
                  }
                  required
                />
                <Input
                  type="number"
                  placeholder="Quantité"
                  value={lot.quantity}
                  onChange={(e) =>
                    handleLotChange(index, "quantity", e.target.value)
                  }
                  required
                  min="0"
                />
                <div className="flex items-center space-x-2">
                  <Input
                    type="date"
                    placeholder="Date d'expiration"
                    value={lot.expirationDate}
                    onChange={(e) =>
                      handleLotChange(index, "expirationDate", e.target.value)
                    }
                    required
                  />
                  {formData.lots.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeLot(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Checkbox Ordonnance */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="prescriptionRequired"
              name="prescriptionRequired"
              checked={formData.prescriptionRequired}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor="prescriptionRequired"
              className="text-sm font-medium">
              Ordonnance requise
            </label>
          </div>

          {/* Boutons de soumission */}
          <div className="grid grid-cols-2 gap-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Ajouter le médicament"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
              className="w-full">
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MedicationForm;
