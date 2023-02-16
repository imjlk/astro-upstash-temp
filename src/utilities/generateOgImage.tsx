import satori, { SatoriOptions } from 'satori';
// import { SITE } from '@config';

const ogImage = (text = 'hello') => {
	return (
		<div style={{ color: 'black', display: 'flex' }}>
			{text}
			<p>TEST</p>
		</div>
	);
};

const generateOgImage = async (mytext: string) => {
	const fetchFont = async () => {
		const fontFile = await fetch(
			'https://www.1001fonts.com/download/font/ibm-plex-mono.regular.ttf',
		);
		const fontData: ArrayBuffer = await fontFile.arrayBuffer();
		return fontData;
	};

	const fontData = await fetchFont();

	const options: SatoriOptions = {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: 'IBM Plex Mono',
				data: fontData,
				weight: 400,
				style: 'normal',
			},
		],
	};
	return await satori(ogImage(mytext), options);
};

export default generateOgImage;
