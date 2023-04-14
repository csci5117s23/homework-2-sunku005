import Link from 'next/link'


// pages/404.js
export default function Custom404() {
    return (
    <div>
        <h1>404 - Page Not Found</h1>
        <h3><Link href="/todos">Return to todos</Link></h3>
    </div>);
  }