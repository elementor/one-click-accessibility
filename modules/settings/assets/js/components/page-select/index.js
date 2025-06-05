import Autocomplete from '@elementor/ui/Autocomplete';
import Infotip from '@elementor/ui/Infotip';
import TextField from '@elementor/ui/TextField';
import { styled } from '@elementor/ui/styles';
import { GeneratedPageInfoTipCard } from '@ea11y/components';
import { useSettings } from '@ea11y/hooks';
import { mixpanelEvents, mixpanelService } from '@ea11y-apps/global/services';
import { useEntityRecords } from '@wordpress/core-data';
import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const PageSelect = (props) => {
	const [userInput, setUserInput] = useState('');
	const {
		accessibilityStatementData,
		setAccessibilityStatementData,
		showAccessibilityGeneratedInfotip,
	} = useSettings();

	// Fetch initial default pages (e.g., first 10)
	const defaultPages = useEntityRecords('postType', 'page', {
		per_page: 10,
	});

	// Fetch pages matching user input
	const searchedPages = useEntityRecords('postType', 'page', {
		per_page: -1,
		search: userInput,
	});

	const isSearching = userInput.length > 0 && !searchedPages?.hasResolved;

	// Decide which pages to show
	const currentRecords = useMemo(() => {
		if (userInput?.length > 0 && searchedPages?.records) {
			return searchedPages?.records;
		}
		return defaultPages?.records || [];
	}, [userInput, defaultPages?.records, searchedPages?.records]);

	/**
	 * Options for the autocomplete
	 * @type {[]|{label: *, id: *}[]}
	 */
	const options = useMemo(() => {
		if (!currentRecords) {
			return [];
		}

		return currentRecords.map((page) => ({
			label: page.title.rendered,
			id: page.id,
			link: page.link,
			pageId: page.id,
		}));
	}, [currentRecords]);

	/**
	 * Render the input field for the autocomplete
	 * @param {Object} params
	 * @return {JSX.Element} Text field
	 */
	const inputField = (params) => (
		<StyledTextField
			{...params}
			placeholder={__('Search for a page', 'pojo-accessibility')}
			onChange={(e) => {
				const value = e.target.value;
				setUserInput(value);
			}}
			color="info"
		/>
	);

	/**
	 * Change the page when the user selects an option
	 * @param {Object} value Object containing the selected page data
	 */
	const changePage = (value) => {
		setAccessibilityStatementData({
			...accessibilityStatementData,
			pageId: value?.id,
			link: value?.link,
			id: value?.id,
			label: value?.label,
		});

		mixpanelService.sendEvent(mixpanelEvents.statementPageSelected, {
			page: value?.link,
		});
	};

	return (
		<Infotip
			placement="right-start"
			content={<GeneratedPageInfoTipCard />}
			disableHoverListener
			disableFocusListener
			PopperProps={{
				sx: {
					zIndex: 99999999999, // Custom z-index for the popper
				},
			}}
			open={showAccessibilityGeneratedInfotip}
		>
			<Autocomplete
				{...props}
				options={options}
				renderInput={(params) => inputField(params)}
				sx={{ width: 300 }}
				onChange={(e, value) => {
					changePage(value);
				}}
				getOptionLabel={(option) => option.label || ''}
				loading={isSearching}
				loadingText={__('Searching…', 'pojo-accessibility')}
				noOptionsText={
					isSearching
						? __('Searching…', 'pojo-accessibility')
						: __('No pages found', 'pojo-accessibility')
				}
				clearOnBlur={false}
				value={accessibilityStatementData}
			/>
		</Infotip>
	);
};

export default PageSelect;

const StyledTextField = styled(TextField)`
	& .MuiAutocomplete-input,
	& .MuiAutocomplete-input:focus,
	& .MuiAutocomplete-input:focus-visible {
		border: none;
		outline: none;
		box-shadow: none;
	}
`;
