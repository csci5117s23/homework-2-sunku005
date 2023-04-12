import Head from 'next/head'

export default function Done() {
    return (
      <>
        <Head>
          <title>Anoushka's done list</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main >
          <h3>Welcome to the DONE list </h3>
          <p>Here are the done items: </p>
          <ul>
            <li>Calculus homework</li>
            <li>Read a book</li>
            <li>Laundry</li>
          </ul>
        </main>
      </>
    )
  }
  