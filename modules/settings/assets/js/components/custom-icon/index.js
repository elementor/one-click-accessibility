import { useSettings } from '@ea11y/hooks';
import { useEffect, useState } from '@wordpress/element';

const CustomIcon = ({ size }) => {
	const { iconDesign } = useSettings();
	const [svg, setSvg] = useState(iconDesign.custom.svg);
	const strokeColor = `lch(from ${iconDesign?.color || '#fff'} calc((50 - l) * 100) 0 0)`;

	useEffect(() => {
		// add style to the svg code
		const svgCode = iconDesign.custom.svg.replace(
			/<svg /,
			`<svg style="font-size:${size}px;width: ${size}px;fill:${strokeColor}" `,
		);
		setSvg(svgCode);
	}, [iconDesign]);

	return (
		<div
			className="custom-icon"
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
};

export default CustomIcon;
