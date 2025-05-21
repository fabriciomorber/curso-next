import Stripe from "stripe"

const stripeKey = process.env.STRIPE_API_KEY

if (!stripeKey) {
  throw new Error("Missing GitHub OAuth credentials in environment variables")
}

export const stripe = new Stripe(
  stripeKey,
  {
    apiVersion: '2020-08-27',
    appInfo: {
      name: 'Ignews',
      version: '0.1.0'
    }
  })