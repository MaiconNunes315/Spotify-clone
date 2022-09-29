import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";


export async function middleware(req){

    //token existirá se o usuário estiver logado
    const token = await getToken({req,secret: process.env.JWT_SECRET})
    const { pathname } = req.nextUrl
    //permitir a solicitação se o seguinte for verdadeiro
    // 1) é uma solicitação para a próxima sessão de autenticação e busca do provedor
    // 2) o token existe

    if(pathname.includes('/api/auth') || token){
        return NextResponse.next()
    }

    //redirecione-os para o login se eles não tiverem token e estiverem solicitando uma rota de proteção
    if (!token && pathname !== '/login'){
        return NextResponse.redirect('/login')
    }
}