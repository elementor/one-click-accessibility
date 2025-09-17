import Box from '@elementor/ui/Box';
import Typography from '@elementor/ui/Typography';
import { styled } from '@elementor/ui/styles';
import PropTypes from 'prop-types';
import { __, sprintf } from '@wordpress/i18n';

const IssueList = ({ issueLevels }) => {
	return (
		<>
			<StyledIssueLevel>
				<Typography variant="body2">
					{__('Level A', 'pojo-accessibility')}
				</Typography>

				<StyledIssuesCount variant="subtitle2" as="p">
					{sprintf(
						// Translators: %s count of issues
						__('%s issues', 'pojo-accessibility'),
						issueLevels.a,
					)}
				</StyledIssuesCount>
			</StyledIssueLevel>

			<StyledIssueLevel>
				<Typography variant="body2">
					{__('Level AA', 'pojo-accessibility')}
				</Typography>

				<StyledIssuesCount variant="subtitle2" as="p">
					{sprintf(
						// Translators: %s count of issues
						__('%s issues', 'pojo-accessibility'),
						issueLevels.aa,
					)}
				</StyledIssuesCount>
			</StyledIssueLevel>

			<StyledIssueLevel>
				<Typography variant="body2">
					{__('Level AAA', 'pojo-accessibility')}
				</Typography>

				<StyledIssuesCount variant="subtitle2" as="p">
					{sprintf(
						// Translators: %s count of issues
						__('%s issues', 'pojo-accessibility'),
						issueLevels.aaa,
					)}
				</StyledIssuesCount>
			</StyledIssueLevel>
		</>
	);
};

IssueList.propTypes = {
	issueLevels: PropTypes.object.isRequired,
};

const StyledIssueLevel = styled(Box)`
	max-width: 160px;

	display: flex;
	justify-content: flex-start;
	align-items: center;

	margin-inline-start: ${({ theme }) => theme.spacing(0.5)};

	&:not(:last-of-type) {
		margin-bottom: ${({ theme }) => theme.spacing(1)};
	}

	:first-of-type::before,
	:nth-of-type(2)::before,
	:last-of-type::before {
		content: '';
		width: 10px;
		height: 10px;
		margin-inline-end: ${({ theme }) => theme.spacing(1)};

		border-radius: 100%;
	}

	:first-of-type::before {
		background-color: #064e3b;
	}

	:nth-of-type(2)::before {
		background-color: #10b981;
	}

	:last-of-type::before {
		background-color: #a7f3d0;
	}
`;

const StyledIssuesCount = styled(Typography)`
	margin: 0;
	margin-inline-start: auto;

	color: ${({ theme }) => theme.palette.text.primary};
	font-size: 14px;
	font-weight: 500;
	line-height: 130%;
	letter-spacing: 0.1px;
`;

export default IssueList;
