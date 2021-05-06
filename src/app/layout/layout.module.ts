import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import {MatTableModule} from '@angular/material/table';
import { ToastComponent } from '../components/toast/toast.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterEmployeePipe } from './filter-employee.pipe';
import { HighlightDirective } from './highlight.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { LoginComponent } from '../components/login/login.component';
import {MatIconModule} from '@angular/material/icon';
import {ClipboardModule} from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    LayoutComponent,
    ToastComponent,
    FilterEmployeePipe,
    HighlightDirective,
    NavbarComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ClipboardModule
  ],
})
export class LayoutModule { }
