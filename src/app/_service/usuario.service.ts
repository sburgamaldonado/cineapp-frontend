import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Usuario } from '../_model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url: string = `${environment.HOST}/usuarios`;  
  //url: string = `${environment.HOST}/${environment.MICRO_CR}/usuarios`;  
  
  constructor(private http: HttpClient) { }

  registrar(usuario: Usuario, file?: File) {
    let formdata: FormData = new FormData();
    formdata.append('file', file);

    const usuarioBlob = new Blob([JSON.stringify(usuario)], { type: "application/json" });
    formdata.append('usuario', usuarioBlob);

    return this.http.post(this.url, formdata);
  }

  listarPorId(id: number) {
    return this.http.get<Usuario>(`${this.url}/${id}`);
  }
  
  cambiarclave(usuario: Usuario) {
    return this.http.put(`${this.url}`, usuario);
  }

}
