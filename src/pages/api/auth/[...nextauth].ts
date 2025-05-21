import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

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
  ]
})
