import SearchIcon from '@elementor/icons/SearchIcon';
import InputAdornment from '@elementor/ui/InputAdornment';
import TextField from '@elementor/ui/TextField';
import { styled } from '@elementor/ui/styles';
import { useDebouncedCallback } from 'use-debounce';
import Button from '@ea11y/components/button';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useState, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useAccessibilityAssistantContext } from '../../../contexts/accessibility-assistant-context';

const AccessibilityAssistantResultsSearch = () => {
	const { search, setSearch, loading } = useAccessibilityAssistantContext();
	const [focused, setFocused] = useState(false);
	const inputRef = useRef(null);

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
		<div style={{ position: 'relative', display: 'inline-block' }}>
			{!expanded && (
				<StyledSearchButton
					onClick={() => {
						setFocused(true);
						inputRef.current?.focus();
					}}
					variant="text"
					color="secondary"
					size="medium"
					startIcon={<SearchIcon fontSize="small" role="presentation" />}
				>
					{__('Search', 'pojo-accessibility')}
				</StyledSearchButton>
			)}

			<StyledTextField
				inputRef={inputRef}
				variant="outlined"
				size="medium"
				type="search"
				aria-hidden={!expanded}
				expanded={expanded}
				aria-label={__('Search scanned URLs', 'pojo-accessibility')}
				placeholder={__('Page URL or name', 'pojo-accessibility')}
				onBlur={() => setFocused(false)}
				value={search}
				onChange={onChange}
				inputProps={{ tabIndex: expanded ? '0' : '-1' }}
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon fontSize="small" role="presentation" />
						</InputAdornment>
					),
				}}
			/>
		</div>
	);
};

const StyledSearchButton = styled(Button)`
	margin-inline-end: ${({ theme }) => theme.spacing(2)};
`;

const StyledTextField = styled(TextField)`
	width: ${({ expanded }) => (expanded ? '250px' : '0')};

	opacity: ${({ expanded }) => (expanded ? 1 : 0)};
	transition: all 300ms ease;

	& input {
		width: 250px;
		height: 40px;
		margin-inline-end: ${({ theme }) => theme.spacing(2)};
		padding-inline-start: 40px;
		border: 1px solid ${({ theme }) => theme.palette.secondary.main};

		border-radius: ${({ theme }) => theme.shape.borderRadius}px;

		::placeholder {
			opacity: 1;
			color: ${({ theme }) => theme.palette.secondary.main};
			font-size: 14px;
			font-style: normal;
			font-weight: 500;
			letter-spacing: 0.4px;
		}

		:focus {
			border: 2px solid ${({ theme }) => theme.palette.secondary.main};
			box-shadow: none;
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
