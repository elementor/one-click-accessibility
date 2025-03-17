import {
	ColorBlue600,
	ColorBlue400,
	ColorBlue300,
	ColorBlue100,
	ColorBlue50,
} from '@elementor/design-tokens/primitives';
import AlignLeftIcon from '@elementor/icons/AlignLeftIcon';
import LinkIcon from '@elementor/icons/LinkIcon';
import {
	ContrastIcon,
	GrayscaleIcon,
	HideImagesIcon,
	LineHeightIcon,
	PageStructureIcon,
	PauseAnimationsIcon,
	ReadableFontIcon,
	ReadingPanelIcon,
	TextSizeIcon,
} from '@ea11y/icons';
import FocusIcon from '@ea11y/icons/focus-icon';
import HideWidgetIcon from '@ea11y/icons/hide-widget-icon';
import ScreenReaderIcon from '@ea11y/icons/screen-reader-icon';
import SitemapIcon from '@ea11y/icons/sitemap-icon';
import StatementIcon from '@ea11y/icons/statement-icon';
import { __ } from '@wordpress/i18n';

export const SUBSCRIPTION_LINK = 'https://my.elementor.com';

export const SKELETON_OPTIONS = Object.freeze({
	SPEED: 2,
	FOREGROUND_COLOR: '#D9D9D9',
});

export const WIDGET_PREVIEW_ID = 'ea11y-widget-preview--container';
export const WIDGET_PREVIEW_ROOT = 'ea11y-root';

// As a standard structure use - in feature names.
export const PRO_FEATURES = {
	REMOVE_BRANDING: 'remove-elementor-label',
};

export const GOLINKS = {
	UPGRADE_80: 'https://go.elementor.com/acc-80-quota',
	UPGRADE_95: 'https://go.elementor.com/acc-95-quota',
	UPGRADE_100: 'https://go.elementor.com/acc-100-quota',
	SCREEN_READER_ICON: 'https://go.elementor.com/acc-screen-reader-icon',
	SCREEN_READER_TOGGLE: 'https://go.elementor.com/acc-screen-reader-toggle',
	ALLY_LABEL_ICON: 'https://go.elementor.com/acc-label-icon',
	ALLY_LABEL_TOGGLE: 'https://go.elementor.com/acc-label-toggle',
	ANALYTICS_POPUP: 'https://go.elementor.com/acc-stats-popup',
	ADD_VISITS: 'https://go.elementor.com/acc-add-visits',
	HELP: 'https://go.elementor.com/acc-main-help',
	LEARN_MORE_STATEMENT: 'https://go.elementor.com/acc-statement-learn-more',
	UPGRADE: 'https://go.elementor.com/acc-upgrade',
};

export const ICON_STYLE = { color: 'black' };

export const TABLE_PER_PAGE = 10;

export const FEATURE_MAPPER = {
	'bigger-text': {
		title: __('Bigger text', 'pojo-accessibility'),
		chartsTitle: __('Bigger text', 'pojo-accessibility'),
		icon: <TextSizeIcon sx={ICON_STYLE} />,
	},
	'bigger-line-height': {
		title: __('Bigger line height', 'pojo-accessibility'),
		chartsTitle: __('Bigger line height', 'pojo-accessibility'),
		icon: <LineHeightIcon sx={ICON_STYLE} />,
	},
	'text-align': {
		title: __('Text align', 'pojo-accessibility'),
		chartsTitle: __('Align text', 'pojo-accessibility'),
		icon: <AlignLeftIcon sx={ICON_STYLE} />,
	},
	'readable-font': {
		title: __('Readable font', 'pojo-accessibility'),
		chartsTitle: __('Readable font', 'pojo-accessibility'),
		icon: <ReadableFontIcon sx={ICON_STYLE} />,
	},
	grayscale: {
		title: __('Greyscale', 'pojo-accessibility'),
		chartsTitle: __('Greyscale', 'pojo-accessibility'),
		icon: <GrayscaleIcon sx={ICON_STYLE} />,
	},
	contrast: {
		title: __('Contrast', 'pojo-accessibility'),
		chartsTitle: __('Contrast', 'pojo-accessibility'),
		icon: <ContrastIcon sx={ICON_STYLE} />,
	},
	'page-structure': {
		title: __('Page structure', 'pojo-accessibility'),
		chartsTitle: __('Page structure', 'pojo-accessibility'),
		icon: <PageStructureIcon sx={ICON_STYLE} />,
	},
	sitemap: {
		title: __('Sitemap', 'pojo-accessibility'),
		chartsTitle: __('Sitemap', 'pojo-accessibility'),
		icon: <SitemapIcon sx={ICON_STYLE} />,
	},
	'reading-mask': {
		title: __('Reading mask', 'pojo-accessibility'),
		chartsTitle: __('Reading mask', 'pojo-accessibility'),
		icon: <ReadingPanelIcon sx={ICON_STYLE} />,
	},
	'hide-images': {
		title: __('Hide images', 'pojo-accessibility'),
		chartsTitle: __('Hide images', 'pojo-accessibility'),
		icon: <HideImagesIcon sx={ICON_STYLE} />,
	},
	'pause-animations': {
		title: __('Pause animations', 'pojo-accessibility'),
		chartsTitle: __('Pause animations', 'pojo-accessibility'),
		icon: <PauseAnimationsIcon sx={ICON_STYLE} />,
	},
	'highlight-links': {
		title: __('Highlight links', 'pojo-accessibility'),
		chartsTitle: __('Highlight links', 'pojo-accessibility'),
		icon: <LinkIcon sx={ICON_STYLE} />,
	},
	'focus-outline': {
		title: __('Outline focus', 'pojo-accessibility'),
		chartsTitle: __('Outline focus', 'pojo-accessibility'),
		icon: <FocusIcon sx={ICON_STYLE} />,
	},
	'hide-widget': {
		title: __('Hide widget', 'pojo-accessibility'),
		chartsTitle: __('Hide widget', 'pojo-accessibility'),
		icon: <HideWidgetIcon />,
	},
	statement: {
		title: __('Statement', 'pojo-accessibility'),
		chartsTitle: __('Statement', 'pojo-accessibility'),
		icon: <StatementIcon />,
	},
	'screen-reader': {
		title: __('Screen reader', 'pojo-accessibility'),
		chartsTitle: __('Screen reader', 'pojo-accessibility'),
		icon: <ScreenReaderIcon />,
		pro: true,
	},
	other: {
		title: __('Other', 'pojo-accessibility'),
		chartsTitle: __('Other', 'pojo-accessibility'),
	},
};

export const CHARTS_COLORS = [
	ColorBlue600,
	ColorBlue400,
	ColorBlue300,
	ColorBlue100,
	ColorBlue50,
];
