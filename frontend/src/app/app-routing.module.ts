import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './features/payments/components/list/list.component';
import { ViewPaymentComponent } from './features/payments/components/view-payment/view-payment.component';
import { AddPaymentComponent } from './features/payments/components/add-payment/add-payment.component';
// import { MainComponent } from './features/payments/main/main.component';
// import { AddComponent } from './features/payments/add/add.component';
// import { EditComponent } from './features/payments/edit/edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/payments', pathMatch: 'full' }, // Redirect to MainComponent
  { path: 'payments', component: ListComponent },
  { path: 'payments/add', component: AddPaymentComponent },
  { path: 'payments/:id', component: ViewPaymentComponent},
 
  // { path: 'payments/edit/:id', component: EditComponent }, // :id is a route parameter
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
