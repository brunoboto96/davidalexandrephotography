import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styleUrls: ['./email-modal.component.css']
})


export class EmailModalComponent implements OnInit {
  form: FormGroup;


  @ViewChild('closeModal', { static: false }) closeModal: ElementRef

  private _success = new BehaviorSubject<string>('Email Sent! Thank you =)');
  private _failed = new BehaviorSubject<string>('Something went wrong!');
  successMessage: string;
  failedMessage: string;



  constructor(public fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      subject: [''],
      body: ['']
    })
  }


  ngOnInit() {
  }

  sendEmail() {

    var formData: any = new FormData();
    formData.append("name", this.form.get('name').value);
    formData.append("email", this.form.get('email').value);
    formData.append("subject", this.form.get('subject').value);
    formData.append("body", this.form.get('body').value);

    let formObj = this.form.getRawValue() // {name: '', description: ''}
    let serializedForm = JSON.stringify(formObj);


    this.http.post('http://localhost:3000/api/sendmail', serializedForm).toPromise().then(data => {
      console.log('succes', data);
      this._success.subscribe((message) => this.successMessage = message);
      this._success.pipe(
        debounceTime(3000)
      ).subscribe(() => {
        this.successMessage = null;
        this.closeModal.nativeElement.click();
      });
    }, error => {
      console.log('oops', error);
      this._failed.subscribe((message) => this.failedMessage = message);
      this._failed.pipe(
        debounceTime(3000)
      ).subscribe(() => {
        this.failedMessage = null;
      });
    });

  }
}
