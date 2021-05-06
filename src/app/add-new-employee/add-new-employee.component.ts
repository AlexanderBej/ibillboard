import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EMPLOYEES } from '../list-of-employees';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Employee } from '../employee';
import { ToastsService } from '../_services/toasts.service';
import { IbillboardService } from '../_services/ibillboard.service';


// custom format for datePicker input
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'app-add-new-employee',
  templateUrl: './add-new-employee.component.html',
  styleUrls: ['./add-new-employee.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddNewEmployeeComponent implements OnInit {

  @Input() public employeeToEdit: Employee | undefined;
  @Input() public isEditedByAdmin: boolean = false; // if false, it's edited by employee

  employeeForm: FormGroup;
  employee: Employee | undefined // object used to save in EMPLOYEES array


  selectedDate: Date | undefined // used to convert to Date format
  startDate = new Date(1990, 0, 1); // start date for datePicker

  allWorkPositions: any[] = []


  constructor(public addDialog: NgbActiveModal, private fb: FormBuilder, private toastService: ToastsService, private _service: IbillboardService) {
    this.employeeForm = fb.group({
      "name": ["", Validators.required],
      "surname": ["", Validators.required],
      "position": ["", Validators.required],
      "birth": ["", Validators.required],
    })
  }

  ngOnInit(): void {
    this._service.getWorkPositions().subscribe(data => {
      this.allWorkPositions = data.positions
    })


    if (this.employeeToEdit) { // if this is edited
      if (this.isEditedByAdmin) { // by admin
        this.employeeForm = this.fb.group({
          name: [this.employeeToEdit?.name, Validators.required],
          surname: [this.employeeToEdit?.surname, Validators.required],
          position: [{ value: this.employeeToEdit?.workPosition, disabled: true }],  // disabled because admin can only edit name and surname
          birth: [{ value: new Date(this.employeeToEdit?.datOfBirth), disabled: true }],  // disabled because admin can only edit name and surname
        })

      }
      else { // edited by employee
        this.employeeForm = this.fb.group({
          name: [{ value: this.employeeToEdit?.name, disabled: true }], // disabled because employee can only edit work position
          surname: [{ value: this.employeeToEdit?.surname, disabled: true }], // disabled because employee can only edit work position
          position: [this.employeeToEdit?.surname, Validators.required],
          birth: [{ value: new Date(this.employeeToEdit?.datOfBirth), disabled: true }], // disabled because employee can only edit work position
        })

      }

    }
  }


  /*
 * Getters for the employeeForm values
 */
  get name() {
    return this.employeeForm.get("name")
  }

  get surname() {
    return this.employeeForm.get("surname")
  }

  get position() {
    return this.employeeForm.get("position")
  }

  get birth() {
    return this.employeeForm.get("birth")
  }


  closeDialog() {
    this.addDialog.close()
  }


  hireNewEmployee() {
    if (!this.employeeForm.valid) { // check if the form is invalid, if so, return
      if (!this.name?.valid) this.toastService.showError("Name input is missing")
      if (!this.surname?.valid) this.toastService.showError("Surname input is missing")
      if (!this.position?.valid) this.toastService.showError("Work position input is missing")
      if (!this.birth?.valid) this.toastService.showError("Date of birth input is missing")
      return
    }


    this.selectedDate = new Date(this.birth?.value) // convert the value to Date format
    let employeeName = this.name?.value
    let employeeSurname = this.surname?.value
    let employeeUsername = employeeName.split(' ').join('.').toLowerCase() + '.' + employeeSurname.split(' ').join('.').toLowerCase()
    // split every name from Name and Surname and join them with '.' to create a username

    this.employee = { // create the Employee object
      id: EMPLOYEES.length + 1,
      name: this.name?.value,
      surname: this.surname?.value,
      username: employeeUsername,
      workPosition: this.position?.value,
      datOfBirth: this.selectedDate?.toDateString()
    }

    if (this.employeeToEdit) { // check for new changes if edited by admin, return if there aren't any
      if (this.isEditedByAdmin &&
        (this.employee.name == this.employeeToEdit?.name &&
          this.employee.surname == this.employeeToEdit?.surname)) {
        this.toastService.showWarning("There are no changes detected!")
        return
      }

      // replace the employee in EMPLOYEES array with new data
      let someone = EMPLOYEES.find(x => x.id === this.employeeToEdit?.id)
      this.employee.id = this.employeeToEdit.id
      someone = this.employee
      EMPLOYEES[this.employeeToEdit.id - 1] = this.employee
      this.addDialog.close()
      // return if employee is edited
      return
    }

    EMPLOYEES.push(this.employee) // push new employee 
    this.addDialog.close()
  }
}
