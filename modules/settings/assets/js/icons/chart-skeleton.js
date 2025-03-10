const ChartSkeleton = (props) => {
	return (
		<svg
			viewBox="0 0 489 194"
			fill="transparent"
			{...props}
			style={{ maxWidth: '100%' }}
		>
			<path d="M24 1V137" stroke="#F3F3F4" />
			<path
				d="M24 122.5L102.029 106.033L190.906 2.5L270.809 92.5L344.46 63.4543L407.885 21.2879L488 53.7291"
				stroke="black"
				strokeOpacity="0.12"
				strokeWidth="2"
			/>
			<path d="M24 137L488 137" stroke="#F3F3F4" />
		</svg>
	);
};

export default ChartSkeleton;
