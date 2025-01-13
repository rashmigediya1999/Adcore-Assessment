import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss'],
})
export class AddPaymentComponent implements OnInit {
  paymentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      payee_first_name: ['', Validators.required],
      payee_last_name: ['', Validators.required],
      payee_due_date: ['', Validators.required],
      payee_address_line_1: ['', Validators.required],
      payee_address_line_2: [''],
      payee_city: ['', Validators.required],
      payee_province_or_state: [''],
      payee_country: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}$/)]],
      payee_postal_code: ['', Validators.required],
      payee_phone_number: ['', [Validators.required, Validators.pattern(/^\+[1-9]\d{1,14}$/)]],
      payee_email: ['', [Validators.required, Validators.email]],
      currency: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      discount_percent: ['', Validators.min(0)],
      tax_percent: ['', Validators.min(0)],
      due_amount: ['', [Validators.required, Validators.min(0)]],
    });
  }

  resetForm(): void {
    this.paymentForm.reset({
      payee_first_name: '',
      payee_last_name: '',
      payee_due_date: '',
      payee_address_line_1: '',
      payee_address_line_2: '',
      payee_city: '',
      payee_province_or_state: '',
      payee_country: '',
      payee_postal_code: '',
      payee_phone_number: '',
      payee_email: '',
      currency: '',
      discount_percent: '',
      tax_percent: '',
      due_amount: '',
    });

    // Mark all controls as pristine and untouched to clear validation errors
    Object.keys(this.paymentForm.controls).forEach(key => {
      this.paymentForm.get(key)?.markAsPristine();
      this.paymentForm.get(key)?.markAsUntouched();
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const paymentData = this.paymentForm.value;

      console.log('Payment data:', paymentData);

      // Call the service to add payment
      this.paymentService.addPayment(paymentData).subscribe(
        (response) => {
          // Handle success
          this.snackBar.open('Payment added successfully!', 'Close', { duration: 3000 });
          this.resetForm(); // Reset the form after successful submission
        },
        (error) => {
          // Handle error
          console.error('Error adding payment:', error);
          this.snackBar.open('Failed to add payment. Please try again.', 'Close', { duration: 3000 });
        }
      );
    } else {
      console.error('Form is invalid');
      this.snackBar.open('Please fix the errors in the form before submitting.', 'Close', { duration: 3000 });
    }
  }
}