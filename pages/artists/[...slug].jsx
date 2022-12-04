import { NextSeo } from 'next-seo';
import { isMultiLanguage } from '../../lib/isMultiLanguage';
import { getPreview } from '../../lib/getPreview';
import {
	getCurrentLocaleStore,
	globalDrupalStateAuthStores,
	globalDrupalStateStores,
} from '../../lib/stores';
import { IMAGE_URL } from '../../lib/constants';

import { ContentWithImage } from '@pantheon-systems/nextjs-kit';
import Layout from '../../components/layout';

export default function ArtistTemplate({
	artist,
	hrefLang,
	footerMenu,
	preview,
}) {
	const { title, body, thumbnail } = artist;

	const imgSrc = artist.field_media_image?.field_media_image?.uri?.url;
	return (
		<Layout preview={preview} footerMenu={footerMenu}>
			<NextSeo
				title="Decoupled Next Drupal Demo"
				description="Generated by create next app."
				languageAlternates={hrefLang}
			/>
			<ContentWithImage
				title={title}
				content={body.processed}
				imageProps={
					imgSrc
						? {
								src: IMAGE_URL + imgSrc,
								alt: thumbnail?.resourceIdObjMeta?.alt,
						  }
						: undefined
				}
			/>
		</Layout>
	);
}

export async function getServerSideProps(context) {
	const { locales, locale } = context;
	const multiLanguage = isMultiLanguage(locales);
	const lang = context.preview ? context.previewData.previewLang : locale;

	const store = getCurrentLocaleStore(
		lang,
		context.preview ? globalDrupalStateAuthStores : globalDrupalStateStores,
	);

	// handle nested slugs like /artist/featured
	const slug = `/artists${context.params.slug
		.map((segment) => `/${segment}`)
		.join('')}`;

	const params = 'include=field_media_image.field_media_image';
	// if preview, use preview endpoint and add to store.
	const previewParams =
		context.preview && (await getPreview(context, 'node--artist', params));

	const artist = await store.getObjectByPath({
		objectName: 'node--artist',
		// Prefix the slug with the current locale
		path: `${multiLanguage ? lang : ''}${slug}`,
		params: context.preview ? previewParams : params,
		refresh: true,
		res: context.res,
	});

	const footerMenu = await store.getObject({
		objectName: 'menu_items--main',
		refresh: true,
		res: context.res,
	});

	const origin = process.env.NEXT_PUBLIC_FRONTEND_URL;
	// Load all the paths for the current artist.
	const paths = locales.map(async (locale) => {
		const localeStore = getCurrentLocaleStore(
			locale,
			context.preview ? globalDrupalStateAuthStores : globalDrupalStateStores,
		);
		const { path } = await localeStore.getObject({
			objectName: 'node--artist',
			id: artist.id,
			params: context.preview ? previewParams : params,
			refresh: true,
			res: context.res,
		});
		return path;
	});

	// Resolve all promises returned as part of paths
	// and prepare hrefLang.
	const hrefLang = await Promise.all(paths).then((values) => {
		return values.map((value) => {
			return {
				hrefLang: value.langcode,
				href: origin + '/' + value.langcode + value.alias,
			};
		});
	});

	return {
		props: {
			artist,
			hrefLang,
			footerMenu,
			preview: Boolean(context.preview),
		},
	};
}
