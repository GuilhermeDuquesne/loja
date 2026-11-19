package br.unipar.loja.controller;

import br.unipar.loja.dto.UsuarioRequest;
import br.unipar.loja.dto.UsuarioResponse;
import br.unipar.loja.service.UsuarioService;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    private final UsuarioService usuarios;

    public UsuarioController(UsuarioService usuarios) {
        this.usuarios = usuarios;
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> criar(@RequestBody UsuarioRequest request) {
        var criado = usuarios.criar(request);
        return ResponseEntity.created(URI.create("/usuarios/" + criado.id())).body(criado);
    }
}
