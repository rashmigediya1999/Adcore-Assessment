import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Payment } from '../../models/payment.model';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.scss'],
})
export class ViewPaymentComponent implements OnInit {
  paymentId: string | null = null;
  payment: Payment | null = null;
  editMode: boolean = false; // Flag to toggle between view and edit modes
  // Mock data; replace with an API call
  mockPayments: Payment[] = [
    {
      _id: '1',
      payee_first_name: 'John',
      payee_last_name: 'Doe',
      payee_payment_status: 'due_now',
      payee_added_date_utc: 1706803200, // Example Unix timestamp
      payee_due_date: '2025-01-20',
      payee_address_line_1: '123 Main Street',
      payee_address_line_2: 'Apt 4B',
      payee_city: 'New York',
      payee_country: 'USA',
      payee_province_or_state: 'NY',
      payee_postal_code: '10001',
      payee_phone_number: '+1234567890',
      payee_email: 'john.doe@example.com',
      currency: 'USD',
      discount_percent: 5, // Discount percent, e.g., 5%
      tax_percent: 10, // Tax percent, e.g., 10%
      due_amount: 100,
      total_due: 105, // Calculated server-side
      evidence_file_url: "",
      due_date: '2025-01-20'
    },
    {
      _id: '2',
      payee_first_name: 'Jane',
      payee_last_name: 'Smith',
      payee_payment_status: 'pending',
      payee_added_date_utc: 1706803200, // Example Unix timestamp
      payee_due_date: '2025-01-25',
      payee_address_line_1: '456 Oak Avenue',
      payee_address_line_2: '',
      payee_city: 'Los Angeles',
      payee_country: 'USA',
      payee_province_or_state: 'CA',
      payee_postal_code: '90001',
      payee_phone_number: '+1234567891',
      payee_email: 'jane.smith@example.com',
      currency: 'USD',
      discount_percent: null, // No discount applied
      tax_percent: 8, // Tax percent, e.g., 8%
      due_amount: 200,
      total_due: 216, // Calculated server-side
      evidence_file_url: "",
      due_date: '2025-01-20'
    },
    {
      _id: '3',
      payee_first_name: 'Alice',
      payee_last_name: 'Johnson',
      payee_payment_status: 'completed',
      payee_added_date_utc: 1706803200, // Example Unix timestamp
      payee_due_date: '2024-12-31',
      payee_address_line_1: '789 Pine Road',
      payee_address_line_2: 'Suite 12',
      payee_city: 'Chicago',
      payee_country: 'USA',
      payee_province_or_state: 'IL',
      payee_postal_code: '60601',
      payee_phone_number: '+1234567892',
      payee_email: 'alice.johnson@example.com',
      currency: 'USD',
      discount_percent: 15, // Discount percent, e.g., 15%
      tax_percent: 7, // Tax percent, e.g., 7%
      due_amount: 300,
      total_due: 290, // Calculated server-side
      evidence_file_url: "",
      due_date: '2025-01-20'
    },
  ];
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    this.paymentId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.paymentId) {
      this.fetchPaymentDetails();
    }
  }

  fetchPaymentDetails(): void {
    if (this.paymentId) {
      this.payment = this.mockPayments.find(p => p._id == this.paymentId) || null;
    }
    // Fetch payment details from the service
    // this.paymentService.getPaymentById(this.paymentId).subscribe((data) => {
    //   this.payment = data;
    // });
  }
  
  // Method to navigate back to the list page
  onBackToList() {
    this.router.navigate(['/payments']);
  }

  // Method to toggle edit mode
  onEdit(): void {
    this.editMode = !this.editMode;
  }

  onSavePayment(): void {
    if (this.payment && this.paymentId) {
      const paymentIdNumber = this.paymentId; // Convert string to number     
        this.paymentService.updatePayment(paymentIdNumber, this.payment).subscribe(
          (response) => {
            console.log('Payment updated successfully!', response);
            this.router.navigate(['/payments']);
          },
          (error) => {
            console.error('Error updating payment:', error);
          }
        );
     
    }
  }


  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  
}
