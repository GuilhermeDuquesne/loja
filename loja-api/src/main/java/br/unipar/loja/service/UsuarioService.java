package br.unipar.loja.service;

import br.unipar.loja.dto.UsuarioRequest;
import br.unipar.loja.dto.UsuarioResponse;
import br.unipar.loja.model.Perfil;
import br.unipar.loja.model.Usuario;
import br.unipar.loja.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarios;
    private final PasswordEncoder passwords;

    public UsuarioService(UsuarioRepository usuarios, PasswordEncoder passwords) {
        this.usuarios = usuarios;
        this.passwords = passwords;
    }

    // Quem se cadastra pela API sempre vira COMUM. O ADMIN é criado em DadosIniciais.
    public UsuarioResponse criar(UsuarioRequest request) {
        if (request == null || vazio(request.nome()) ||
                vazio(request.usuario()) || vazio(request.senha())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nome, usuário e senha são obrigatórios");
        }
        if (usuarios.existsByUsuario(request.usuario())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Nome de usuário já cadastrado");
        }
        var usuario = new Usuario(request.nome(), request.usuario(),
                                  passwords.encode(request.senha()), Perfil.COMUM);
        return UsuarioResponse.de(usuarios.save(usuario));
    }

    private boolean vazio(String valor) {
        return valor == null || valor.isBlank();
    }
}
