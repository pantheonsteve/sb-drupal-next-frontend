import Link from 'next/link'
import styles from '../styles/Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
        <div className={styles.logo}>
            <Link href='/'>
                <a>Pantheon FrontEnd Sites</a>
            </Link>
        </div>

        <nav>
            <ul>
                <li>
                    <Link href='/articles'>
                        <a>Articles</a>
                    </Link>
                </li>
                <li>
                    <Link href='/artists'>
                        <a>Artists</a>
                    </Link>
                </li>
                <li>
                    <Link href='/examples'>
                        <a>Examples</a>
                    </Link>
                </li>
            </ul>
        </nav>
    </header>
  )
}
