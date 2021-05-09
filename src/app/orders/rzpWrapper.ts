import { NgZone } from "@angular/core";
import { RazorpayVerification } from "../home/interfaces/global.interfaces";
import { RazorpayOption } from "./models/razorpay.options";

/**
 * A TypeScript and Angular wrapper around the JavaScript layer of Razorpay integration.
 * Copied and modified from https://github.com/razorpay/razorpay-cordova/blob/master/src/browser/CheckoutProxy.js
 *
 * @author Shashank Agrawal
 */
export class RazorpayWrapper {
  private readonly SCRIPT_ID = "rzp-js-sdk";
  private scriptElement: HTMLScriptElement;

  /**
   * @param ngZone Angular's instance of {@link NgZone} to run the resolve() & reject() operations in the context of Angular.
   */
  constructor(private ngZone: NgZone) {}

  /**
   * Inject the script https://checkout.razorpay.com/v1/checkout.js in the <head> tag if not already.
   *
   * @returns a promise which will be resolved when the script is injected and loaded completely.
   */
  private injectRZPScript(): Promise<any> {
    this.scriptElement = document.getElementById(
      this.SCRIPT_ID
    ) as HTMLScriptElement;
    if (this.scriptElement) {
      return;
    }

    this.scriptElement = document.createElement("script");
    this.scriptElement.id = this.SCRIPT_ID;

    const promise = new Promise((resolve, reject) => {
      this.scriptElement.onload = () => {
        this.ngZone.run(() => {
          resolve(true);
        });
      };

      this.scriptElement.onerror = () => {
        this.ngZone.run(() => {
          reject({ code: 0, description: "Network error" });
        });
      };
    });

    this.scriptElement.src = "https://checkout.razorpay.com/v1/checkout.js";

    document.head.appendChild(this.scriptElement);

    return promise;
  }

  /**
   * Open the Razorypay modal and show the payment options.
   *
   * @param options different options to be passed to Razorpay.
   * @returns a promise which will be resolved on successful payment. Rejected if the modal is closed by the user or payment fails.
   */
  private openRZP(options: RazorpayOption): Promise<any> {
    options.modal = options.modal || {};

    const promise = new Promise((resolve, reject) => {
      options.modal.ondismiss = () => {
        this.ngZone.run(() => {
          reject({ code: 2, description: "Payment cancelled by user" });
        });
      };

      options.handler = (response) => {
        this.ngZone.run(() => {
          resolve(response);
        });
      };

      if (
        options.external &&
        options.external.wallets &&
        options.external.wallets.length
      ) {
        options.external.handler = (response) => {
          response.external_wallet_name = response.wallet;
          this.ngZone.run(() => {
            reject(response);
          });
        };
      }
    });

    const Razorpay = (window as any).Razorpay;
    new Razorpay(options).open();

    return promise;
  }

  /**
   * Entry point for the Razorpay standard checkout option. This will inject the checkout.js script (if not already) and then
   * initiates the payment modal.
   *
   * @param options different options to be passed to Razorpay.
   * @returns a promise which will be resolved on successful payment. Rejected if the modal is closed by the user or payment fails.
   */
  async open(options: RazorpayOption): Promise<RazorpayVerification> {
    const Razorpay = (window as any).Razorpay;
    if (!Razorpay) {
      await this.injectRZPScript();
    }

    return await this.openRZP(options);
  }
}
