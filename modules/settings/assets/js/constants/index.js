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
import SitemapIcon from '@ea11y/icons/sitemap-icon';
import { __ } from '@wordpress/i18n';

export const HELP_LINK = 'https://go.elementor.com/acc-main-help/';
export const UPGRADE_LINK = 'https://go.elementor.com/';
export const LEARN_MORE_LINK =
	'https://go.elementor.com/acc-statement-learn-more/';

export const SKELETON_OPTIONS = Object.freeze({
	SPEED: 2,
	FOREGROUND_COLOR: '#D9D9D9',
});

export const WIDGET_PREVIEW_ID = 'ea11y-widget-preview--container';
export const WIDGET_PREVIEW_ROOT = 'ea11y-root';

export const ICON_STYLE = { color: 'black' };

export const TABLE_PER_PAGE = 10;

export const FEATURE_MAPPER = {
	'bigger-text': {
		title: __('Adjust text size', 'pojo-accessibility'),
		icon: <TextSizeIcon sx={ICON_STYLE} />,
	},
	'bigger-line-height': {
		title: __('Adjust line height', 'pojo-accessibility'),
		icon: <LineHeightIcon sx={ICON_STYLE} />,
	},
	'text-align': {
		title: __('Align text', 'pojo-accessibility'),
		icon: <AlignLeftIcon sx={ICON_STYLE} />,
	},
	'readable-font': {
		title: __('Readable font', 'pojo-accessibility'),
		icon: <ReadableFontIcon sx={ICON_STYLE} />,
	},
	grayscale: {
		title: __('Greyscale', 'pojo-accessibility'),
		icon: <GrayscaleIcon sx={ICON_STYLE} />,
	},
	contrast: {
		title: __('Contrast', 'pojo-accessibility'),
		icon: <ContrastIcon sx={ICON_STYLE} />,
	},
	'page-structure': {
		title: __('Page structure', 'pojo-accessibility'),
		icon: <PageStructureIcon sx={ICON_STYLE} />,
	},
	sitemap: {
		title: __('Sitemap', 'pojo-accessibility'),
		icon: <SitemapIcon sx={ICON_STYLE} />,
	},
	'reading-mask': {
		title: __('Reading mask', 'pojo-accessibility'),
		icon: <ReadingPanelIcon sx={ICON_STYLE} />,
	},
	'hide-images': {
		title: __('Hide images', 'pojo-accessibility'),
		icon: <HideImagesIcon sx={ICON_STYLE} />,
	},
	'pause-animations': {
		title: __('Pause animations', 'pojo-accessibility'),
		icon: <PauseAnimationsIcon sx={ICON_STYLE} />,
	},
	'highlight-links': {
		title: __('Highlight links', 'pojo-accessibility'),
		icon: <LinkIcon sx={ICON_STYLE} />,
	},
	'focus-outline': {
		title: __('Outline focus', 'pojo-accessibility'),
		icon: <FocusIcon sx={ICON_STYLE} />,
	},
	other: {
		title: __('Other', 'pojo-accessibility'),
	},
};

export const CHARTS_COLORS = [
	ColorBlue600,
	ColorBlue400,
	ColorBlue300,
	ColorBlue100,
	ColorBlue50,
];
