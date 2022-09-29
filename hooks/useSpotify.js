import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react"
import SpotifyWebApi from "spotify-web-api-node"


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret:process.env.NEXT_PUBLIC_CLIENT_SECRET,
    
})

export function useSpotify(){
    const {data: session, status} = useSession()

    useEffect(()=>{

        if(session){
            //se a tentativa de atualização do token de acesso falhar, direcionar o usuário para o login
            if(session.error === 'RefreshAccessTokenError'){
                signIn()
            }
            spotifyApi.setAccessToken(session.user.accessToken);
        }
    },[session])

    return spotifyApi
}