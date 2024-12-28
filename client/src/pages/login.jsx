import { useState } from "react";
import "../App.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "aa@aa.aa",
    password: "MotDePasse123!",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <main className="App">
      <section>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
          />
          <br />
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          <br />
          <button>Connexion</button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
