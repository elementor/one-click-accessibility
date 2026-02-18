import Image from '@elementor/ui/Image';
import PropTypes from 'prop-types';
import { memo } from '@wordpress/element';

const BulkBannerImageStack = ({ images, count }) => {
	return (
		<>
			{Array.from({ length: count }).map((_, index) => (
				<Image
					key={index}
					src={images[index]}
					alt=""
					height={44}
					sx={{
						marginInlineStart: index > 0 ? -2 : 0,
					}}
				/>
			))}
		</>
	);
};

BulkBannerImageStack.propTypes = {
	images: PropTypes.arrayOf(PropTypes.string).isRequired,
	count: PropTypes.number.isRequired,
};

export default memo(BulkBannerImageStack);
