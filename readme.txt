=== One Click Accessibility ===
Contributors: pojo.me, KingYes, ariel.k, jzaltzberg, bainternet
Tags: Accessibility, A11y, Toolbar, Tools, wcag, accessible
Requires at least: 4.1
Tested up to: 6.1
Requires PHP: 5.4
Stable tag: 2.1.0
License: GPLv2 or later

The One Click Accessibility toolbar is the fastest plugin to help you make your WordPress website more accessible.

== Description ==

The One Click Accessibility toolbar is the fastest plugin to help you make your WordPress website more accessible.

While most accessibility issues can’t be addressed without directly changing your content, One Click Accessibility adds a number of helpful accessibility features with the minimum amount of setup and without the need for expert knowledge.

**Accessibility Toolbar:**

Add a toolbar toggling hat allows you to set:

* Resize font (increase/decrease)
* Grayscale
* Negative Contrast
* High Contrast
* Light Background
* Links Underline
* Readable Font
* Link to Sitemap / Feedback / Help pages

**Accessibility Features:**

* Enable skip to content
* Add outline focus for focusable elements
* Remove the target attribute from links
* Add landmark roles to all links
* Customizer for style adjustment

**Contributions:**

Would you like to contribute to One Click Accessibility? You are more than welcome to submit your requests on the [GitHub repo](https://github.com/pojome/one-click-accessibility/). Also, if you have any notes about the code, please open a ticket on this issue tracker.

== Installation ==

**Automatic Installation**

1. Install using the WordPress built-in Plugin installer > Add New
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Go to the plugin page (under Dashboard > Accessibility)
1. Enjoy!

**Manual Installation**

1. Extract the zip file and just drop the contents in the <code>wp-content/plugins/</code> directory of your WordPress installation
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Go to the plugin page (under Dashboard > Accessibility)
1. Enjoy!

== Screenshots ==

1. Accessibility Customizer
2. Accessibility Toolbar
3. Grayscale Mode
4. Negative Contrast Mode

== Changelog ==

= 2.1.0 - 2022-12-18 =
* New: Added custom element ID for "Skip Content" link ([#35](https://github.com/pojome/one-click-accessibility/issues/35)), ([#36](https://github.com/pojome/one-click-accessibility/issues/36))
* Tweak: Added title for all SVG icons ([#30](https://github.com/pojome/one-click-accessibility/issues/30))
* Tweak: Add `role="button"` to the toggle ([#57](https://github.com/pojome/one-click-accessibility/pull/57))
* Tweak: Changed the default icon to "One Click"
* Fix: Remove extra quote ([Topic](https://wordpress.org/support/topic/bug-317/))
* Fix: High Contrast and Negative Contrast still appear after disabled from the settings ([#39](https://github.com/pojome/one-click-accessibility/issues/39))
* Fix: Added compatibility with Twenty Twenty theme

= 2.0.3 - 2018-05-28 =
* Fix: Toolbar settings panel empty in non-English sites
* Fix: Avoid showing Help & Feedback links if not defined ([#27](https://github.com/pojome/one-click-accessibility/pull/27))

= 2.0.2 - 2018-05-03 =
* Fix! - Added default settings for toolbar title
* Fix! - Print CSS rules before code to fix responsive issues
* Fix! - Added visibility CSS to fix dependency issues

= 2.0.1 - 2018-05-02 =
* Fix! - Increased icon size in the toolbar
* Tweak! - Restored `sr-only` class for smooth update

= 2.0.0 - 2018-05-01 =
* Tweak! - Renamed plugin to One Click Accessibility
* Tweak! - Added an option to select an toolbar icon
* Tweak! - Split Settings Panel to Settings and Toolbar
* Tweak! - Removed FontAwesome dependency
* Tweak! - Removed Bootstrap dependency
* Tweak! - Removed Pojo Framework dependency

= 1.1.6 - 2017-10-26 =
* Fix! - Border with RGBA is hidden in high contrast mode

= 1.1.5 - 2016-03-09 =
* Tweak! - Fix minor style issue

= 1.1.4 - 2016-02-23 =
* Fixed! - tabindex on custom links issue

= 1.1.3 - 2016-02-21 =
* Tweak! - Resolve the focus issues by another way

= 1.1.2 - 2016-02-10 =
* Fixed! - Triggering blur after focus to avoid auto-focus by browser on tab reactivated

= 1.1.1 - 2016-02-08 =
* Tweak! - Added more hebrew strings translate 
* Tested up to WordPress v4.4

= 1.1.0 - 2016-02-07 =
* New! - Remember toolbar options

= 1.0.3 - 2016-01-27 =
* Fixed! - Issue with sidebar in Resize text
* Tweak! - Added more string fields for WPML/Polylang plugins

= 1.0.2 - 2015-12-08 =
* Tweak! - Fixed hebrew translate

= 1.0.1 - 2015-11-17 =
* New! - Added distance from top toolbar, in Desktop/Mobile devices
* Fixed! - Skip to content in Chrome

= 1.0.0 - 2015-10-29 =
* Initial Public Release!
