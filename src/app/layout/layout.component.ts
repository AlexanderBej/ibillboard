import { Component, OnInit, ViewChild } from '@angular/core';
import { EMPLOYEES } from '../list-of-employees';
import { IbillboardService } from '../_services/ibillboard.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddNewEmployeeComponent } from '../add-new-employee/add-new-employee.component';
import { MatTable } from '@angular/material/table';
import { ToastsService } from '../_services/toasts.service';
import { FilterEmployeePipe } from './filter-employee.pipe';
import { DataCommunicationService } from '../_services/data-communication.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  isAdminLogged: boolean = false;
  loggedEmployee: any = null

  allEmployees = EMPLOYEES
  searchText = ''; // used for search input

  showReq: boolean = false

  // filetr pipe used for search
  filterPipe: FilterEmployeePipe = new FilterEmployeePipe()
  filteredEmployees: any[] = [] 
  
  modalReference: NgbModalRef | undefined;
  options: any = { // options for ngbModal
    size: "dialog-centered"
  };
  
  // Material Table
  @ViewChild(MatTable) table: MatTable<any> | undefined;
  displayedColumns: string[] = ['id', 'name', 'surname', 'position', 'date', 'actions'];
  dataSource: any = null // data for mat-table

  constructor(private modalService: NgbModal, private data: DataCommunicationService, private toastService: ToastsService) {
    data.getLoggedUser().subscribe(data => { // get user from service
      if (data && (data.admin === true || data.user != undefined)) {
        this.isAdminLogged = data.admin
        this.loggedEmployee = data.user
      } 
    })
  }

  ngOnInit(): void {
    this.dataSource = EMPLOYEES; 
  }


  /*
  * Used in ngModelChange for search functionality 
  *   @param $event is used to filter employees through a pipe which are then 
  *     fed back to the table
  */ 
  modelChangeFn($event: any) {
    this.filteredEmployees = this.filterPipe.transform(this.allEmployees, $event)
    this.dataSource = this.filteredEmployees
    this.table?.renderRows();
  }

  /*
  * Opens a modal AddNewEmployeeComponent with the flag isEditedByAdmin set to true
  *   @param $element is the employee
  * If the event is successful updateEmployeeList is called to update the table
  */ 
  editEmployee(element: any) {
    if (!this.isAdminLogged) { // check if admin is logged
      this.toastService.showError("You are not authorized to perform this action!")
      return
    }
    this.modalReference = this.modalService.open(AddNewEmployeeComponent, this.options);
    this.modalReference.componentInstance.employeeToEdit = element
    this.modalReference.componentInstance.isEditedByAdmin = true
    this.modalReference.result.then(result => {
      this.updateEmployeeList()
    }, reason => {
    });
  }


   /*
  * Opens a modal AddNewEmployeeComponent from and employee
  *   @param $element is the employee
  * If the event is successful updateEmployeeList is called to update the table
  */
  editPosition(element: any) {   
    this.modalReference = this.modalService.open(AddNewEmployeeComponent, this.options);
    this.modalReference.componentInstance.employeeToEdit = element
    this.modalReference.result.then(result => {
      this.updateEmployeeList() 
      this.allEmployees.forEach(emp => { // search for modified object in array
        if(emp.id === element.id) {
          this.data.setLoggedUser(false, emp) // set logged user with new information
        }
      });
    }, reason => {
      console.log(reason);
    });
  }



   /*
  *  Deletes the 'employee' object from EMPLOYEES array
  *   @param $element is the employee
  * If the event is successful updateEmployeeList is called to update the table
  * then the employee is logged out
  */
  leaveCompany(element: any) {
    EMPLOYEES.forEach((ely, index) => {
      if (ely.id === element.id) EMPLOYEES.splice(index, 1);
    });
    this.updateEmployeeList()
    this.loggedEmployee = null
    this.data.setLoggedUser(false, undefined)
  }


  /*
  * called to update the employee table
  */ 
  updateEmployeeList() {
    this.dataSource.data = EMPLOYEES
    this.table?.renderRows();
  }


 /*
  * Opens a modal AddNewEmployeeComponent
  * If the event is successful updateEmployeeList is called to update the table
  */ 
  addEmployee() {
    this.modalService.open(AddNewEmployeeComponent, this.options).result.then(result => {
      this.updateEmployeeList()
    }, reason => {
      console.log(reason);      
    });
  }
}
