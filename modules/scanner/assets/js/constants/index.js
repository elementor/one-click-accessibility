import { __ } from '@wordpress/i18n';

export const TOP_BAR_LINK = '#wp-admin-bar-ea11y-scanner-wizard > a';
export const SCAN_LINK = '#wp-admin-bar-ea11y-scan-page > a';
export const CLEAR_CACHE_LINK = '#wp-admin-bar-ea11y-clear-cache > a';

export const SCANNER_URL_PARAM = 'open-ea11y-assistant';
export const MANAGE_URL_PARAM = 'open-ea11y-manage';
export const ROOT_ID = 'ea11y-scanner-wizard-widget';

export const CURRENT_ELEMENT_CLASS = 'ea11y-scanner-current-element';
export const COLOR_ELEMENT_CLASS = 'ea11y-scanner-color-element';
export const BACKGROUND_ELEMENT_CLASS = 'ea11y-scanner-background-element';
export const COLOR_CONTRAST_SELECTORS_COUNT = 5;
export const DATA_INITIAL_BG = 'data-initial-bg';
export const DATA_INITIAL_COLOR = 'data-initial-color';

export const LEVEL_VIOLATION = 'violation';
export const LEVEL_POTENTIAL = 'potentialViolation';
export const RULE_TEXT_CONTRAST = 'text_contrast_sufficient';
export const RATIO_EXCLUDED = 1;

export const UPGRADE_URL = 'https://go.elementor.com/acc-free-no-AI-scanner';
export const COMPARE_PLAN_URL = 'https://go.elementor.com/acc-AI-limit-scanner';
export const PAGE_LIMIT_URL = 'https://go.elementor.com/acc-URL-limit-scanner';

export const isRTL = Boolean(window.ea11yScannerData?.isRTL);

export const IS_PRO_PLAN = !window.ea11yScannerData?.planData?.plan?.name
	?.toLowerCase()
	.includes('free');
export const AI_QUOTA_LIMIT =
	window.ea11yScannerData?.planData?.aiCredits?.allowed -
		window.ea11yScannerData?.planData?.aiCredits?.used >
	0;

export const HIDE_UPGRADE_KEY = 'ea11y-hide-upgrade-alert';

export const PAGE_PER_PLAN =
	window.ea11yScannerData?.planData?.scannedPages?.allowed;

export const PAGE_QUOTA_LIMIT =
	window.ea11yScannerData?.planData?.scannedPages?.allowed -
		window.ea11yScannerData?.planData?.scannedPages?.used >
		0 || !window?.ea11yScannerData?.pageData?.unregistered;

export const BLOCKS = {
	main: 'main',
	management: 'management',
	altText: 'altText',
	dynamicContent: 'dynamicContent',
	formsInputsError: 'formsInputsError',
	keyboardAssistiveTech: 'keyboardAssistiveTech',
	pageStructureNav: 'pageStructureNav',
	headingStructure: 'headingStructure',
	tables: 'tables',
	colorContrast: 'colorContrast',
	other: 'other',
};

export const MANUAL_GROUPS = {
	dynamicContent: [],
	formsInputsError: [],
	keyboardAssistiveTech: [],
	pageStructureNav: [],
	headingStructure: [],
	tables: [],
	colorContrast: [],
	other: [],
};

export const BLOCK_TITLES = {
	altText: __('Alternative text', 'pojo-accessibility'),
	dynamicContent: __('Dynamic Content & ARIA', 'pojo-accessibility'),
	formsInputsError: __('Forms & Input Errors', 'pojo-accessibility'),
	keyboardAssistiveTech: __(
		'Keyboard & Assistive Technologies',
		'pojo-accessibility',
	),
	pageStructureNav: __('Page Structure & Navigation', 'pojo-accessibility'),
	headingStructure: __('Heading Structure', 'pojo-accessibility'),
	tables: __('Tables', 'pojo-accessibility'),
	colorContrast: __('Color contrast', 'pojo-accessibility'),
	other: __('Other Accessibility Issues', 'pojo-accessibility'),
};

export const BLOCK_INFO = {
	altText: __(
		"Clearly describe images so people using screen readers understand what's displayed.",
		'pojo-accessibility',
	),
	dynamicContent: __(
		'Label interactive content clearly, helping screen reader users navigate dynamic elements.',
		'pojo-accessibility',
	),
	formsInputsError: __(
		"Clearly label form fields and errors so people know exactly what's needed.",
		'pojo-accessibility',
	),
	keyboardAssistiveTech: __(
		'Make sure people can fully use your site with only a keyboard, no mouse required.',
		'pojo-accessibility',
	),
	pageStructureNav: __(
		'Use headings and clear structure to help people easily navigate your content.',
		'pojo-accessibility',
	),
	headingStructure: __(
		'Headings help screen reader users and search engines read pages in the right order. The structure should be organized and each heading given a level.',
		'pojo-accessibility',
	),
	tables: __(
		'Give tables clear headers and captions so everyone can easily understand the data.',
		'pojo-accessibility',
	),
	colorContrast: __(
		'Text and background lightness can hinder readability. Depending on text size, you may need to adjust the contrast level to improve accessibility.',
		'pojo-accessibility',
	),
	other: __(
		'Find and resolve additional accessibility issues to ensure your site works for everyone.',
		'pojo-accessibility',
	),
};

export const INITIAL_SORTED_VIOLATIONS = {
	altText: [],
	dynamicContent: [],
	formsInputsError: [],
	keyboardAssistiveTech: [],
	pageStructureNav: [],
	headingStructure: [],
	tables: [],
	colorContrast: [],
	other: [],
};

export const VIOLATION_TYPES = {
	altText: [
		'applet_alt_exists',
		'applet_alt_exists',
		'img_alt_redundant',
		'img_alt_valid',
		'img_alt_null',
		'area_alt_exists',
		'imagebutton_alt_exists',
		'imagemap_alt_exists',
		'img_alt_decorative',
		'object_text_exists',
		'svg_graphics_labelled',
	],
	dynamicContent: [
		'aria_parent_required',
		'combobox_popup_reference',
		'aria_activedescendant_valid',
		'combobox_active_descendant',
		'aria_role_valid',
		'combobox_autocomplete_valid',
		'combobox_focusable_elements',
		'combobox_haspopup_valid',
		'aria_descendant_valid',
		'aria_role_allowed',
		'aria_attribute_allowed',
		'aria_attribute_conflict',
		'aria_attribute_exists',
		'aria_attribute_required',
		'aria_attribute_value_valid',
		'aria_eventhandler_role_valid',
		'aria_id_unique',
		'aria_widget_labelled',
		'combobox_design_valid',
		'element_id_unique',
		'element_accesskey_unique',
		'aria_attribute_valid',
	],
	formsInputsError: [
		'label_content_exists',
		'input_checkboxes_grouped',
		'fieldset_label_valid',
		'form_label_unique',
		'label_ref_valid',
		'input_autocomplete_valid',
		'error_message_exists',
		'input_label_after',
		'input_label_before',
		'input_label_exists',
	],
	keyboardAssistiveTech: [
		'aria_hidden_nontabbable',
		'aria_activedescendant_tabindex_valid',
		'aria_child_tabbable',
		'element_scrollable_tabbable',
		'iframe_interactive_tabbable',
		'a_text_purpose',
		'label_name_visible',
		'html_lang_exists',
		'html_lang_valid',
		'element_lang_valid',
		'input_haspopup_conflict',
		'element_tabbable_role_valid',
	],
	headingStructure: [
		'single_h1_check',
		'missing_h1_check',
		'heading_hierarchy_check',
	],
	pageStructureNav: [
		'table_headers_ref_valid',
		'table_scope_valid',
		'table_headers_exists',
		'table_headers_related',
		'table_structure_misuse',
		'dir_attribute_valid',
		'aria_application_label_unique',
		'aria_application_labelled',
		'aria_article_label_unique',
		'aria_banner_label_unique',
		'aria_banner_single',
		'aria_complementary_label_unique',
		'aria_complementary_labelled',
		'aria_content_in_landmark',
		'aria_contentinfo_label_unique',
		'aria_contentinfo_single',
		'aria_document_label_unique',
		'aria_form_label_unique',
		'aria_landmark_name_unique',
		'aria_main_label_unique',
		'aria_navigation_label_unique',
		'aria_region_label_unique',
		'aria_region_labelled',
		'aria_search_label_unique',
		'aria_toolbar_label_unique',
		'skip_main_exists',
		'page_title_exists',
		'frame_title_exists',
		'list_children_valid',
		'table_aria_descendants',
	],
	tables: [
		'table_caption_empty',
		'table_caption_nested',
		'table_summary_redundant',
	],
	colorContrast: ['text_spacing_valid', 'text_contrast_sufficient'],
	other: [
		'element_orientation_unlocked',
		'meta_redirect_optional',
		'blink_elem_deprecated',
		'marquee_elem_avoid',
	],
};

export const EXCLUDE_FROM_AI = ['aria_content_in_landmark'];
