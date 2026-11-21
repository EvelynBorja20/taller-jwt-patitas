import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

const Perfil = () => {
  const [infoPerfil, setInfoPerfil] = useState('Cargando perfil...');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${API_BASE_URL}/auth/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.text() : Promise.reject()))
      .then((data) => setInfoPerfil(data))
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Perfil de Usuario</h2>
          <p>{infoPerfil}</p>
        </div>
        <button onClick={cerrarSesion} className="btn-primary">
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Perfil;