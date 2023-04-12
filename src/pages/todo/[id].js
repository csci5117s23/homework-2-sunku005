import Head from 'next/head'
import { useRouter } from "next/router";

export default function Todo() {
    const router = useRouter();
    const {id} = router.query;
    return (
      <>
        <Head>
          <title>Anoushka's todo item</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main >
          <h3>Welcome to the TODO item: {id}</h3>
        </main>
      </>
    )
  }
  