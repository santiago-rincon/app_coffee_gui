import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FireBaseCodeErrorService {
  constructor() {}
  codeErrors(code: string): string {
    switch (code) {
      //---REGISTER CASE--- //
      //Correo Registrado
      case 'auth/email-already-in-use':
        return 'El usuario ya se encuentra registrado';
      //Contraseña Debil
      case 'auth/weak-password':
        return 'Contraseña debil, recuerda que debe contener mas de 6 caracteres';
      //Correo Invalido
      case 'auth/invalid-email':
        return 'La dirección de correo electrónico no es valida';
      case 'auth/internal-error':
        //Campos vacios
        return 'Completa todos los campos del formulario';
      //---REGISTER CASE--- //
      //Contraseña Incorrecta
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      // Correo no registrado
      case 'auth/user-not-found':
        return 'El correo no se encunetra registrado';
      //Muchos intentos
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos de iniciar sesión';
      //Se cerro la ventana emergente de google
      case 'auth/popup-closed-by-user':
        return 'La ventana emergente para la autenticación fue cerrada, intenta de nuevo';
      // Dominio no autorizado
      case 'auth/unauthorized-domain':
        return 'Este dominio no se encuentra autorizado, inicia sesión con correo y contraseña'
      //Otros Errores
      default:
        return 'Error desconocido';
    }
  }
}
