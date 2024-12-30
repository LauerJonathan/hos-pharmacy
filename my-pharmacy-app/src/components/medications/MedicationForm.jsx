import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createMedication } from "../../store/features/medications/medicationThunks";
import { resetStatus } from "../../store/features/medications/medicationSlice";
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

const MedicationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.medications);

  const [formData, setFormData] = useState({
    medName: "",
    form: "comprime",
    dose: "",
    stock_quantity: "",
    minimum_quantity: "",
    expiration_date: "",
    prescription_required: false,
  });

  useEffect(() => {
    // Nettoyage au démontage
    return () => {
      dispatch(resetStatus());
    };
  }, [dispatch]);

  // Si succès, retour au dashboard après 2 secondes
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      form: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createMedication(formData));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Ajouter un nouveau médicament</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Input
              name="medName"
              placeholder="Nom du médicament"
              value={formData.medName}
              onChange={handleInputChange}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Select value={formData.form} onValueChange={handleFormChange}>
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

          <div className="space-y-2">
            <Input
              name="dose"
              placeholder="Dosage (ex: 500mg)"
              value={formData.dose}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              name="stock_quantity"
              placeholder="Quantité en stock"
              value={formData.stock_quantity}
              onChange={handleInputChange}
              required
              min="0"
            />

            <Input
              type="number"
              name="minimum_quantity"
              placeholder="Quantité minimum"
              value={formData.minimum_quantity}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="date"
              name="expiration_date"
              value={formData.expiration_date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="prescription_required"
              name="prescription_required"
              checked={formData.prescription_required}
              onChange={handleInputChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label
              htmlFor="prescription_required"
              className="text-sm font-medium">
              Ordonnance requise
            </label>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Ajout en cours..." : "Ajouter le médicament"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/dashboard")}
              disabled={loading}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MedicationForm;
