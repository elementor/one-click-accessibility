import { __ } from '@wordpress/i18n';

/**
 * Heading structure definition.
 *
 * @typedef {Object} Ea11yHeading
 * @property {1 | 2 | 3 | 4 | 5 | 6 | null}    level         - Heading level.
 * @property {string}                          content       - The innerText of the heading.
 * @property {HTMLElement}                     node          - Heading node. Could be not an instance of HTMLHeadingElement.
 * @property {Ea11yHeading[]}                  children      - Child nodes of the heading.
 * @property {'success' | 'error' | 'warning'} status        - Validation status.
 * @property {string | null}                   violationCode - Validation violation code.
 */

/**
 * Heading validation stats definition.
 *
 * @typedef {Object} Ea11yHeadingStats
 * @property {number} total   - Total number of headings.
 * @property {number} success - Headings passed validation.
 * @property {number} error   - Number of headings with violations.
 * @property {number} warning - Number of headings with warnings.
 */

export const HEADING_STATUS = Object.freeze({
	SUCCESS: 'success',
	ERROR: 'error',
	WARNING: 'warning',
});

export const HEADING_STATUS_DESCRIPTION = Object.freeze({
	[HEADING_STATUS.SUCCESS]: __('Validation passed', 'pojo-accessibility'),
	[HEADING_STATUS.ERROR]: __('Validation error', 'pojo-accessibility'),
	[HEADING_STATUS.WARNING]: __('Has a warning', 'pojo-accessibility'),
});
