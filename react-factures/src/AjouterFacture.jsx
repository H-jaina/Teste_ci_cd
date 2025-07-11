import { useState } from 'react';
import axios from './axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function AjouterFacture() {
  const [form, setForm] = useState({ client: '', produit: '', quantite: '', prix_unitaire: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('/factures', form)
      .then(() => navigate('/'))
      .catch(err => alert("Erreur d'ajout"));
  };

  return (
    <div className="container">
      <h2>Ajouter une Facture</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="client" placeholder="Client" onChange={handleChange} required />
        <input type="text" name="produit" placeholder="Produit" onChange={handleChange} required />
        <input type="number" name="quantite" placeholder="Quantité" onChange={handleChange} required />
        <input type="number" name="prix_unitaire" placeholder="Prix unitaire" onChange={handleChange} required />
        <button className="ajouter-btn" type="submit">Ajouter</button>
        <Link to ="/" className="ajouter-btn">Retour</Link>
      </form>
    </div>
  );
}

export default AjouterFacture;
