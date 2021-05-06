import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { AddNewEmployeeModule } from './add-new-employee/add-new-employee.module';
import { EditableModule } from '@ngneat/edit-in-place';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NoopAnimationsModule,
    LayoutModule,
    HttpClientModule,
    NgbModule,
    AddNewEmployeeModule,
    EditableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
