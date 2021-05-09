import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import {
  CreateOrderDto,
  OrderCreated,
  RazorpayVerification,
  RAZORPAY_VerificationType,
} from "../home/interfaces/global.interfaces";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  get WindowRef() {
    return window;
  }

  createOrder(createDto: CreateOrderDto) {
    return this.http.post<OrderCreated>(
      `${environment.apiUrl}/order/create`,
      createDto
    );
  }

  verifyAndCapturePayment(verificationDetails: RazorpayVerification) {
    return this.http.post<{ status: RAZORPAY_VerificationType }>(
      `${environment.apiUrl}/order/verify`,
      verificationDetails
    );
  }
}
