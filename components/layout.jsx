import Footer from './Footer';
import Header from './Header';
import styles from '../styles/Layout.module.css';
import PreviewRibbon from './preview-ribbon';
import Showcase from './Showcase';

export default function Layout({ children, footerMenu, preview = false }) {
	const navItems = [
		{ linkText: '🏠 Home', href: '/' },
		{ linkText: '📰 Articles', href: '/articles' },
		{ linkText: '📑 Pages', href: '/pages' },
		{ linkText: '⚛️ Examples', href: '/examples' },
		{ linkText: 'Artists', href: '/artists'},
	];
	const footerMenuItems = footerMenu?.map(({ title, url, parent }) => ({
		linkText: title,
		href: url,
		parent: parent,
	}));
	return (
		<div className="min-h-screen max-h-screen min-w-screen max-w-screen flex flex-col overflow-x-hidden">
			{preview && <PreviewRibbon />}
			<Header navItems={navItems} />
			<Showcase />
			<main className="mb-auto">{children}</main>
			<Footer footerMenuItems={footerMenuItems}>
				<span className="mx-auto">
					© {new Date().getFullYear()} Built with{' '}
					<a
						className="text-white hover:text-blue-100 underline"
						href="https://nextjs.org/"
					>
						Next.js
					</a>{' '}
					and{' '}
					<a
						className="text-blue-500 underline hover:text-blue-100"
						href="https://www.drupal.org/"
					>
						Drupal
					</a>
				</span>
			</Footer>
		</div>
	);
}
