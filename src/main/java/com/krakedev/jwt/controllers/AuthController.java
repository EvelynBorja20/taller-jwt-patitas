package com.krakedev.jwt.controllers;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.krakedev.jwt.entidades.Usuario;
import com.krakedev.jwt.services.UsuarioService;
import com.krakedev.jwt.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/registrar")
    public ResponseEntity<String> registrar(@RequestBody Usuario usuario) {
        usuarioService.registrarUsuario(usuario);
        return ResponseEntity.ok("Usuario registrado exitosamente.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Usuario usuario) {
        Usuario usuarioLogueado = usuarioService.login(usuario.getUsername(), usuario.getPassword());
        
        if (usuarioLogueado != null) {
            String token = jwtUtil.generarToken(usuarioLogueado.getUsername(), usuarioLogueado.getRol());
            // Retornamos el token en formato texto plano o JSON manual
            return ResponseEntity.ok("{\"token\": \"" + token + "\"}");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("{\"error\": \"Credenciales invalidas\"}");
        }
    }

    @GetMapping("/perfil")
    public ResponseEntity<String> obtenerPerfil(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token no proporcionado o formato invalido");
        }

        try {
            String token = authHeader.substring(7);
            DecodedJWT decodedJWT = jwtUtil.validarToken(token);
            
            String username = decodedJWT.getSubject();
            String rol = decodedJWT.getClaim("rol").asString();

            if ("ADMIN".equals(rol)) {
                return ResponseEntity.ok("¡Bienvenido al panel administrativo, Voluntario " + username + "!");
            } else {
                return ResponseEntity.ok("¡Hola " + username + "! Bienvenido a tu perfil de adoptante.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token invalido o expirado");
        }
    }
}