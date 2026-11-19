import { HttpErrorResponse } from '@angular/common/http';

//Transforma o erro devolvido pela API em uma mensagem clara para o usuário
export function mensagemDeErro(erro: unknown): string {
    if (erro instanceof HttpErrorResponse) {
        if (erro.status === 0) return 'Não foi possível conectar à API. Verifique se o backend está rodando.';
        if (erro.status === 401) return 'Você precisa fazer login (401).';
        if (erro.status === 403) return 'Você não tem permissão para esta operação (403).';

        //O backend devolve { "mensagem": "..." } nos erros 400, 404 e 409
        const mensagem = erro.error?.mensagem;
        if (mensagem) return mensagem;

        if (erro.status === 400) return 'Dados inválidos (400).';
        if (erro.status === 404) return 'Registro não encontrado (404).';
        if (erro.status === 409) return 'Operação não permitida (409).';
    }
    return 'Erro inesperado. Tente novamente.';
}
