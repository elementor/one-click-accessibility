export const imageToBase64 = (image) => {
	if (image.tagName === 'svg') {
		const serialized = new XMLSerializer().serializeToString(image);
		const encodedData = window.btoa(serialized);
		return `data:image/svg+xml;base64,${encodedData}`;
	}
	const canvas = document.createElement('canvas');
	canvas.width = image.naturalWidth;
	canvas.height = image.naturalHeight;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0);
	return canvas.toDataURL();
};
