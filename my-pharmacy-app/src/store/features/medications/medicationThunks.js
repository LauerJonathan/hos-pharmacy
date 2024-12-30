// store/features/medications/medicationThunks.js
import {
  setLoading,
  setError,
  setSuccess,
  addMedication,
  setMedications,
} from "./medicationSlice";

export const createMedication = (medicationData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }

    const response = await fetch("/api/medications/additem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(medicationData),
    });

    console.log("Status:", response.status);
    const contentType = response.headers.get("content-type");
    console.log("Content-Type:", contentType);

    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      throw new Error(data.message || "Une erreur est survenue");
    }

    dispatch(addMedication(data.medication));
    dispatch(setSuccess("Médicament ajouté avec succès"));
  } catch (error) {
    console.error("Erreur détaillée:", error);
    dispatch(
      setError(typeof error === "object" ? error.message : "Erreur inconnue")
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchMedications = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }

    const response = await fetch("/api/medications", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Une erreur est survenue");
    }

    dispatch(setMedications(data.medications));
  } catch (error) {
    console.error("Erreur lors de la récupération des médicaments:", error);
    dispatch(
      setError(typeof error === "object" ? error.message : "Erreur inconnue")
    );
  } finally {
    dispatch(setLoading(false));
  }
};