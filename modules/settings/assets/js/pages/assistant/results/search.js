import SearchIcon from '@elementor/icons/SearchIcon';
import InputAdornment from '@elementor/ui/InputAdornment';
import TextField from '@elementor/ui/TextField';
import { styled } from '@elementor/ui/styles';
import { useDebouncedCallback } from 'use-debounce';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useAccessibilityAssistantContext } from '../../../contexts/accessibility-assistant-context';

const AccessibilityAssistantResultsSearch = () => {
	const { search, setSearch, loading } = useAccessibilityAssistantContext();
	const [focused, setFocused] = useState(false);

	const debounced = useDebouncedCallback((value) => {
		mixpanelService.sendEvent(
			mixpanelEvents.assistantDashboardSearchTriggered,
			{
				input_txt: value,
			},
		);
	}, 1000);

	if (loading) {
		return false;
	}

	const onChange = (e) => {
		setSearch(e.target.value);
		debounced(e.target.value);
	};

	const expanded = focused || search !== '';

	return (
		<StyledTextField
			variant="outlined"
			size="medium"
			type="search"
			expanded={expanded}
			placeholder={
				expanded
					? __('Page URL or name', 'pojo-accessibility')
					: __('Search', 'pojo-accessibility')
			}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			value={search}
			onChange={onChange}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<SearchIcon fontSize="small" role="presentation" />
					</InputAdornment>
				),
			}}
		/>
	);
};

const StyledTextField = styled(TextField)`
	& input {
		width: ${({ expanded }) => (expanded ? '250px' : '110px')};
		height: 40px;
		margin-inline-end: ${({ theme, expanded }) =>
			expanded ? theme.spacing(2) : 0};
		padding-inline-start: 40px;
		border: ${({ expanded, theme }) =>
			expanded ? `1px solid ${theme.palette.secondary.main}` : 'none'};

		border-radius: ${({ theme }) => theme.shape.borderRadius}px;
		transition: all 300ms ease;

		::placeholder {
			opacity: 1;
			color: ${({ theme }) => theme.palette.secondary.main};
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			letter-spacing: 0.4px;
		}
	}

	& fieldset {
		display: none;
	}

	.MuiInputAdornment-positionStart {
		position: relative;
		left: 40px;
	}
`;

export default AccessibilityAssistantResultsSearch;
