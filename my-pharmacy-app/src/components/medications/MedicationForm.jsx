import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMedication } from "../../contexts/MedicationContext";
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
  const navigate = useNavigate();
  const { createMedication, getMedicationByCIP13, loading, error, success } =
    useMedication();

  // États locaux
  const [formData, setFormData] = useState(initialFormState);
  const [cip13SearchTerm, setCip13SearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [searchedMedication, setSearchedMedication] = useState(null);

  // Gestion de la recherche CIP13
  const handleCip13Search = async () => {
    if (cip13SearchTerm.trim()) {
      setIsSearching(true);
      setSearchAttempted(true);
      const medication = await getMedicationByCIP13(cip13SearchTerm.trim());
      if (medication) {
        setSearchedMedication(medication);
        // Pré-remplir le formulaire avec les données existantes
        setFormData({
          name: medication.name || "",
          form: medication.form || "comprime",
          dose: medication.dose || "",
          currentStock: medication.currentStock || "",
          minQuantity: medication.minQuantity || "",
          cip13: medication.cip13 || cip13SearchTerm,
          prescriptionRequired: medication.prescriptionRequired || false,
          lots: [{ lotNumber: "", quantity: "", expirationDate: "" }],
        });
      } else {
        setSearchedMedication(null);
        setFormData({
          ...initialFormState,
          cip13: cip13SearchTerm,
        });
      }
      setIsSearching(false);
    }
  };

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
    setSearchedMedication(null);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createMedication(formData);
    if (result) {
      navigate("/stock");
    }
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

          {/* Messages d'indication/erreur */}
          {searchAttempted && !searchedMedication && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Aucun médicament trouvé. Vous pouvez créer un nouveau
                médicament.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Reste du formulaire identique */}
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
              name="minQuantity"
              placeholder="Stock minimal"
              value={formData.minQuantity}
              onChange={handleInputChange}
              required
              min="0"
            />
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
              onClick={() => navigate("/stock")}
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
