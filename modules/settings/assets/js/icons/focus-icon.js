import SvgIcon from '@elementor/ui/SvgIcon';

const FocusIcon = (props, { size }) => {
	return (
		<SvgIcon
			viewBox="0 0 24 24"
			fill="none"
			stroke={props.sx.color}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			fontSize={size}
		>
			<path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
			<path d="M4 8v-2a2 2 0 0 1 2 -2h2" /> <path d="M4 16v2a2 2 0 0 0 2 2h2" />
			<path d="M16 4h2a2 2 0 0 1 2 2v2" />
			<path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
		</SvgIcon>
	);
};

export default FocusIcon;
