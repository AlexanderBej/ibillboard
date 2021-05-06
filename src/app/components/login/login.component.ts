import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from 'src/app/employee';
import { EMPLOYEES } from 'src/app/list-of-employees';
import { DataCommunicationService } from 'src/app/_services/data-communication.service';
import { ToastsService } from 'src/app/_services/toasts.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  invalidUsername: boolean = false
  invalidPassword: boolean = false
  
  pass: string = 'password'; // password input
  admin: string = "admin";  // admin input
  
  allUsers = EMPLOYEES

  hide = true;  // used for hide | unhide password
  
  displayedUsername: string = ''
  
  loginForm: FormGroup;

  constructor(public loginDialog: NgbActiveModal, private fb: FormBuilder, private toasts: ToastsService, private data: DataCommunicationService) {
    this.loginForm = fb.group({
      "username": ["", Validators.required],
      "password": ["", Validators.required],
    })
  }


  ngOnInit(): void {
    this.displayedUsername = this.allUsers[this.randomNumber(0, this.allUsers.length - 1)].username
    // displayed username in the 'Hints' section of the modal 
  }

/*
 * Used for the username display called in ngOnInit
 *   @param min is 0
 *   @param max is the length of the EMPLOYEES array - 1
 */
  randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


  /*
  * Getters for the loginForm values
  */ 
  get username() {
    return this.loginForm?.get("username")
  }

  get password() {
    return this.loginForm?.get("password")
  }


  closeDialog() {
    this.loginDialog.close()
  }

  logIn() {
    if (this.loginForm.invalid) { // check if the form is invalid, if so, return
      if (this.username?.invalid) this.toasts.showError("Username input is missing")
      if (this.password?.invalid) this.toasts.showError("Password input is missing")
      return
    }

    if (this.password?.value != this.pass) { // check password
      this.toasts.showError("Wrong password!")
      return
    }

    if (this.username?.value != this.admin) { // check if admin, if not, check username
      for (let user of this.allUsers) {
        if (this.username?.value === user?.username) {
          this.data.setLoggedUser(false, user) // if username is found, set it in service 
          this.toasts.showSuccess("Welcome " + this.username?.value + "! :)")
          this.loginDialog.close() 
          return // close dialog and exit function
        }
      }
      this.toasts.showError("Wrong username!") // if it's neither admin nor username
      return 
    } else { // if it's admin
      this.data.setLoggedUser(true, undefined)
      this.toasts.showSuccess("Welcome, admin! :)")
      this.loginDialog.close();
    }
  }
}
