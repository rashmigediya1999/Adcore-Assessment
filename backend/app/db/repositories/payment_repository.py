from typing import List

from bson import ObjectId
from app.db.mongodb import MongoDB
from app.core.config import settings
from app.models.payment import Payment
from pymongo.errors import PyMongoError


class PaymentRepository:
    def __init__(self):
        collection_name = settings.config["mongodb"]["database"]
        self.collection = MongoDB.db[collection_name]

    async def get_payments(self, skip: int = 0, limit: int = 50) -> List[dict]:
        payments = await self.collection.find().skip(skip).limit(limit).to_list(length=limit)
        return payments
    
    async def count_documents(self) -> int:
        return await self.collection.count_documents({})

    async def get_payment(self, payment_id: str) -> dict:
        result = await self.collection.find_one(
            {"_id": payment_id,}
        )

        return result
    
    async def update_payment(self, payment_id: str, update_data: dict) -> dict:
        result = await self.collection.find_one_and_update(
            {"_id": payment_id},
            {"$set": update_data},
            return_document=True
        )
        return result
    
    async def delete_payment(self, payment_id: str) -> dict:
        try:
            result = await self.collection.delete_one({"_id": payment_id,})
            if result.deleted_count == 0:
                raise ValueError("Payment not found")
            
            return {"status": "success", "message": "Payment deleted successfully"}
        except PyMongoError as e:
            raise ValueError(f"An error occurred while deleting the payment: {str(e)}")

    async def create_payment(self, payment_data: Payment) -> str:
        result = await self.collection.insert_one(payment_data)
        return str(result.inserted_id)
    
    async def upload_evidence(self, payment_id: str, file_data: bytes, filename: str) -> str:
        file_id = self.fs.put(file_data, filename=filename, payment_id=payment_id)
        await self.collection.update_one(
            {"_id": payment_id},
            {"$set": {"evidence_file_id": file_id}}
        )
        return str(file_id)

    async def download_evidence(self, file_id: str) -> bytes:
        file = self.fs.get(file_id)
        return file.read()