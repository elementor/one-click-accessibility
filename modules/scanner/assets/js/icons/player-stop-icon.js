import SvgIcon from '@elementor/ui/SvgIcon';

const PlayerStopIcon = (props, { size = 'tiny' }) => {
	return (
		<SvgIcon viewBox="0 0 12 12" fontSize={size} {...props}>
			<path
				d="M9.75 0H2.25C1.65326 0 1.08097 0.237053 0.65901 0.65901C0.237053 1.08097 0 1.65326 0 2.25V9.75C0 10.3467 0.237053 10.919 0.65901 11.341C1.08097 11.7629 1.65326 12 2.25 12H9.75C10.3467 12 10.919 11.7629 11.341 11.341C11.7629 10.919 12 10.3467 12 9.75V2.25C12 1.65326 11.7629 1.08097 11.341 0.65901C10.919 0.237053 10.3467 0 9.75 0Z"
				fill="currentColor"
			/>
		</SvgIcon>
	);
};

export default PlayerStopIcon;
