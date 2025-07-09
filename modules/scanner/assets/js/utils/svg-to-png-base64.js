export // Get size from attributes or viewBox
const getSvgSize = (svg) => {
	let width = svg.getAttribute('width');
	let height = svg.getAttribute('height');

	if (!width || !height) {
		const viewBox = svg.getAttribute('viewBox');
		if (viewBox) {
			const parts = viewBox.split(' ').map(Number);
			if (parts.length === 4) {
				width = width || parts[2];
				height = height || parts[3];
			}
		}
	}

	return {
		width: width ? parseFloat(width) : 300, // Default fallback
		height: height ? parseFloat(height) : 300,
	};
};

export const convertSvgToPngBase64 = (url) => {
	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, img.width, img.height);
			URL.revokeObjectURL(url);

			const base64 = canvas.toDataURL('image/png');
			resolve(base64);
		};

		img.onerror = reject;
		img.src = url;
	});
};

export const svgNodeToPngBase64 = (svgNode) => {
	const svgString = new XMLSerializer().serializeToString(svgNode);
	const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
	const url = URL.createObjectURL(svgBlob);

	return convertSvgToPngBase64(url);
};

export const svgSrcToPngBase64 = (svgNode) => {
	const { width, height } = getSvgSize(svgNode);
	const svgString = new XMLSerializer().serializeToString(svgNode);
	const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
	const url = URL.createObjectURL(svgBlob);

	return convertSvgToPngBase64(url, width, height);
};
