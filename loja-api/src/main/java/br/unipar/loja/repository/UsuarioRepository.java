package br.unipar.loja.repository;

import br.unipar.loja.model.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsuario(String usuario);
    boolean existsByUsuario(String usuario);

}
