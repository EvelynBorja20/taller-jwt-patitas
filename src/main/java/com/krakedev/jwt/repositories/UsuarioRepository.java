package com.krakedev.jwt.repositories;

import com.krakedev.jwt.entidades.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UsuarioRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void guardar(Usuario usuario) {
        String sql = "INSERT INTO usuarios (username, password, rol) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, usuario.getUsername(), usuario.getPassword(), usuario.getRol());
    }

    public Usuario buscarPorUsername(String username) {
        String sql = "SELECT id, username, password, rol FROM usuarios WHERE username = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Usuario.class), username);
        } catch (EmptyResultDataAccessException e) {
            return null; // Retorna nulo si no encuentra el usuario
        }
    }
}
