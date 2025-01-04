import {
  setLoading,
  setError,
  setSuccess,
  addMedication,
  updateMedicationLots,
  setMedications,
  setSearchedMedication,
  resetSearchedMedication,
} from "./medicationSlice";

const handleApiRequest = async (dispatch, apiCall) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }

    const response = await apiCall(token);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Une erreur est survenue");
    }

    return data;
  } catch (error) {
    console.error("Erreur API:", error);
    dispatch(setError(error.message || "Erreur inconnue"));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const createMedication = (medicationData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(setSuccess(null));

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

    console.log("Response status:", response.status);
    const responseText = await response.text();
    console.log("Response text:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);
      throw new Error(`Réponse invalide : ${responseText}`);
    }

    if (!response.ok) {
      throw new Error(data.message || "Une erreur est survenue");
    }

    // Utiliser updateMedicationLots si c'est une mise à jour, sinon addMedication
    if (medicationData.id) {
      dispatch(updateMedicationLots(data.medication));
    } else {
      dispatch(addMedication(data.medication));
    }

    dispatch(setSuccess("Médicament mis à jour avec succès"));
  } catch (error) {
    console.error("Erreur détaillée:", error);
    dispatch(setError(error.message || "Erreur inconnue"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchMedications = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

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
    dispatch(setError(error.message || "Erreur inconnue"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const searchMedicationByCIP13 = (cip13) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    dispatch(resetSearchedMedication());

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }

    const response = await fetch(`/api/medications/search-cip13/${cip13}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      dispatch(
        setSearchedMedication({
          cip13: cip13,
          notFound: true,
        })
      );
      throw new Error(data.message || "Aucun médicament trouvé");
    }

    dispatch(setSearchedMedication(data));
    return data;
  } catch (error) {
    console.error("Erreur de recherche CIP13:", error);
    if (error.message !== "Aucun médicament trouvé") {
      dispatch(setError(error.message || "Erreur de recherche"));
    }
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

// Nouvelles actions pour la gestion des lots
export const updateLotQuantity =
  (cip13, lotNumber, increment) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Vous devez être connecté pour effectuer cette action");
      }

      const incrementValue = increment ? true : false; // Convertir le boolean en nombre

      console.log("Envoi de la requête de mise à jour:", {
        url: `/api/medications/${cip13}/lots/${lotNumber}`,
        method: "PATCH",
        incrementValue,
        body: JSON.stringify({ increment: incrementValue }),
      });

      const response = await fetch(
        `/api/medications/${cip13}/lots/${lotNumber}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ increment: incrementValue }),
        }
      );

      // Log de la réponse
      console.log("Réponse reçue:", {
        status: response.status,
        ok: response.ok,
        url: response.url,
      });

      // Tentative de lire le corps de la réponse en texte d'abord
      const responseText = await response.text();
      console.log("Réponse texte:", responseText);

      // Puis parser en JSON si possible
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (error) {
        console.error("Erreur parsing JSON:", error);
        throw new Error(`Réponse invalide du serveur: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue");
      }

      dispatch(updateMedicationLots(data));
      dispatch(setSuccess("Quantité mise à jour avec succès"));
    } catch (error) {
      console.error("Erreur détaillée lors de la mise à jour du lot:", error);
      dispatch(setError(error.message || "Erreur inconnue"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteLot = (cip13, lotNumber) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }

    const response = await fetch(
      `/api/medications/${cip13}/lots/${lotNumber}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Une erreur est survenue");
    }

    dispatch(updateMedicationLots(data));
    dispatch(setSuccess("Lot supprimé avec succès"));
  } catch (error) {
    console.error("Erreur lors de la suppression du lot:", error);
    dispatch(setError(error.message || "Erreur inconnue"));
  } finally {
    dispatch(setLoading(false));
  }
};
