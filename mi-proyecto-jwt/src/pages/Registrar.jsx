import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/apiConfig';

const Registrar = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('USER');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    setCargando(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          rol,
        }),
      });

      const data = await response.json().catch(() => null);
      const textoPlano = !data ? await response.text().catch(() => '') : '';

      if (response.status === 201 || response.ok) {
        setMensaje({
          texto: (data && data.mensaje) || textoPlano || '¡Usuario registrado exitosamente! Redirigiendo al login...',
          tipo: 'exito',
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMensaje({
          texto: (data && (data.mensaje || data.error)) || textoPlano || 'Error al registrar. El usuario quizá ya existe.',
          tipo: 'error',
        });
      }
    } catch (error) {
      setMensaje({
        texto: 'Error de conexión con el servidor. Verifica que Spring Boot esté encendido.',
        tipo: 'error',
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Crear Cuenta</h2>
          <p>Regístrate para acceder al sistema</p>
        </div>

        {mensaje.texto && (
          <div className={`alerta ${mensaje.tipo === 'exito' ? 'alerta-exito' : 'alerta-error'}`}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario</label>
            <input
              id="username"
              type="text"
              placeholder="Ej: usuario123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rol">Rol en el sistema</label>
            <select
              id="rol"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            >
              <option value="USER">USER (Usuario)</option>
              <option value="ADMIN">ADMIN (Administrador)</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registrar;