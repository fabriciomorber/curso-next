import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { supabase } from '@/src/services/supabase'

const clientId = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET

if (!clientId || !clientSecret) {
  throw new Error("Missing GitHub OAuth credentials in environment variables")
}

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId,
      clientSecret,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      const { email } = user

      if (!email) return false

      const {data, error} = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (!data) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ email }])

        if (insertError) {
          console.error('Erro ao inserir usuário no Supabase:', insertError)
          return false
        }
      }

      return true
    }
  }
})
