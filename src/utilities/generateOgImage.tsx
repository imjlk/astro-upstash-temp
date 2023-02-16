import satori, { SatoriOptions } from 'satori';
// import { SITE } from '@config';

const ogImage = (text = 'hello') => {
	return (
		<div
			style={{
				height: '100%',
				width: '100%',
				display: 'flex',
				textAlign: 'center',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				flexWrap: 'nowrap',
				backgroundSize: '100px 100px',
			}}
		>
			<div
				style={{
					display: 'flex',
					fontStyle: 'normal',
					marginTop: 30,
					lineHeight: 1.8,
					whiteSpace: 'pre-wrap',
				}}
			>
				<p style={{ fontSize: 30 }}>{text}</p>
				<p>TEST</p>
			</div>
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
		height: 600,
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
