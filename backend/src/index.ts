import { MercadoPagoConfig, Payment } from "mercadopago";

process.loadEnvFile(".env");

const mercadoPagoApiToken = process.env.MERCADO_PAGO_API_TOKEN;
if (!mercadoPagoApiToken) throw new Error("Mercado Pago token not found.");

const client = new MercadoPagoConfig({
  accessToken: mercadoPagoApiToken,
});

const payments = new Payment(client);

(async () => {
  try {
    const body = {
      transaction_amount: 0.01,
      description: "Compra no Mercado XYZ",
      payment_method_id: "pix",
      payer: {
        email: "igorscastroptc2@gmail.com",
        first_name: "Igor",
        last_name: "Souza",
        identification: {
          type: "CPF",
          number: "11712530607",
        },
      },
    };
    
    const response = await payments.create({ body });
    console.log(response);
  } catch (err) {
    console.error(err);
  }
})();
