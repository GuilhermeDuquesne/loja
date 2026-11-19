package br.unipar.loja.dto;

import br.unipar.loja.model.Usuario;

public record UsuarioResponse(Long id, String nome, String usuario, String perfil) {

    public static UsuarioResponse de(Usuario usuario) {
        return new UsuarioResponse(usuario.getId(),
                                   usuario.getNome(),
                                   usuario.getUsuario(),
                                   usuario.getPerfil().name());
    }
}
