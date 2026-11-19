import { Injectable, signal } from '@angular/core';

//Guarda a mensagem de sucesso ou de erro que aparece no topo da tela
@Injectable({ providedIn: 'root'})
export class MensagemService {
    texto = signal<string | null>(null);
    tipo = signal<'sucesso' | 'erro'>('sucesso');
    private temporizador: ReturnType<typeof setTimeout> | undefined;

    sucesso(texto: string) {
        this.mostrar(texto, 'sucesso');
    }

    erro(texto: string) {
        this.mostrar(texto, 'erro');
    }

    limpar() {
        this.texto.set(null);
    }

    private mostrar(texto: string, tipo: 'sucesso' | 'erro') {
        this.tipo.set(tipo);
        this.texto.set(texto);
        clearTimeout(this.temporizador);
        this.temporizador = setTimeout(() => this.limpar(), 6000);
    }
}
