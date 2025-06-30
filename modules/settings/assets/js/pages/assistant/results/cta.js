import RefreshIcon from '@elementor/icons/RefreshIcon';
import PropTypes from 'prop-types';
import Button from '@ea11y/components/button';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

const AccessibilityAssistantResultsTableCTA = ({ percentage, pageUrl }) => {
	const ctaUrl = addQueryArgs(pageUrl, {
		'open-ea11y-assistant': '1',
		'open-ea11y-assistant-src': 'Ally_dashboard',
	});

	const sendAnalytics = (ctaText) => {
		mixpanelService.sendEvent(mixpanelEvents.assistantDashboardScanCtaClicked, {
			cta_text: ctaText,
			source: 'history_logs_list',
		});
	};

	if (percentage === 100) {
		return (
			<Button
				size="small"
				color="secondary"
				variant="outlined"
				href={ctaUrl}
				onClick={() => sendAnalytics('rescan_url')}
				target="_blank"
				rel="noreferrer"
				endIcon={<RefreshIcon />}
			>
				{__('New scan', 'pojo-accessibility')}
			</Button>
		);
	}

	return (
		<Button
			size="small"
			color="secondary"
			variant="outlined"
			href={ctaUrl}
			onClick={() => sendAnalytics('fix_issues')}
			target="_blank"
		>
			{__('Resolve issues', 'pojo-accessibility')}
		</Button>
	);
};

AccessibilityAssistantResultsTableCTA.propTypes = {
	percentage: PropTypes.number.isRequired,
	pageUrl: PropTypes.string.isRequired,
};

export default AccessibilityAssistantResultsTableCTA;
