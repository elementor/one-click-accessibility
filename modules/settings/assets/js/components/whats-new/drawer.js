import Divider from '@elementor/ui/Divider';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { Fragment, useEffect, useState } from '@wordpress/element';
import API from '../../api';
import WhatsNewDrawerBase from './drawer-base';
import DrawerLoader from './drawer-loader';
import WhatsNewNotification from './notification';

const StyledDivider = styled(Divider)`
	margin: ${({ theme }) => theme.spacing(2)} 0;
`;

const WhatsNewDrawer = ({ onClose }) => {
	const [notifications, setNotifications] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getNotifications = async () => {
		try {
			setIsLoading(true);

			const response = await API.getNotifications();

			setNotifications(response);
			setIsLoading(false);
		} catch (e) {
			console.error(e.message);
		}
	};

	useEffect(() => {
		getNotifications();
	}, []);

	if (isLoading && !notifications.length) {
		return (
			<WhatsNewDrawerBase isOpen onClose={onClose}>
				<DrawerLoader />
			</WhatsNewDrawerBase>
		);
	}

	return (
		<WhatsNewDrawerBase isOpen onClose={onClose}>
			{notifications.map((notification, i) => {
				return (
					<Fragment key={notification.id}>
						<WhatsNewNotification {...notification} />
						{i < notifications.length - 1 && <StyledDivider />}
					</Fragment>
				);
			})}
		</WhatsNewDrawerBase>
	);
};

WhatsNewDrawer.propTypes = {
	onClose: PropTypes.func.isRequired,
};

export default WhatsNewDrawer;
