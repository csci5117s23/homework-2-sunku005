import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { SignUp, SignIn } from "@clerk/nextjs";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
      <h1>Welcome to Anoushka's todo list</h1>
      <SignIn redirectUrl="/todos" />
    </div>
    
  )
}
