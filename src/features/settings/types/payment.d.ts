export type PaymentCard = {
    billing_details: {
      email: string;
      phone: string;
      address: {
        city: string;
        country: string;
        line1: string;
        state: string;
        postal_code: string;
      };
    }
    card: {
      brand: string,
      last4: string;
      display_brand: string,
      exp_year: number,
    },
    customer: string
    id: string
    type: "card"
  }