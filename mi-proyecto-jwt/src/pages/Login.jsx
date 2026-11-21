import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.text();

      if (response.ok) {
        localStorage.setItem('token', data);
        navigate('/perfil');
      } else {
        setError(data || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        {error && <div className="alerta alerta-error">{error}</div>}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-username">Usuario</label>
            <input
              id="login-username"
              type="text"
              placeholder="Tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Ingresar
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿No tienes una cuenta? <Link to="/registrar">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;