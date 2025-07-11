import { useEffect, useState } from 'react';
import axios from './axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaDownload, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem('authenticated') === 'true';
  });

  const [passwordInput, setPasswordInput] = useState('');
  const correctPassword = 'hajaina123';

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === correctPassword) {
      setAuthenticated(true);
      localStorage.setItem('authenticated', 'true');
    } else {
      alert("Mot de passe incorrect !");
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthenticated(false);
    navigate('/login');
  };

  const [factures, setFactures] = useState([]);
  const [form, setForm] = useState({
    client: '',
    produit: '',
    quantite: '',
    prix_unitaire: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState('');
  const [liensUtilises, setLiensUtilises] = useState([]); // ✅ Ajout pour gérer l'état des liens

  useEffect(() => {
    if (authenticated) fetchFactures();
  }, [authenticated]);

  const fetchFactures = () => {
    axios.get('/factures')
      .then(res => setFactures(res.data))
      .catch(() => setMessage({ type: 'error', text: 'Erreur lors du chargement.' }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId === null) {
      axios.post('/factures', form)
        .then(() => {
          setMessage({ type: 'success', text: 'Facture ajoutée avec succès !' });
          setForm({ client: '', produit: '', quantite: '', prix_unitaire: '' });
          fetchFactures();
        })
        .catch(() => setMessage({ type: 'error', text: "Erreur lors de l'ajout." }));
    } else {
      axios.put(`/factures/${editingId}`, form)
        .then(() => {
          setMessage({ type: 'success', text: 'Facture modifiée avec succès !' });
          setForm({ client: '', produit: '', quantite: '', prix_unitaire: '' });
          setEditingId(null);
          fetchFactures();
        })
        .catch(() => setMessage({ type: 'error', text: "Erreur lors de la modification." }));
    }
  };

  const handleEdit = (facture) => {
    setEditingId(facture.id);
    setForm({
      client: facture.client,
      produit: facture.produit,
      quantite: facture.quantite,
      prix_unitaire: facture.prix_unitaire,
    });
    setMessage(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette facture ?")) {
      axios.delete(`/factures/${id}`)
        .then(() => {
          setMessage({ type: 'success', text: 'Facture supprimée avec succès !' });
          if (editingId === id) {
            setEditingId(null);
            setForm({ client: '', produit: '', quantite: '', prix_unitaire: '' });
          }
          fetchFactures();
        })
        .catch(() => setMessage({ type: 'error', text: "Erreur lors de la suppression." }));
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ client: '', produit: '', quantite: '', prix_unitaire: '' });
    setMessage(null);
  };

  const genererLienTelechargement = async (id) => {
    try {
      const response = await axios.get(`/facture/generer-lien/${id}`);
      const url = response.data.url;
      window.open(url, '_blank');

      // ✅ Marquer cette facture comme "lien utilisé"
      setLiensUtilises((prev) => [...prev, id]);
    } catch (error) {
      console.error('Erreur lors de la génération du lien :', error);
      alert('Impossible de générer le lien de téléchargement.');
    }
  };

  const filteredFactures = factures.filter(f =>
    f.client.toLowerCase().includes(search.toLowerCase()) ||
    f.produit.toLowerCase().includes(search.toLowerCase())
  );

  if (!authenticated) {
    return (
      <div className="login-container">
        <h2>Connexion</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Mot de passe"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
          />
          <button type="submit">Se connecter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Liste des Factures</h1>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="header-actions">
        <Link to="/ajouter" className="ajouter-btn">+ Nouvelle facture</Link>
        <button onClick={handleLogout} className="ajouter-btn logout-icon"><FaSignOutAlt /></button>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher par client ou produit..."
          className="ajouter-btn"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {factures.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Prix Unitaire (Ar)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFactures.map(facture => (
              <tr key={facture.id}>
                <td>{facture.client}</td>
                <td>{facture.produit}</td>
                <td>{facture.quantite}</td>
                <td>{facture.prix_unitaire}</td>
                <td>
                  <div className="actions-icons">
                    <Link to={`/modifier/${facture.id}`} className="icon-btn edit-btn">
                      <FaEdit />
                    </Link>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(facture.id)}>
                      <FaTrash />
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => genererLienTelechargement(facture.id)}
                      disabled={liensUtilises.includes(facture.id)}
                      title={
                        liensUtilises.includes(facture.id)
                          ? "Ce lien a déjà été utilisé. Veuillez régénérer une nouvelle facture si nécessaire."
                          : "Télécharger la facture"
                      }
                    >
                      <FaDownload />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucune facture disponible</p>
      )}
    </div>
  );
}

export default App;
