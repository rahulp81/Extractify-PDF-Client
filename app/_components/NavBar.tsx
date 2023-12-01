import Image from 'next/image'
import Login from './Login'
import Link from 'next/link'

function NavBar() {
  return (
    <nav className='flex px-5 gap-x-8 gap-y-1  py-2 flex-wrap justify-between border-b border-slate-primary items-center'>
      <Link href={'/'} >
        <Image src={'/pdfLogo.png'} alt='logo' className='py-3.5' height={150} width={200} />
      </Link>
      <Login />
    </nav>
  )
}

export default NavBar
