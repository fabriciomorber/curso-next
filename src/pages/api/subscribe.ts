import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { stripe } from '@/src/services/stripe'

import { supabase } from '@/src/services/supabase'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = await getSession({ req })

    if (!session?.user?.email) {
      return res.status(400).json({ error: 'User not authenticated' })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, stripe_customer_id')
      .eq('email', session.user.email)
      .single()

    if (error || !user) {
      return res.status(404).json({ error: 'User not found in Supabase' })
    }

    let customerId = user.stripe_customer_id

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      })

      customerId = stripeCustomer.id

      const { error: updateError } = await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)

      if (updateError) {
        return res.status(500).json({ error: 'Failed to update stripe_customer_id' })
      }
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        { price: 'price_1RQuZmPF8IEKf6PYUipKqtxY', quantity: 1 }
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL!,
      cancel_url: process.env.STRIPE_CANCEL_URL!
    })

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}