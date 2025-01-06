import MedicationForm from "../components/medications/MedicationForm";
import Header from "../layouts/Header";

const AddMedicationPage = () => {
  return (
    <>
      <Header showBackButton={true} />
      <div className="container mx-auto py-8">
        <MedicationForm />
      </div>
    </>
  );
};

export default AddMedicationPage;
