// src/components/medications/MedicationFilters.jsx
import React from "react";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MedicationFilters = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Barre de recherche */}
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Rechercher un médicament..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Sélecteur de tri */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Nom (A-Z)</SelectItem>
          <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
          <SelectItem value="stock-asc">Stock (Croissant)</SelectItem>
          <SelectItem value="stock-desc">Stock (Décroissant)</SelectItem>
          <SelectItem value="expiration">Date d'expiration</SelectItem>
          <SelectItem value="low-stock">Stock bas en premier</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MedicationFilters;
