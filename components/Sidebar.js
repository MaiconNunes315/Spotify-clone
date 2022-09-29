import {
        HomeOutline, 
        SearchOutline, 
        LibraryOutline, 
        PlusCircleOutline,
        HeartOutline,
        RssOutline,
        Heart
} from 'heroicons-react'
import {signOut, useSession} from "next-auth/react"
import { useEffect, useState } from 'react'
import { useSpotify} from '../hooks/useSpotify'
import { playlistIdState} from '../atoms/playlistAtom'
import { useRecoilState} from 'recoil'

export function Sidebar(){
    const spotifyApi = useSpotify()
    const [playlist, setPlaylists] = useState([])
    const {data: session, status} = useSession()
    const [playlistId, setPlaylistsid] = useRecoilState(playlistIdState)

   
    useEffect(()=>{
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data)=>{
               setPlaylists(data.body.items);
            })
        }
    },[session,spotifyApi])
   
    console.log(playlistId)

    return(
        <div className='text-gray-500 p-5 text-xs border-r 
        border-gray-900 overflow-y-scroll h-screen scrollbar-hide
        lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-26'>
            <div className='space-y-4'>
                <button onClick={()=>signOut()} className='flex items-center space-x-2 hover:text-white'>
                    
                    <p>Sair</p>
                </button>
                <button 
                    className='flex items-center space-x-2 hover:text-white'
                    
                    >
                    <HomeOutline className='w-5 h-5'/>
                    <p>Inicio</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <SearchOutline className='w-5 h-5'/>
                    <p>Pesquisa</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <LibraryOutline className='w-5 h-5'/>
                    <p>Sua biblioteca</p>
                </button>
                
                <hr className='border-t-[0.1px] border-gray-900'/>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <PlusCircleOutline className='w-5 h-5'/>
                    <p>Criar playlist</p>
                </button>
                <button className='flex items-center  space-x-2 hover:text-white'>
                    <Heart className='w-5 h-5 text-blue-500 '/>
                    <p>Musica que curti</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <RssOutline className='w-5 h-5 text-green-500'/>
                    <p>Seus episódios</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900'/>

                {playlist.map((list)=>
                    (
                        <p key={list.id} onClick={()=>setPlaylistsid(list.id)} className='cursor-pointer hover:text-white'>{list.name}</p>
                    )
                )}

            </div>
        </div>
    )
}