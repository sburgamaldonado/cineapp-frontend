import { environment } from './../../../environments/environment.prod';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DomSanitizer } from '@angular/platform-browser';
import { ClienteService } from './../../_service/cliente.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: string;
  perfil: string;
  imagenData: any;
  imagenEstado: boolean = false;

  constructor(private clienteService: ClienteService, private sanitization: DomSanitizer) { }

  ngOnInit() {
    const helper = new JwtHelperService();

    const TOKEN = JSON.parse(sessionStorage.getItem(environment.TOKEN_NAME));
    const decodedToken = helper.decodeToken(TOKEN.access_token);
    this.usuario = decodedToken.user_name;
    this.perfil = decodedToken.authorities.join('-');

    this.clienteService.listarPorId(TOKEN.id_usuario).subscribe(data => {
      if (data.size > 0) {
        this.convertir(data);
      }
    });

  }

  convertir(data: any) {
    let reader = new FileReader();
    reader.readAsDataURL(data);
    reader.onloadend = () => {
      let base64 = reader.result;      
      //this.imagenData = base64;      
      this.setear(base64);
    }
  }

  setear(x: any) {
    this.imagenData = this.sanitization.bypassSecurityTrustResourceUrl(x);
    this.imagenEstado = true;
  }

}
