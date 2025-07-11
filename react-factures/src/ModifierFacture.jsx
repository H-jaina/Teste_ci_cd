// src/ModifierFacture.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from './axios';

function ModifierFacture() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    client: '',
    produit: '',
    quantite: '',
    prix_unitaire: ''
  });

  useEffect(() => {
    axios.get(`/factures/${id}`)
      .then(res => {
        setForm(res.data);
      })
      .catch(err => {
        console.error("Erreur lors du chargement de la facture :", err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/factures/${id}`, form)
      .then(() => {
        navigate('/');
      })
      .catch(err => {
        console.error("Erreur lors de la modification :", err);
      });
  };

  return (
    <div className="form-page">
      <h2>Modifier la Facture</h2>
      <form onSubmit={handleSubmit} className="facture-form">
        <input type="text" name="client" placeholder="Client" value={form.client} onChange={handleChange} required />
        <input type="text" name="produit" placeholder="Produit" value={form.produit} onChange={handleChange} required />
        <input type="number" name="quantite" placeholder="Quantité" value={form.quantite} onChange={handleChange} required />
        <input type="number" name="prix_unitaire" placeholder="Prix unitaire" value={form.prix_unitaire} onChange={handleChange} required />
        <button className="ajouter-btn" type="submit">Modifier</button><button onclick={()=>navigate('/')}className="ajouter-btn">Retour</button>
      </form>
    </div>
  );
}

export default ModifierFacture;
