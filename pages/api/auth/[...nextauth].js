
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyApi,{LOGIN_URL} from '../../../lib/spotify'

async function refreshAcessToken(token){
    try{

        spotifyApi.setAccessToken(token.accessToken)
        spotifyApi.setRefreshToken(token.refreshToken)

        const { body:refreshedToken  } = await spotifyApi.refreshAccessToken()
        console.log("Recarregar token em", refreshedToken);
        return{
            ...token,
            accessToken:refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
        }

    }catch(error){
        console.log(error)
        return {
            ...token,
            error: 'RefreshAccessTokenError'
        }
    }
}


export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages:{
    signIn:'/login',
    
  },
  callbacks:{
    async jwt({token, account, user}){

        //initial sigin
        if(account && user){
            return {
                ...token,
                accessToken: account.access_token,
                refreshToken:account.refresh_token,
                username: account.providerAccountId,
                accessTokenExpires: account.expires_at * 1000,
            }
        }

        //return previous token if the access token has not expiret yet
        if(Date.now() < token.accessTokenExpires){
            console.log("Existe um acesso válido com esse token")
            return token;
        }

        //acess token has expired , so we need to refresh it...
        console.log("Acesso de token expirado, recarregando...")
        return await refreshAcessToken(token)
    },
    async session({ session, token }){
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;

        return session;
    }
  }
}

export default NextAuth(authOptions)