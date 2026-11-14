package com.krakedev.jwt.services;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.krakedev.jwt.entidades.Usuario;
import com.krakedev.jwt.repositories.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void registrarUsuario(Usuario usuario) {
        // Encriptar la contraseña mediante hash seguro usando BCrypt
        String hashedPassword = BCrypt.hashpw(usuario.getPassword(), BCrypt.gensalt());
        usuario.setPassword(hashedPassword);
        usuarioRepository.guardar(usuario);
    }

    public Usuario login(String username, String passwordPlano) {
        Usuario usuario = usuarioRepository.buscarPorUsername(username);
        if (usuario != null) {
            // Verifica si la contraseña ingresada coincide con el hash cifrado de la base de datos
            boolean matches = BCrypt.checkpw(passwordPlano, usuario.getPassword());
            if (matches) {
                return usuario;
            }
        }
        return null;
    }
}
