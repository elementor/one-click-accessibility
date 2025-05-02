import CopyIcon from '@elementor/icons/CopyIcon';
import AccordionActions from '@elementor/ui/AccordionActions';
import Box from '@elementor/ui/Box';
import Button from '@elementor/ui/Button';
import IconButton from '@elementor/ui/IconButton';
import Tooltip from '@elementor/ui/Tooltip';
import Typography from '@elementor/ui/Typography';
import PropTypes from 'prop-types';
import { uxMessaging } from '@ea11y-apps/scanner/constants/ux-messaging';
import { useManualFixForm } from '@ea11y-apps/scanner/hooks/useManualFixForm';
import { StyledAlert } from '@ea11y-apps/scanner/styles/app.styles';
import {
	SectionTitle,
	StyledAccordionDetails,
	StyledSnippet,
} from '@ea11y-apps/scanner/styles/manual-fixes.styles';
import { scannerItem } from '@ea11y-apps/scanner/types/scanner-item';
import { __ } from '@wordpress/i18n';

export const ManualFixForm = ({ item, current, setOpen }) => {
	const { copied, markResolved, copyToClipboard } = useManualFixForm({
		item,
		current,
	});

	const handleSkip = () => {
		setOpen(current + 1);
	};

	const handleMarkResolved = () => {
		markResolved();
		handleSkip();
	};

	return (
		<>
			<StyledAccordionDetails>
				<Box>
					<SectionTitle variant="body1">
						{__('What’s the issue', 'pojo-accessibility')}
					</SectionTitle>
					<Typography variant="body1">
						{uxMessaging[item.ruleId]?.whatsTheIssue ?? item.message}
					</Typography>
				</Box>
				<Box>
					<SectionTitle variant="body1" sx={{ mb: 0.5 }}>
						{__('Where is it', 'pojo-accessibility')}
					</SectionTitle>
					<StyledAlert color="info" icon={false}>
						<Box display="flex" gap={0.5} alignItems="start">
							<StyledSnippet variant="body1">{item.snippet}</StyledSnippet>
							<Box>
								<Tooltip
									placement="left"
									title={
										copied
											? __('Copied!', 'pojo-accessibility')
											: __('Copy', 'pojo-accessibility')
									}
									id="copy-icon"
									arrow={true}
									PopperProps={{
										disablePortal: true,
									}}
								>
									<IconButton
										size="medium"
										onClick={copyToClipboard(item.snippet)}
										aria-labelledby="copy-icon"
									>
										<CopyIcon />
									</IconButton>
								</Tooltip>
							</Box>
						</Box>
					</StyledAlert>
				</Box>
				{uxMessaging[item.ruleId] && (
					<>
						<Box>
							<SectionTitle variant="body1">
								{__('Why it matters', 'pojo-accessibility')}
							</SectionTitle>
							<Typography variant="body1">
								{uxMessaging[item.ruleId].whyItMatters}
							</Typography>
						</Box>
						<Box>
							<SectionTitle variant="body1">
								{__('How to resolve', 'pojo-accessibility')}
							</SectionTitle>
							<Typography variant="body1">
								{uxMessaging[item.ruleId].howToResolve}
							</Typography>
						</Box>
						<Box>
							<SectionTitle variant="body1">
								{__('See an example', 'pojo-accessibility')}
							</SectionTitle>
							<Typography variant="body1" sx={{ mb: 2 }}>
								{`${__('Issue:', 'pojo-accessibility')} ${uxMessaging[item.ruleId].seeAnExample.issue}`}
							</Typography>
							{uxMessaging[item.ruleId].seeAnExample.resolution.map(
								(resolution, index) => (
									<Typography
										variant="body1"
										key={`resolution-${index}`}
										sx={{ mb: 2 }}
									>
										{index === 0
											? `${__('Resolution:', 'pojo-accessibility')} `
											: ''}
										{resolution}
									</Typography>
								),
							)}
						</Box>
					</>
				)}
			</StyledAccordionDetails>
			<AccordionActions>
				<Button
					size="small"
					color="secondary"
					variant="outlined"
					onClick={handleSkip}
				>
					{__('Skip for now', 'pojo-accessibility')}
				</Button>
				<Button
					size="small"
					color="info"
					variant="contained"
					onClick={handleMarkResolved}
				>
					{__('Mark as resolved', 'pojo-accessibility')}
				</Button>
			</AccordionActions>
		</>
	);
};

ManualFixForm.propTypes = {
	item: scannerItem,
	current: PropTypes.number.isRequired,
	setOpen: PropTypes.func.isRequired,
};
