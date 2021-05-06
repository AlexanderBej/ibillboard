import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Employee } from 'src/app/employee';
import { EMPLOYEES } from 'src/app/list-of-employees';
import { DataCommunicationService } from 'src/app/_services/data-communication.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  options: any = { // options for dialog
    size: "dialog-centered"
  };

  isUserLogged: boolean = false;
  isAdminLogged: boolean = false;
  user: Employee | undefined

  constructor(private modalService: NgbModal, private data: DataCommunicationService) {
    data.getLoggedUser().subscribe(data => { // get user from service
      if (data && (data.admin === true || data.user != undefined)) {
        this.isAdminLogged = data.admin
        this.user = data.user
        this.isUserLogged = true
      } else this.isUserLogged = false
    })
  }

  ngOnInit(): void {
  }


  /*
  * Opens Login dialog
  * if login is successful, set logged user in data service
  */ 
  openLoginDialog() {
    this.modalService.open(LoginComponent, this.options).result.then(result => {
      this.isUserLogged = true
      this.data.getLoggedUser().subscribe(data => {
        if (data.admin === true) {
          this.isAdminLogged = true
        } else this.user = data.user
      })
    },
      reason => {
        console.log(reason);
      })
  }


  updateUser() {
    this.data.getLoggedUser().subscribe(data => {
      if (data.admin === true) {
        this.isAdminLogged = true
      } else this.user = data.user
    })
    console.log(EMPLOYEES);
    
    console.log(this.user);
    
  }


  /*
  * empty all parameters regarding users
  * set values in data service as well
  */ 
  logout() {
    this.isUserLogged = false
    this.isAdminLogged = false
    this.user = undefined
    this.data.setLoggedUser(false, undefined)
  }
}
