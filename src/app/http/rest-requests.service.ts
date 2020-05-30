import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestRequestsService {
  errorTitles = [];
  successMessage = '';
  // formSubmitted = false;
  checkArrayLength = new Subject<Number>();
  formSubmittedStatus = new Subject<Boolean>();
  invalidCountryUpdate = new Subject<string>();
  constructor(private http: HttpClient) { }

  makePostRequest(name: string, familyName: string, address: string, country: string,
    email: string, age: number, hired: boolean){
      return this.http.post("http://localhost:8080/app/add-applicant?name="+name+"&familyName="+familyName+
      "&address="+address+"&countryOfOrigin="+country+"&emailAddress="+email+"&age="+age+"&hired="+hired,
      {      
        responseType: 'json',
      });
    }

    initializeArray(){
    this.checkArrayLength.next(0);
    }

    formsubmitVal(){
      this.formSubmittedStatus.next(true);
    }

    updateInvalidCountryStatus(){
      this.invalidCountryUpdate.next('');
    }
}
