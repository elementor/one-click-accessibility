import Typography from '@elementor/ui/Typography';
import ValueLoader from '@ea11y/pages/assistant/loaders/value-loader';
import AccessibilityAssistantTooltip from '@ea11y/pages/assistant/tooltip';
import {
	StyledStatsItem,
	StyledStatsItemContent,
	StyledStatsItemTitle,
} from './stats.styles';

const StatsCounter = ({ stat, loading, title, tooltip }) => {
	return (
		<StyledStatsItem className="scanned-urls">
			<StyledStatsItemContent>
				<StyledStatsItemTitle variant="subtitle1" as="p">
					{title}

					<AccessibilityAssistantTooltip content={tooltip} />
				</StyledStatsItemTitle>

				<Typography variant="h4" as="p">
					{loading ? <ValueLoader /> : stat}
				</Typography>
			</StyledStatsItemContent>
		</StyledStatsItem>
	);
};

export default StatsCounter;
