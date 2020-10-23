import { Component, OnInit } from "@angular/core";
import { PubsubService } from "../pubsub.service";
import { Plugins } from "@capacitor/core";
const { Share } = Plugins;

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.scss"],
})
export class InvoiceComponent implements OnInit {
  i = 0;
  editId: string | null = null;
  listOfData: ItemData[] = [];

  constructor(private pubsub: PubsubService) {}
  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.calculateTotal();
    this.editId = "null";
  }

  total = 0;
  calculateTotal() {
    this.total = 0;
    this.listOfData.forEach((d) => {
      this.total += d.unitPrice * d.quantity;
    });
  }

  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: `${this.i}`,
        quantity: 1234,
        description: "32",
        unitPrice: 100,
      },
    ];
    this.i++;
  }

  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter((d) => d.id !== id);
  }

  ngOnInit(): void {
    this.pubsub.$pub("HEADING", { heading: "Invoice" });
    this.addRow();
    this.addRow();
  }
}

interface ItemData {
  id: string;
  quantity: number;
  description: string;
  unitPrice: number;
}
