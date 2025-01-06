import React from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const MedicationFilters = ({
  searchTerm,
  onSearchChange,
  cip13SearchTerm,
  onCip13SearchChange,
  sortBy,
  onSortChange,
}) => {
  const handleCip13Change = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*$/.test(value)) {
      onCip13SearchChange(value);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="Rechercher un médicament..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Input
          placeholder="Rechercher par CIP13"
          value={cip13SearchTerm}
          onChange={handleCip13Change}
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger>
          <SelectValue placeholder="Trier par..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Nom (A-Z)</SelectItem>
          <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
          <SelectItem value="stock-asc">Stock (Croissant)</SelectItem>
          <SelectItem value="stock-desc">Stock (Décroissant)</SelectItem>
          <SelectItem value="expiration">Date d'expiration</SelectItem>
          <SelectItem value="low-stock">Stock bas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MedicationFilters;
