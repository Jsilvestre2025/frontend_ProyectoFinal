import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-boton-personalizado',
  standalone: true,
  imports: [],
  templateUrl: './boton-personalizado.html',
  styleUrl: './boton-personalizado.css'
})
export class BotonPersonalizado {
  // Input signals con valores por defecto
  readonly texto = input('Botón');
  readonly tipo = input<'button' | 'submit'>('button');
  readonly deshabilitado = input(false);
  readonly cargando = input(false);
  readonly variante = input<'primary' | 'secondary' | 'danger'>('primary');
  
  // Output signal para el evento click
  readonly click = output<Event>();
  
  // Método para manejar el click
  onClick(event: Event) {
    if (!this.deshabilitado() && !this.cargando()) {
      this.click.emit(event);
    }
  }
}
