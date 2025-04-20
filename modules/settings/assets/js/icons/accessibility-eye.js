import SvgIcon from '@elementor/ui/SvgIcon';
import { useSettings } from '@ea11y/hooks';

function AccessibilityEyeIcon({ size }, props) {
	const { iconDesign } = useSettings();
	const strokeColor = `lch(from ${iconDesign?.color || '#fff'} calc((50 - l) * 100) 0 0)`;
	return (
		<SvgIcon viewBox="0 0 24 24" fill="none" sx={{ fontSize: size }} {...props}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M.44.44a1.5 1.5 0 0 1 2.12 0l15.855 15.853c.073.06.141.128.203.204l4.943 4.942a1.5 1.5 0 0 1-2.122 2.122l-4.246-4.247a11.67 11.67 0 0 1-5.198 1.186c-4.881-.002-8.803-2.764-11.781-7.728a1.5 1.5 0 0 1 0-1.544C1.4 9.25 2.738 7.614 4.24 6.363L.44 2.56a1.5 1.5 0 0 1 0-2.122Zm5.934 8.055C5.288 9.355 4.25 10.512 3.27 12c2.513 3.821 5.427 5.5 8.729 5.5h.01a8.67 8.67 0 0 0 2.892-.476l-1.467-1.468a3.833 3.833 0 0 1-4.99-4.99l-2.071-2.07ZM11.996 6.5a9.064 9.064 0 0 0-1.822.18 1.5 1.5 0 0 1-.595-2.94c.798-.162 1.61-.242 2.423-.24 4.882 0 8.805 2.763 11.784 7.728a1.5 1.5 0 0 1 0 1.544c-.823 1.373-1.719 2.579-2.69 3.607a1.5 1.5 0 1 1-2.18-2.061A16.86 16.86 0 0 0 20.729 12C18.216 8.179 15.302 6.5 12 6.5h-.004Z"
				fill={strokeColor}
			/>
		</SvgIcon>
	);
}

export default AccessibilityEyeIcon;
