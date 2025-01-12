import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root', // Makes the service available globally
})
export class PaymentService {

  private apiUrl = 'http://127.0.0.1:8000/api/v1'; // Replace with your API URL
  
  constructor(private http: HttpClient) { }

  // Get payments with pagination
  getPayments(page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.apiUrl}/payments/?page=${page}&page_size=${pageSize}`;
    return this.http.get<any>(url);
  }

  // Fetch a single payment by ID
  getPaymentById(paymentId: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/payment/${paymentId}`);
  }

  // Update payment
  updatePayment(paymentId: string | number, payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.apiUrl}/payment/${paymentId}`, payment);
  }
  

  // Create a new payment
  addPayment(payment: Payment): Observable<Payment> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  
    return this.http.post<Payment>(`${this.apiUrl}/payment`, payment, { headers });
  }

  // Delete a payment
  deletePayment(paymentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/payment/${paymentId}`);
  }
}
