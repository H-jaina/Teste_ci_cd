import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setAuthenticated }) {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const correctPassword = 'hajaina123';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthenticated(true);
      navigate('/');
    } else {
      alert("Mot de passe incorrect !");
    }
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;
