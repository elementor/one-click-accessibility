import { __, sprintf } from '@wordpress/i18n';

/* eslint-disable @wordpress/i18n-translator-comments */
export const Statement = `
<!-- wp:heading {"textAlign":"center","level":6} -->
<h6 class="wp-block-heading has-text-align-center">${sprintf(__('Accessibility Statement for %s', 'pojo-accessibility'), '{company_website}')}</h6>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>${sprintf(__('%s is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.', 'pojo-accessibility'), '<strong>{company_name}</strong>')}</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":6} -->
<h6>${__('Conformance status', 'pojo-accessibility')}</h6>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>${__('The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.', 'pojo-accessibility')}</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>${sprintf(__('%s is making constant efforts to improve the accessibility of its site and services in the belief that it is our collective moral obligation to allow seamless, accessible, and unhindered use for those of us with disabilities.', 'pojo-accessibility'), '<strong>{company_name}</strong>')}</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>${sprintf(__('We aim to make all pages and content on %s accessible, but some content may not yet fully meet the highest accessibility standards. This could be due to challenges in identifying the most suitable technological solution.', 'pojo-accessibility'), '<strong>{company_website}</strong>')}</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>${__('We may revise this Statement periodically to reflect improvements or changes to our accessibility practices.', 'pojo-accessibility')}</p>
<!-- /wp:paragraph -->
<!-- wp:heading {"level":6} -->
<h6>${__('Feedback', 'pojo-accessibility')}</h6>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>${sprintf(__('We welcome your feedback on the accessibility of %s website. Please let us know if you encounter accessibility barriers on our website:', 'pojo-accessibility'), '<strong>{company_name}</strong>')}</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>${sprintf(__('E-mail: %s', 'pojo-accessibility'), '<strong>{company_email}</strong>')}</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>${__('We try to respond to feedback within 3–5 business days.', 'pojo-accessibility')}</p>
<!-- /wp:paragraph -->
<!-- wp:paragraph -->
<p>${sprintf(__('This statement was created on %s.', 'pojo-accessibility'), '{current_date}')} </p>
<!-- /wp:paragraph -->`;
