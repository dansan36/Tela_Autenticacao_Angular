import { Injectable } from '@angular/core';
import { Observable,map, catchError,throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url:string='http://localhost:3000';

  constructor(
    private http:HttpClient,
    private router:Router
  ) { }

  public sign(payLoad:{email:string,password:string}):Observable<any>{
    return this.http.post<{token:string}>(`${this.url}/sign`,payLoad).pipe(
      map((data:any)=>{
        localStorage.removeItem('access_token')
        localStorage.setItem('access_token',JSON.stringify(data.token))
        this.router.navigate(['admin']);
        return console.log(data)
      }),
      catchError((err)=>{
        console.log(err)
        if (err.error.message)return throwError(()=>err.error.message);
        return throwError(()=>"No momento não estamos conseguindo validar estes dados ")

      })

    )}
    public logout(){
      localStorage.removeItem('access_token');
      return this.router.navigate(['']);
    }
    public isAuthenticaded():boolean{
      const token=localStorage.getItem('access_token');
      if(!token)return false;
      const jwtHelper = new JwtHelperService();
      return !jwtHelper.isTokenExpired(token);
    }
}




