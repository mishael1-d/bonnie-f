import Link from "next/link";

export default function Navbar() {
    return(
        <>
            <header>
                <nav className="flex justify-end space-x-6 text-2xl py-10 px-24 font-semibold bg-blue-950 text-white">
                    <Link href="">Account</Link>
                    <Link href="">Login</Link>
                    <Link href="">Checkout</Link>
                </nav>

                <nav>
                    Logo
                    Search 
                    Support 
                    Cart
                </nav>
            </header>
        </>
    )
}