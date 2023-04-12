import Head from 'next/head'

export default function Todo() {
    return (
      <>
        <Head>
          <title>Anoushka's todo list</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main >
          <h3>Welcome to the TODO list </h3>
          <p>Here are the items that aren't done yet: </p>
          <ul>
            <li>Comp sci homework</li>
            <li>Lift</li>
            <li>Cook dinner</li>
          </ul>
        </main>
      </>
    )
  }
  