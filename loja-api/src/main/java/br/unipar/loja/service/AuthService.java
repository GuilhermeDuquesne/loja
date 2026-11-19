package br.unipar.loja.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import br.unipar.loja.dto.LoginRequest;
import br.unipar.loja.dto.LoginResponse;
import br.unipar.loja.repository.UsuarioRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UsuarioRepository usuarios;
    private final PasswordEncoder passwords;
    private final JwtEncoder jwtEncoder;

    public AuthService(UsuarioRepository usuarios, PasswordEncoder passwords, JwtEncoder jwtEncoder) {
        this.usuarios = usuarios;
        this.passwords = passwords;
        this.jwtEncoder = jwtEncoder;
    }

    public LoginResponse login(LoginRequest request) {
        if (request == null || request.usuario() == null || request.senha() == null) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        // procura o usuário e confere a senha (BCrypt)
        var usuario = usuarios.findByUsuario(request.usuario())
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));
        if (!passwords.matches(request.senha(), usuario.getSenha())) {
            throw new BadCredentialsException("Credenciais inválidas");
        }

        // o perfil (ADMIN ou COMUM) vai dentro do token, na claim "perfil"
        var now = Instant.now();
        var claims = JwtClaimsSet.builder()
                .subject(usuario.getUsuario())
                .claim("perfil", usuario.getPerfil().name())
                .expiresAt(now.plus(60, ChronoUnit.MINUTES))
                .build();
        var header = JwsHeader.with(MacAlgorithm.HS256).build();
        var token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new LoginResponse(token, "Bearer", 3600, usuario.getUsuario(), usuario.getPerfil().name());
    }
}
