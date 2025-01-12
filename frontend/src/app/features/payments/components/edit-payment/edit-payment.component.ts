import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';  


@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss']
})

export class EditPaymentComponent implements OnInit {
  paymentForm!: FormGroup;
  paymentId: string = '';
  currentPaymentData: any;  // Store the current payment data

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,  
    private snackBar: MatSnackBar, 
    private activatedRoute: ActivatedRoute,  // Inject ActivatedRoute to get the URL parameters
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.paymentId = this.activatedRoute.snapshot.paramMap.get('id')!;  // Get the payment ID from the URL
    this.paymentForm = this.fb.group({
      payee_first_name: [{ value: '', disabled: true }],
      payee_last_name: [{ value: '', disabled: true }],
      payee_due_date: ['', Validators.required],
      payee_address_line_1: [{ value: '', disabled: true }],
      payee_address_line_2: [{ value: '', disabled: true }],
      payee_city: [{ value: '', disabled: true }],
      payee_country: [{ value: '', disabled: true }],
      payee_province_or_state: [{ value: '', disabled: true }],
      payee_postal_code: [{ value: '', disabled: true }],
      payee_phone_number: [{ value: '', disabled: true }],
      payee_email: [{ value: '', disabled: true }],
      currency: [{ value: '', disabled: true }],
      discount_percent: [{ value: '', disabled: true }],
      tax_percent: [{ value: '', disabled: true }],
      due_amount: ['', [Validators.required, Validators.min(0)]],
      due_date: ['', [Validators.required]],
      payee_payment_status: ['pending', Validators.required],
      evidence_file_url: ['', Validators.required],  // Evidence field for completed status
    });

    // Fetch the current payment data from the API
    this.paymentService.getPaymentById(this.paymentId).subscribe(
      (data) => {
        this.currentPaymentData = data;
        this.paymentForm.patchValue({
          payee_first_name: data.payee_first_name,
          payee_last_name: data.payee_last_name,
          payee_due_date: data.payee_due_date,
          payee_address_line_1: data.payee_address_line_1,
          payee_address_line_2: data.payee_address_line_2,
          payee_city: data.payee_city,
          payee_country: data.payee_country,
          payee_province_or_state: data.payee_province_or_state,
          payee_postal_code: data.payee_postal_code,
          payee_phone_number: data.payee_phone_number,
          payee_email: data.payee_email,
          currency: data.currency,
          discount_percent: data.discount_percent,
          tax_percent: data.tax_percent,
          due_amount: data.due_amount,
          due_date: data.due_date,
          payee_payment_status: data.payee_payment_status,
          evidence_file_url: data.evidence_file_url || '',
        });
      },
      (error) => {
        console.error('Error fetching payment data:', error);
        this.snackBar.open('Failed to fetch payment data. Please try again.', 'Close', { duration: 3000 });
      }
    );
  }

  // Form submission handler
  onSubmit(): void {
    if (this.paymentForm.valid) {
      const updatedPaymentData = this.paymentForm.value;

      // Check if the status is 'completed' and evidence is provided
      if (updatedPaymentData.status === 'completed' && !updatedPaymentData.evidence) {
        this.snackBar.open('Please upload evidence before changing the status to completed.', 'Close', { duration: 3000 });
        return;
      }

      // Call the service to update payment
      this.paymentService.updatePayment(this.paymentId, updatedPaymentData).subscribe(
        (response) => {
          console.log('Payment updated successfully:', response);
          this.snackBar.open('Payment updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/payments']); // Navigate to payments list or dashboard after successful update
        },
        (error) => {
          console.error('Error updating payment:', error);
          this.snackBar.open('Failed to update payment. Please try again.', 'Close', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Please fix the errors in the form before submitting.', 'Close', { duration: 3000 });
    }
  }
}
