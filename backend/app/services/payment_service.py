from datetime import date
from typing import  Optional
from datetime import datetime
from app.models.schemas.pagination_payment_response import PaginatedPaymentResponse
from app.core.config import settings
from app.models.payment import Payment
from app.db.repositories.payment_repository import PaymentRepository
from app.models.payment_status import PaymentStatus


class PaymentService:
    def __init__(self):
        self.repository = PaymentRepository()

    async def get_payments(
        self,
        page: int = 1,
        page_size: int = 50,
        search: Optional[str] = None,
        filters: Optional[dict] = None
    ) -> PaginatedPaymentResponse:
        # Build query based on filters
        # Calculate pagination
        try:
            skip = (page - 1) * page_size
            
             # Build query based on filters and search
            query = {}
            if search:
                query["$or"] = [
                    {"payee_first_name": {"$regex": search, "$options": "i"}},
                    {"payee_last_name": {"$regex": search, "$options": "i"}},
                    {"payee_email": {"$regex": search, "$options": "i"}}
                ]
            if filters:
                query.update(filters)

            # Get total count for pagination
            total_count = await self.repository.count_documents()

            # Get paginated results
            payments = await self.repository.get_payments(skip=skip, limit=page_size)
            
            # Process payments
            today = datetime.now().date()
            for payment in payments:
                due_date = datetime.strptime(payment["payee_due_date"], '%Y-%m-%dT%H:%M:%SZ').date()
                if due_date == today:
                    payment["payee_payment_status"] = PaymentStatus.DUE_NOW
                elif due_date < today:
                    payment["payee_payment_status"] = PaymentStatus.OVERDUE
                
                discount = payment.get("discount_percent", 0) / 100
                tax = payment.get("tax_percent", 0) / 100
                due_amount = payment["due_amount"]
                payment["total_due"] = due_amount * (1 - discount) * (1 + tax)


            # Calculate pagination metadata
            total_pages = (total_count + page_size - 1) // page_size
            has_next = page < total_pages
            has_previous = page > 1

            return PaginatedPaymentResponse(
                items=[Payment(**payment) for payment in payments],
                total=total_count,
                page=page,
                page_size=page_size,
                total_pages=total_pages,
                has_next=has_next,
                has_previous=has_previous
            )
        except Exception as e:
            print(e)

    async def get_payment(self, payment_id: str) -> Payment:
        print(payment_id)
        payment = await self.repository.get_payment(payment_id)
        print(payment)
        if not payment:
            raise ValueError("Payment not found")
        return Payment(**payment)
    
    async def update_payment(self, payment_id: str, update_data: dict) -> Payment:
        updated_payment = await self.repository.update_payment(payment_id, update_data)
        if not updated_payment:
            raise ValueError("Payment not found")
        return Payment(**updated_payment)
    
    async def delete_payment(self, payment_id: str) -> dict:
        result = await self.repository.delete_payment(payment_id)
        if result["status"] == "error":
            raise ValueError(result["message"])
        return result

    async def create_payment(self, payment_data: Payment) -> str:
        payment_id = await self.repository.create_payment(payment_data)
        return payment_id


    async def upload_evidence(self, payment_id: str, file_data: bytes, filename: str) -> str:
        file_id = await self.repository.upload_evidence(payment_id, file_data, filename)
        return file_id

    async def download_evidence(self, file_id: str) -> bytes:
        file_data = await self.repository.download_evidence(file_id)
        return file_data