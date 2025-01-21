import { __, sprintf } from '@wordpress/i18n';

/* eslint-disable @wordpress/i18n-translator-comments */
export const Statement = `
<!-- wp:heading {"level":6} -->
<h6>${sprintf(__('Accessibility Statement for %s', 'pojo-accessibility'), '{company_website}')}</h6>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>${sprintf(__('%s is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.', 'pojo-accessibility'), '{company_name}')}</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":6} -->
<h6>${__('Conformance status', 'pojo-accessibility')}</h6>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>${__('The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.', 'pojo-accessibility')}</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>${sprintf(__('As of the date of this statement, %s website is partially conformant with WCAG 2.2 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.', 'pojo-accessibility'), '{company_name}')}</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>${__('We are currently working on remediating our website to ensure the best quality usability for all of our users.', 'pojo-accessibility')}</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":6} -->
<h6>${__('Feedback', 'pojo-accessibility')}</h6>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>${sprintf(__('We welcome your feedback on the accessibility of %s website. Please let us know if you encounter accessibility barriers on our website:', 'pojo-accessibility'), '{company_name}')}</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>${sprintf(__('E-mail: %s', 'pojo-accessibility'), '{company_email}')}</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>${__('We try to respond to feedback within 3–5 business days.', 'pojo-accessibility')}</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>${sprintf(__('This statement was created on %s.', 'pojo-accessibility'), '{current_date}')} </p>
<!-- /wp:paragraph -->`;
