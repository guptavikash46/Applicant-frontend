import { Component, OnInit, ViewChild, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RestRequestsService } from './http/rest-requests.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'applicant-frontend';
  nameVal ='';
  familyNameVal = '';
  addressVal = '';
  countryVal = '';
  emailVal = '';
  ageVal:number;
  hiredVal:boolean;
  lengthOfArray: Number = 0;
  formSubmitStatus:Boolean = false;
  //below variables are used for response recieved from an HTTP request
  invalidCountryError = '';
  errorTitles = [];
  successMessage = '';
  @ViewChild("f", {static: true}) applicantForm: NgForm;

  constructor(private restService: RestRequestsService){}
  ngOnInit(){
    console.log(this.applicantForm);
    this.restService.initializeArray();
    this.restService.formsubmitVal();
    this.restService.updateInvalidCountryStatus();
    this.restService.checkArrayLength.subscribe(
      len =>{
        this.lengthOfArray = len;
      }
    );
    this.restService.formSubmittedStatus.subscribe(
      val => {
        this.formSubmitStatus = val;
      }
    );
    this.restService.invalidCountryUpdate.subscribe(
      errorVal => {
        this.invalidCountryError = errorVal;
      }
    );

  }

  onAddApplicant(formData: NgForm){
    //making a post request
    this.restService.makePostRequest(this.nameVal, this.familyNameVal, this.addressVal, this.countryVal, this.emailVal,
      this.ageVal, this.hiredVal).subscribe(
        (data: any) => {
          this.successMessage = data.message;
          this.restService.checkArrayLength.next(0);
          this.restService.formSubmittedStatus.next(true);
          this.restService.invalidCountryUpdate.next('');
          this.errorTitles = []
        },
        error => {
          this.errorTitles = [];
          this.restService.invalidCountryUpdate.next(error.error.message);
          if(error.error.message == null){
            this.restService.invalidCountryUpdate.next("Looks like the backend service is not running.");
          }
          console.log(this.invalidCountryError);
          if(error.error.subErrors != null){
            for(let er of error.error.subErrors){
              this.errorTitles.push(er['message']);
              }
          }
          this.restService.formSubmittedStatus.next(false);
          this.restService.checkArrayLength.next(this.errorTitles.length);
        },
        () => {
          console.log('request completed');
        }
      );
  }
  onReset(){
    this.restService.checkArrayLength.next(0);
    this.restService.invalidCountryUpdate.next('');
    this.restService.formSubmittedStatus.next(false);
    this.nameVal = '';
    this.familyNameVal = '';
    this.addressVal = '';
    this.countryVal = ''
    this.emailVal = ''
    this.ageVal = null;
    this.hiredVal = null;
    
    
  }
}
