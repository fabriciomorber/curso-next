import styles from './styles.module.scss'
import { useSession, signIn } from 'next-auth/react'
import { api } from '@/src/services/api'
import {getStripeJs} from "@/src/services/stripe-js";

interface SubscribeButtonProps {
  priceId: string
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const {data: session} = useSession()

  async function handleSubscribe() {
    if (!session) {
      signIn('github')
      return
    }

    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data

      const stripe = await getStripeJs()

      if (!stripe) {
        throw new Error('Stripe failed to initialize.')
      }

      await stripe.redirectToCheckout({sessionId})
    } catch (err: any) {
      alert(err.message ?? 'Unexpected error occurred.')
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  )
}