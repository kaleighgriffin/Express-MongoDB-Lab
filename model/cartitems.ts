import { ObjectId } from "mongodb";

export default interface CartItems {
    _id?: ObjectId;
    product: string;
    price: number;
    quantity: number;
}