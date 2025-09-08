import AlertCircleIcon from '@elementor/icons/AlertCircleIcon';
import AlertTriangleFilledIcon from '@elementor/icons/AlertTriangleFilledIcon';
import CircleCheckFilledIcon from '@elementor/icons/CircleCheckFilledIcon';
import Divider from '@elementor/ui/Divider';
import PropTypes from 'prop-types';
import HeadingStructureTitleRowLoader from '@ea11y-apps/scanner/components/header/subheader/heading-structure/loader';
import { useHeadingStructureContext } from '@ea11y-apps/scanner/context/heading-structure-context';
import { StyledTitleRowContainer } from '@ea11y-apps/scanner/styles/heading-structure.styles';
import { __, sprintf } from '@wordpress/i18n';
import HeadingStructureTitleRowItem from './title-row-item';

const HeadingStructureTitleRow = ({ success, error, warning }) => {
	const { isLoading } = useHeadingStructureContext();

	if (isLoading) {
		return <HeadingStructureTitleRowLoader />;
	}

	return (
		<StyledTitleRowContainer
			direction="row"
			divider={<Divider orientation="vertical" flexItem />}
			gap={2}
		>
			{success && (
				<HeadingStructureTitleRowItem
					icon={<CircleCheckFilledIcon color="success" fontSize="small" />}
					text={
						// Translators: %s - success count
						sprintf(__('{{b}}%s{{/b}} Pass', 'pojo-accessibility'), success)
					}
				/>
			)}

			{error && (
				<HeadingStructureTitleRowItem
					icon={<AlertTriangleFilledIcon color="error" fontSize="small" />}
					text={
						// Translators: %s - errors count
						sprintf(__('{{b}}%s{{/b}} Issues', 'pojo-accessibility'), error)
					}
				/>
			)}

			{warning && (
				<HeadingStructureTitleRowItem
					icon={<AlertCircleIcon color="warning" fontSize="small" />}
					text={sprintf(
						// Translators: %s - warnings count
						__('{{b}}%s{{/b}} Need review', 'pojo-accessibility'),
						warning,
					)}
				/>
			)}
		</StyledTitleRowContainer>
	);
};

HeadingStructureTitleRow.propTypes = {
	success: PropTypes.number,
	error: PropTypes.number,
	warning: PropTypes.number,
};

export default HeadingStructureTitleRow;
