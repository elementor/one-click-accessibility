import {
	ColorBlue100,
	ColorBlue300,
	ColorBlue400,
	ColorBlue50,
	ColorBlue600,
} from '@elementor/design-tokens/primitives';
import AlignLeftIcon from '@elementor/icons/AlignLeftIcon';
import LinkIcon from '@elementor/icons/LinkIcon';
import WorldIcon from '@elementor/icons/WorldIcon';
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
	'language-selector': {
		title: __('Language selector', 'pojo-accessibility'),
		chartsTitle: __('Language selector', 'pojo-accessibility'),
		icon: <WorldIcon sx={ICON_STYLE} />,
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
