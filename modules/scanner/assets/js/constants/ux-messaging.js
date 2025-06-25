import { __ } from '@wordpress/i18n';

export const uxMessaging = {
	table_caption_empty: {
		violationName: __('Missing or Unclear Table Caption', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Table captions must clearly describe the table.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If a table caption doesn’t describe the table’s purpose, people relying on assistive technologies may struggle to understand what the information relates to.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give every data table a short caption that tells people what the table shows.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A table caption is missing or says something vague like "Table 1," giving users no real idea what the table is about',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'For a pricing table, add a caption that says “Monthly vs. Annual Plans.” For a class‑attendance table, add “Boys and Girls in Elementary School Classes.”',
					'pojo-accessibility',
				),

				__(
					"Table needs a descriptive caption like 'Monthly vs. Annual Plans'.",
					'pojo-accessibility',
				),
			],
		},
	},
	table_caption_nested: {
		violationName: __('Table Caption Placement', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Captions must be placed inside their tables.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If the caption isn’t properly placed inside the table, people relying on assistive technologies may not know which caption belongs to which table, leading to confusion.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Add the caption as part of the table, not as separate text above or below it.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A table caption is written outside the table code, making it harder for assistive technologies to connect the caption with the correct table.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Select your table block or widget and look for a field called Caption or Title. Type something like “Fruit Sales 2025” there—this attaches the label directly to the table. If you already wrote the caption as a regular heading or paragraph just above the table, cut that text and paste it into the table’s Caption field instead.',
					'pojo-accessibility',
				),

				__(
					"Make sure the caption (e.g., 'Fruit Sales 2025') is placed inside the table itself, not outside.",
					'pojo-accessibility',
				),
			],
		},
	},
	table_summary_redundant: {
		violationName: __('Missing or Unclear Table Caption', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Table summaries must add new information, not repeat the caption.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If the summary just repeats the caption, it doesn’t give people any additional context, making it less useful for people relying on assistive technologies.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Keep just one clear caption or add a short extra note only if the caption needs help.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A table’s caption says "Sales Data 2024" and its summary says exactly the same thing, providing no extra help for screen reader users.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Caption is enough: If the caption already says “Monthly Budget Breakdown,” delete any extra “Summary” paragraph that repeats those same words. Caption needs a bit more: If your caption is “Age Demographics by Country” but readers also need to know the columns are “0‑14, 15‑64, 65+,” add one short sentence right before the table that explains those age groups—then keep the caption as is.',
					'pojo-accessibility',
				),

				__(
					'Avoid repeating the caption in the summary; only add details if they help clarify the table.',
					'pojo-accessibility',
				),
			],
		},
	},
	label_content_exists: {
		violationName: __('Unclear Form Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Labels must clearly describe the purpose of form fields.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If a label doesn’t clearly describe the form field’s purpose, people relying on assistive technologies may not know what to do, leading to mistakes or frustration.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give every input or checkbox a short label that tells people what to enter or choose.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A form label is empty or too vague (like "Field 1"), making it unclear what information the user should enter.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'An email field with no label should read “Email address.” A blank checkbox label becomes “Subscribe to newsletter.”',
					'pojo-accessibility',
				),

				__(
					'Every form input must have a meaningful label, like “Email address” or “Subscribe to newsletter.”',
					'pojo-accessibility',
				),
			],
		},
	},
	text_spacing_valid: {
		violationName: __('Fixed Text Spacing', 'pojo-accessibility'),
		whatsTheIssue: __(
			"Text spacing shouldn't be locked, so people can adjust readability.",
			'pojo-accessibility',
		),
		whyItMatters: __(
			'When spacing can’t be adjusted, people with dyslexia or visual impairments may struggle to read comfortably.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Don’t lock the distance between letters, words, or lines—use your theme’s normal text settings, and let visitors change spacing if they need to.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A block of text has fixed spacing that users can’t change, making it harder for people with reading difficulties to read comfortably.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'If you added custom styling that forces very tight or very wide text, remove that custom rule and rely on the theme’s built‑in font controls instead.',
					'pojo-accessibility',
				),

				__(
					'Text must use flexible spacing so users can adjust it for better readability.',
					'pojo-accessibility',
				),
			],
		},
	},
	text_contrast_sufficient: {
		violationName: __('Insufficient Color Contrast', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Text must have enough contrast against the background.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If text doesn’t have enough contrast with the background, many people may struggle to read it, especially those with visual impairments or when viewing on different screens.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Choose color pairs that are easy to read—darken the text or lighten the background (or both) until a contrast‑checker says the combination passes accessibility tests.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Light gray text on a white background is hard to read, especially for users with low vision.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Light‑gray body text on a white page looks faint; change the text to a darker gray or black, or place it on a pale‑gray card. White words on a pastel‑blue button can be hard to see; keep the white text but deepen the blue to navy so it pops. Large headings can tolerate slightly softer contrast than small body text, but they still need to stand out clearly—check both sizes with a free online contrast‑checker.',
					'pojo-accessibility',
				),

				__(
					'Use a contrast‑checker to ensure text and background colors meet accessibility guidelines.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_parent_required: {
		violationName: __('Incorrect Element Container', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Elements must be placed inside the right type of container.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If elements aren’t placed inside the right containers, screen readers and other assistive tools may misinterpret the page, making navigation and understanding harder for people.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make sure every custom option (for example, a dropdown item) is placed inside the menu or list it belongs to—not floating on its own.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An interactive element is put inside a section that doesn’t support it, making it confusing for assistive technologies.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'You created a custom dropdown with three choices, but the choices were added as separate text blocks instead of being grouped together. Re‑add the choices using your theme’s “List / Menu / Dropdown” block so they sit inside one container. A single “Color: Blue” option was accidentally dragged outside its product‑options list. Move it back into the list so screen‑reader users know it’s part of the same group.',
					'pojo-accessibility',
				),

				__(
					'Make sure items like dropdown options or list entries live inside the proper container widget.',
					'pojo-accessibility',
				),
			],
		},
	},
	combobox_popup_reference: {
		violationName: __('Dropdown Open State Incorrect', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Dropdowns must correctly link to the popup they open.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If the dropdown isn’t properly linked to its popup, people relying on screen readers or keyboards might not know where the new content appeared, making it harder to navigate and interact.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make sure the list of suggestions belongs to the same search or tag box that opens it so it pops up right below the field and moves with keyboard arrows.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A dropdown expands, but the connection to the popup isn’t set up properly, making it confusing for assistive technology users.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'You built a “Tag” field that suggests words as people type, but the suggestion list sits off to the side. Re‑add the field with your form or theme’s “Autocomplete / Tag Input” option so the list is directly linked and appears under the box. A search bar shows results in a floating panel that isn’t tied to the input. Move the panel into the same widget or block, ensuring the list opens and closes together with the box.',
					'pojo-accessibility',
				),

				__(
					'Ensure dropdown suggestions are correctly linked to the input field they belong to.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_activedescendant_valid: {
		violationName: __('Incorrectly Highlighted Options', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Highlighted options must point to visible content.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If a highlighted option is hidden or empty, people relying on keyboards or assistive technologies may get stuck or lose track of where they are.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make sure the option that looks selected is actually in the list and easy to see.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A dropdown highlights a choice that is hidden or missing, confusing keyboard users.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'In a product‑category dropdown, if “Shoes” appears in the box but isn’t listed when you open the dropdown, add “Shoes” back to the list or choose a different category that really exists. For a set of radio buttons, if “Thin Crust” is shown as chosen but the button isn’t visible, un‑hide “Thin Crust” or pick another visible choice.',
					'pojo-accessibility',
				),

				__(
					'Ensure selected or highlighted options are visible and present in the dropdown or group.',
					'pojo-accessibility',
				),
			],
		},
	},
	combobox_active_descendant: {
		violationName: __('Keyboard Navigation Issues', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Keyboard focus must stay on choices inside the dropdown.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If focus doesn’t follow the highlighted choice inside a dropdown, keyboard people may have trouble knowing where they are or selecting the right option.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'When a search or tag box shows suggestions, the blinking cursor should stay in the box while the ↑ / ↓ keys simply move the highlight through the list.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'When using the keyboard to open a dropdown, the highlighted option doesn’t stay properly focused, making it hard to choose.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'In a “Tag” field, pressing ↓ should highlight “Zoom” in the dropdown, but you should still see the cursor inside the box so you can keep typing. If the cursor jumps out of the box and into the list—so you can’t type anymore—rebuild or adjust the widget so the list opens below the box without stealing the cursor. Selecting a suggestion should copy the word into the box and close the list.',
					'pojo-accessibility',
				),

				__(
					'Ensure arrow key navigation highlights options while keeping the input field focused.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_role_valid: {
		violationName: __('Mismatched Element Role', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Labels for assistive technologies must match the type of content.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If role labels don’t match the actual content, assistive technology people may get wrong information about what things are and how to interact with them.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Choose the built‑in block or widget that already does what you need (Button, Heading, List, etc.)—don’t repurpose a generic text or box element and hope it acts like one.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An image is labeled like a button, which confuses screen reader users.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'You made a paragraph look like a button with bold text and color. Swap it for your theme’s Button block so visitors—and assistive tech—instantly know it can be clicked. A plain text block was styled to look like a heading. Replace it with the Heading block so screen‑reader users can jump to it quickly.',
					'pojo-accessibility',
				),

				__(
					'Ensure that elements are properly labeled with their respective roles, like using a button element for clickable actions and a heading element for headings.',
					'pojo-accessibility',
				),
			],
		},
	},
	combobox_autocomplete_valid: {
		violationName: __('Autocomplete Incorrect Usage', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Autocomplete settings must be applied only to the text field.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If autocomplete isn’t set up properly, people relying on keyboards or screen readers may struggle to enter information or select options.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Let the typing box decide how suggestions appear. Remove any “autocomplete” setting from the dropdown list itself, and pick the option (inline text, dropdown list, or both) that matches what users see.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A dropdown with autocomplete puts settings on the wrong parts, making it harder for assistive technology users to interact correctly.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Your “State” field shows a dropdown list as people type. Keep the autocomplete setting only on the box and choose “show list suggestions.” Don’t add extra settings to the list below. A search bar fills in the rest of the word right inside the box but never opens a list. Set the box to “inline suggestions” and leave the list turned off. If your tag picker shows both inline text and a dropdown, choose “both suggestions” on the box and make sure the list appears right under it.',
					'pojo-accessibility',
				),

				__(
					'Ensure autocomplete settings are applied correctly, either within the text input field or appropriately with the dropdown list.',
					'pojo-accessibility',
				),
			],
		},
	},
	combobox_focusable_elements: {
		violationName: __('Dropdown Incorrect Focus', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Only the text field in a dropdown should be focusable.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If focus moves to the wrong parts of a dropdown, it can confuse people and make the site harder to navigate with a keyboard.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'When the box appears, the blinking cursor should land in the text field—not on one of the suggestions below it.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'When using the Tab key, users can accidentally focus parts of the dropdown that aren’t meant for direct typing or selection.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'In a “State” search field, clicking or tabbing into the box should put the cursor in the empty field so you can start typing. If the first suggestion (“Alabama”) is highlighted instead, adjust the widget so the cursor begins in the box. A product search overlay opens with the cursor sitting on a result link. Move the starting focus back to the search field, so users can type or paste their query immediately.',
					'pojo-accessibility',
				),

				__(
					'Ensure the cursor always starts in the input field, not on suggestions, to facilitate proper keyboard navigation.',
					'pojo-accessibility',
				),
			],
		},
	},
	combobox_haspopup_valid: {
		violationName: __('Popup Type Misdescribed', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Dropdowns must correctly describe the type of popup they open.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If a dropdown describes the wrong type of popup, people using screen readers may not understand what will appear, making it harder to use the site.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Tell the autocomplete box to open the correct type of helper, usually a simple dropdown list, so assistive tools know what to expect.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A dropdown says it opens a menu, but it actually opens a calendar, confusing assistive technology users.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Your “Tag” field shows a straight list of suggestions. In the widget’s settings, pick the option for “Dropdown list” (or similar) instead of leaving it undefined. If your search box opens a larger pop‑up panel with extra filters, choose the setting that labels it as a “Dialog” so screen readers announce it properly.',
					'pojo-accessibility',
				),

				__(
					'Ensure the correct popup type is described in the settings (e.g., Dropdown list, Dialog) to improve accessibility for screen reader users.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_descendant_valid: {
		violationName: __('Invalid Nested Elements', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Some content inside certain elements may not behave as expected.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If browsers ignore labels inside certain elements, people relying on assistive technologies might miss important information or have a harder time navigating the content.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Keep options, menu items, and buttons simple. Don’t put extra buttons, links, or headings inside them.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Adding special labels inside a table or list might be ignored by browsers, causing confusion for assistive technology users.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A dropdown choice was built as a button inside another button. Replace the inner button with plain text so each choice is just one item, not a widget within a widget. A list item in a custom select menu contains a heading block. Change the heading to regular text (or bold styling) so the list stays clean and easy for assistive tech to read. Removing extra nested elements prevents confusion and lets screen‑reader users move through menus and lists without surprises.',
					'pojo-accessibility',
				),

				__(
					'Avoid nesting buttons, links, or headings inside menu items or options. Keep elements simple and straightforward for better accessibility.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_role_allowed: {
		violationName: __('Invalid Element Role', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Elements must use correct labels for assistive technologies.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If the role is wrong or invalid, assistive technologies can’t correctly explain the purpose of the content, making the site harder to navigate and understand.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Pick the widget that already matches what you need. Don’t assign a fancy role to an element that wasn’t built for it.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An element is given a role that doesn’t exist or isn’t allowed, making it confusing for screen reader users.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'You styled a plain box to act like a scrollbar. Replace it with your theme’s built-in Scroll area or let the browser’s own scrollbar appear naturally. A decorative icon was given a role that says “button,” but it does nothing. Remove that role or turn the icon into an actual button with a click action.',
					'pojo-accessibility',
				),

				__(
					'Avoid assigning incorrect or non-existent roles to elements. Use the correct role for the content to ensure clarity for assistive technologies.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_attribute_allowed: {
		violationName: __('Invalid ARIA Attributes', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Labels and properties must match the type of content.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If labels or properties don’t match the content type, assistive technologies may misread the page, making it harder for people to understand and interact with it.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'When you use an accessibility setting (like “live update” or “busy”), pick one of the values the spec allows. No made-up words or empty fields.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A button is given attributes meant for a table, which can confuse screen readers.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A status message uses “live update: polite” (allowed). Change any custom value like “gentle” to “polite” so screen readers handle it correctly. A busy-indicator flag must be either “true” or “false.” If it’s blank, set it to the proper choice or remove the flag.',
					'pojo-accessibility',
				),

				__(
					'Ensure that accessibility attributes match the content type, using values that are part of the accessibility specifications.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_attribute_conflict: {
		violationName: __('ARIA Conflicting Attributes', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Labels and settings must not conflict with built-in HTML behavior.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If labels or settings conflict, assistive technologies might behave unpredictably, making the site harder to use for people relying on them.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'If an input is already marked as required (or has any other HTML setting), don’t add an extra ARIA tag that says the same thing. Pick one or the other.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An element has two different settings for the same feature — one from HTML and one from ARIA — causing confusion for assistive technologies.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A phone-number field has both the standard “Required” toggle turned on and an extra “required” flag in advanced settings. Turn off the duplicate so the form doesn’t announce “required” twice. A checkbox is labeled by visible text and also by an override in accessibility settings. Keep the visible label and remove the extra override to avoid confusion.',
					'pojo-accessibility',
				),

				__(
					'Ensure that ARIA and HTML settings don’t conflict with each other, particularly when describing the same functionality.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_attribute_exists: {
		violationName: __('Missing ARIA Attribute Value', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Required settings for assistive technologies must not be left empty.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If required information is missing, assistive technologies can’t explain how to use the feature properly, making the site harder to navigate and understand.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Fill in every required setting with one of the allowed choices. Never leave it blank.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An element includes a setting that’s supposed to give extra information, but the value is missing, leaving screen reader users without the details they need.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A message area is marked “live update” but the setting box is empty. Choose “polite” (or another allowed option) so screen-readers know how quickly to announce changes.',
					'pojo-accessibility',
				),

				__(
					'Ensure every required attribute or setting has a valid value so assistive technologies can process it correctly.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_attribute_required: {
		violationName: __('Required ARIA Attributes', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Important information must be included for assistive technologies.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			"If important details are missing, assistive technologies can't properly explain how to use a feature, making it harder for people to interact with the site.",
			'pojo-accessibility',
		),
		howToResolve: __(
			'Add any essential details the widget needs, such as minimum, maximum, and current value for a custom slider.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A slider is missing required information about its current value, making it confusing for screen reader users.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A vertical scroll bar shows but has no “top” or “bottom” value set. Enter 0 for minimum, 100 for maximum, and the current position (e.g., 25) so assistive tools can report progress accurately.',
					'pojo-accessibility',
				),

				__(
					'Ensure sliders have proper attributes like minimum, maximum, and current value for full accessibility.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_attribute_value_valid: {
		violationName: __('Incorrect ARIA Value', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Settings for assistive technologies must use correct values.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If the values are incorrect, assistive technologies might misread the content or stop working properly, making the site harder to use.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Replace any invented or misspelled value with one from the official list—for example, “polite,” “assertive,” “true,” or “false.”',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A dropdown uses a value that isn’t allowed, confusing screen readers and other assistive tools.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A status message is set to “gentle.” Change it to “polite” so screen-readers recognize it.',
					'pojo-accessibility',
				),

				__(
					'Ensure you use the correct, valid values for ARIA attributes to improve accessibility.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_eventhandler_role_valid: {
		violationName: __('Invalid Interactive Role', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Clickable or interactive elements must have the right label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If interactive elements aren’t labeled correctly, people using assistive technologies might not know they can click or use them, making the site harder to navigate.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Use the proper element for the action (Button, Link, etc.) or clearly label the custom element as such.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A clickable area doesn’t have a proper role, making it unclear to screen reader users that it can be interacted with.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A DIV styled as a button should be replaced with a real Button block, or labeled in accessibility settings as a button, so keyboards and screen-readers can activate it.',
					'pojo-accessibility',
				),

				__(
					'Ensure that interactive elements like buttons or links are properly labeled and identified to enhance usability for screen reader users.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_id_unique: {
		violationName: __('Duplicate ARIA IDs', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Labels must point to real, visible content.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If labels point to missing or hidden content, assistive technology people may get confused or miss important information on the page.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give each form helper (tooltip, hint, error) its own unique ID, and make sure the field’s “Described by” setting points to that exact ID.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An element references an ID that doesn’t exist or is hidden, leaving screen reader users without the right information.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Your “Last Name” input references “hint‑last‑name,” but no helper with that ID exists. Add a helper with that ID—or update the reference to the correct helper—to avoid confusion.',
					'pojo-accessibility',
				),

				__(
					'Ensure that each label points to an actual helper and that IDs are unique and correctly referenced to avoid confusion for screen reader users.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_widget_labelled: {
		violationName: __('Missing Widget Label', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Interactive elements must have a clear, accessible name.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If interactive elements don’t have a name, people relying on assistive technologies may not know how to interact with them, making the site confusing and harder to use.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give every interactive part (menu, slider, search icon, etc.) a short name that says what it does.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A button has no label, so screen reader users don’t know what it does.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Add a heading “Table of contents” just above a tree menu and link the menu to that heading so screen-readers announce it.',
					'pojo-accessibility',
				),

				__(
					'A magnifying-glass icon that opens search results gets a hidden label “Search” so voice users know its purpose.',
					'pojo-accessibility',
				),
			],
		},
	},
	combobox_design_valid: {
		violationName: __('Outdated Dropdown Design', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Update dropdowns to meet the latest accessibility standards.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If dropdowns don’t follow the latest accessibility guidelines, people relying on screen readers or keyboards may have trouble using them, leading to a poor experience.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Use a single autocomplete widget that opens suggestions right under the typing box avoid stitching separate pieces together.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A dropdown is built using an outdated setup, making it harder for assistive technology users to navigate and select options.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Replace a free-text box plus a detached list with one autocomplete field where the list pops up below as you type.',
					'pojo-accessibility',
				),

				__(
					'Make sure the field, any “▼” button, and the suggestions list belong to the same component so arrow keys move naturally through the choices.',
					'pojo-accessibility',
				),
			],
		},
	},
	element_id_unique: {
		violationName: __('Duplicate Element IDs', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Each element must have a unique ID.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If IDs are not unique, assistive technologies and browsers can get confused, making it harder for people to navigate the page correctly.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give each helper, section, or control its own one‑of‑a‑kind ID never reuse the same ID twice.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Two different sections on a page are given the same ID, which can confuse screen readers and other tools.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Two newsletter forms both use “signup.” Rename one to “signup‑footer” and update any references.',
					'pojo-accessibility',
				),

				__(
					'A tooltip and a heading share “info.” Change the tooltip’s ID to “info‑tip” so labels point to the right place.',
					'pojo-accessibility',
				),
			],
		},
	},
	element_accesskey_unique: {
		violationName: __('Duplicate Shortcut Keys', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Shortcut keys must be unique on each page.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If shortcut keys aren’t unique, keyboard people can trigger the wrong action or get confused when navigating the page.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Assign each shortcut letter only once per page so they don’t clash.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Two different buttons are assigned the same keyboard shortcut, making it unclear which one will be activated.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'“Accept” and “Approve” buttons both use “A.” Change one to “C” (for Confirm) so each key triggers just one action.',
					'pojo-accessibility',
				),

				__(
					'A link and a form field both claim “S.” Remove or change one of them to keep shortcuts unique.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_attribute_valid: {
		violationName: __('Invalid ARIA Attribute', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Labels and settings must match the type of content.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If labels or settings don’t match the content, assistive technology people may hear wrong or unclear information, making the site harder to navigate.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Remove or change any accessibility setting the element isn’t allowed to have.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An element is given settings that don’t fit its type, confusing assistive technologies.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A paragraph has a setting for “expanded/collapsed,” which only applies to collapsible items—delete that setting.',
					'pojo-accessibility',
				),

				__(
					'A list item needs to show it can open and close; change its type to a collapsible list item first, then keep the “expanded” flag.',
					'pojo-accessibility',
				),
			],
		},
	},
	input_checkboxes_grouped: {
		violationName: __(
			'Checkboxes/Radio Buttons Not Grouped',
			'pojo-accessibility',
		),
		whatsTheIssue: __(
			'Related checkboxes or radio buttons must be grouped together.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If related choices aren’t grouped, assistive technology people may not realize the options are connected, leading to confusion and mistakes.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Keep check‑boxes or radio buttons that belong to the same question in one group, and keep unrelated choices in separate groups.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A set of shipping options appears visually together but isn’t grouped for screen reader users, making it harder to understand they belong to the same question.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Place all “Newsletter Topics” check‑boxes (News, Tips, Events) in one cluster under that heading.',
					'pojo-accessibility',
				),

				__(
					'Put “Shipping Method” radio buttons (Standard, Express) in their own cluster—do not mix them with the newsletter choices.',
					'pojo-accessibility',
				),
			],
		},
	},
	fieldset_label_valid: {
		violationName: __('Duplicate Fieldset Label', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Groups of form fields must have unique names.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If groups of inputs have the same name, people relying on assistive technologies may get confused about which section they are in, leading to mistakes when filling out forms.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Add a short group label (such as “Payment Method” or “Choose Your Size”) so everyone knows what the nearby options are for.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Two sections of a form are both labeled "Contact Info," making it hard for screen reader users to tell them apart.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Above three card‑type radio buttons, add the heading “Payment Method.”',
					'pojo-accessibility',
				),

				__(
					'Above four T‑shirt size check‑boxes, add “Choose Your Size.”',
					'pojo-accessibility',
				),
			],
		},
	},
	form_label_unique: {
		violationName: __('Unclear Form Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Form fields must have one clear label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If a form field has more than one label, assistive technology people might hear conflicting instructions, making it harder to fill out the form correctly.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make sure each field has only one label attached remove any duplicates that point to the same input.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A text input has two labels attached to it, confusing screen reader users about what information is needed.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Two “Email Address” labels both point to the same email box. Keep one label and delete the extra.',
					'pojo-accessibility',
				),
			],
		},
	},
	label_ref_valid: {
		violationName: __('Unclear Form Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Labels must be correctly connected to form fields.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If labels aren’t properly connected to form fields, assistive technology people may not know what information to enter, leading to confusion and mistakes.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Check that each label actually targets its own input if the link is broken, update it to match the field’s ID.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A label points to an input field that doesn’t exist or is missing an ID, making it hard for screen reader users to know what the label applies to.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'The “Phone Number” label points to “phone‑1,” but the input is “phone.” Change the label to point to “phone” so clicking the label places the cursor in the box.',
					'pojo-accessibility',
				),
			],
		},
	},
	input_autocomplete_valid: {
		violationName: __('Autocomplete Mismatch', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Autocomplete settings must match the type of form field.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If autocomplete settings don’t match the field type, browsers and assistive technologies may suggest wrong information, making forms harder to fill out correctly.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Tell the browser exactly what each field is for so it can offer the right autofill suggestions.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An address field is marked to autocomplete as a phone number, confusing users and autofill tools.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Your “First name” field currently uses a custom label like “given-name,” so browsers don’t offer saved names. Change the field’s autofill setting to “First name.”',
					'pojo-accessibility',
				),

				__(
					'The credit-card box is set to “cc-num,” which password managers don’t recognize. Switch it to “Credit card number” so users can quickly fill it.',
					'pojo-accessibility',
				),
			],
		},
	},
	error_message_exists: {
		violationName: __('Missing Error Messages', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Error messages must be properly connected and announced.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If error messages aren’t properly connected, people relying on assistive technologies may not realize there’s a problem, making it hard to fix mistakes and complete forms.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make sure every field’s error box exists and becomes visible when there’s a problem.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Relationship between elements need to be properly defined.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A signup field points to an error message that doesn’t exist—you see no feedback. Create the missing error text below the field so users know what went wrong.',
					'pojo-accessibility',
				),

				__(
					'An error message container is hidden even when the form flags a mistake. Change its settings so it appears in plain sight when needed.',
					'pojo-accessibility',
				),
			],
		},
	},
	input_label_after: {
		violationName: __('Misplaced Checkbox Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Checkboxes and radio buttons must have a label placed after them.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If the label isn’t placed after the checkbox or radio button, screen reader people may get confused about which option they are selecting, leading to mistakes.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Keep the label text immediately after the checkbox or radio button so they read as one control.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A checkbox appears, but the label describing it comes before or is missing, making it unclear for users what the checkbox is for.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A newsletter signup has the box followed by “Receive updates.” Perfect—you see the box and label together.',
					'pojo-accessibility',
				),

				__(
					'If your label is sitting above or to the left of the box and feels disconnected, move it to sit directly to the right of the checkbox.',
					'pojo-accessibility',
				),
			],
		},
	},
	input_label_before: {
		violationName: __('Label Placement Incorrect', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Text fields and dropdowns must have a label placed before them.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If the label comes after the text field or dropdown, people relying on assistive technologies might not understand what they need to enter or choose, causing confusion.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Show the label text just before each input box so users know what to enter.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A text box appears before its label, making it harder for screen reader users to know what information is expected.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'“Email address” appears right above the email field. Good—you see the prompt before you type.',
					'pojo-accessibility',
				),

				__(
					'If the label sits after the field or is missing, drag or insert the text so it comes immediately before the input box.',
					'pojo-accessibility',
				),
			],
		},
	},
	input_label_exists: {
		violationName: __('Unclear Form Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Every form field must have a label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If a form field doesn’t have a label, people relying on assistive technologies may not know what information to enter, making forms harder or impossible to complete.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Add or link a clear text label to each input, dropdown, or checkbox so everyone knows its purpose.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A search box appears on the page without any label, making it unclear to screen reader users what the field is for.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'An address field has no label—add “Mailing address” above it.',
					'pojo-accessibility',
				),

				__(
					'A hidden label was used for design reasons—turn on the visible label option or provide a clear name in the control’s settings.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_hidden_nontabbable: {
		violationName: __('Incorrect Tab Order Roles', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Hidden sections should not contain focusable elements.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			"If people can tab to hidden elements, it can cause confusion and frustration, especially for keyboard and screen reader users who can't interact with what they can't see.",
			'pojo-accessibility',
		),
		howToResolve: __(
			'Mark icons, graphics, or decorative bits so they’re skipped by screen readers and not included in keyboard navigation.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A hidden panel still contains a button that users can accidentally tab to, even though they can’t see it.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A decorative star icon before headings shouldn’t be read aloud—set it to “hidden from assistive tech” and remove it from the tab order.',
					'pojo-accessibility',
				),

				__(
					'If a background graphic accidentally gets focus, adjust its settings so it never receives keyboard focus and is ignored by screen readers.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_activedescendant_tabindex_valid: {
		violationName: __('Keyboard Navigation Issues', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Elements highlighting active choices must be reachable with the keyboard.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If people can’t reach elements that highlight active choices, they may lose track of where they are or be unable to make a selection, leading to a frustrating experience.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make sure you can tab into any custom selection or toolbar so keyboard users can start interacting with its items.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An element highlights a selection but can’t be focused using the Tab key, making it hard for keyboard users to interact with it.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'In your page builder, enable the “Focusable” option for the custom toolbar or dropdown container so it’s reached when you press Tab.',
					'pojo-accessibility',
				),

				__(
					'Check that once the container is focused, arrow keys move through its buttons or options.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_child_tabbable: {
		violationName: __('Keyboard Navigation Issues', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Interactive components must have something users can reach with the keyboard.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If an interactive part of the site doesn’t have anything people can tab to, keyboard people and people relying on assistive technologies may not be able to use it at all.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Ensure at least one item inside any custom list or tree can be reached with the Tab key so users can navigate inside.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A popup opens but none of its buttons or options can be reached by tabbing, leaving keyboard users stuck.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'For a collapsible menu, turn on the “Link” or “Focusable” setting for the first menu item so Tab lands there.',
					'pojo-accessibility',
				),

				__(
					'In a nested list, make sure each sub-item is a real link or button, not just plain text, so it can receive focus.',
					'pojo-accessibility',
				),
			],
		},
	},
	element_scrollable_tabbable: {
		violationName: __('Scrollable Element Untabbable', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Scrollable non-interactive element is not tabbable.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			"If people can't reach scrollable areas using the keyboard, they might miss important content — making the website harder to navigate for those who don't use a mouse.",
			'pojo-accessibility',
		),
		howToResolve: __(
			'Let people tab into any scrollable box so they can use arrow keys to scroll through hidden content.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				"A section with scrollable product cards can't be reached or explored by keyboard users.",
				'pojo-accessibility',
			),
			resolution: [
				__(
					'If you’ve put text in a small “scroll box” widget, enable its keyboard scrolling feature so Tab brings focus inside and arrow keys move the content.',
					'pojo-accessibility',
				),

				__(
					'Replace a custom block that can’t be reached by Tab with a built-in “Scrollable Panel” element that supports keyboard navigation.',
					'pojo-accessibility',
				),
			],
		},
	},
	iframe_interactive_tabbable: {
		violationName: __('Keyboard Navigation Issues', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Embedded Interactive content must be reachable with the keyboard.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			"If interactive content like videos or forms can't be reached by keyboard, some people won't be able to play, pause, or interact with them — making the site harder to use and less accessible.",
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make sure any embedded content (videos, maps, forms) can be reached by pressing Tab or hide it completely if it’s purely decorative.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An embedded video player is skipped when users navigate with the Tab key.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'For a YouTube video embed, turn on the “Focusable” setting so users can Tab into the video controls.',
					'pojo-accessibility',
				),

				__(
					'If an iframe only shows decorative graphics, mark it as “Hidden from keyboard” so Tab skips over it.',
					'pojo-accessibility',
				),
			],
		},
	},
	a_text_purpose: {
		violationName: __('Link Purpose Unclear', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Links must clearly describe their purpose.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If links don’t clearly describe their purpose, people relying on assistive technologies may not understand where the link will take them, making navigation confusing.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give every link (text or image) a name that tells people where it goes.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A link says "Click here" without explaining where it goes, leaving screen reader users guessing.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Change a generic “Learn more” link to “Learn more about our Pricing Plans.”',
					'pojo-accessibility',
				),

				__(
					'For a linked image, update its alt text to “View our Spring Collection” instead of “image1.png.”',
					'pojo-accessibility',
				),
			],
		},
	},
	label_name_visible: {
		violationName: __('Visible Label Mismatch', 'pojo-accessibility'),
		whatsTheIssue: __(
			'The accessible name must match what users see.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If the accessible name doesn’t match the visible label, people relying on assistive technologies may hear different information than what they see, causing confusion and mistakes.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make sure the name announced by assistive tools matches exactly what users see on the button or field.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A button visually says "Submit Form," but its accessible name is just "Submit," which can confuse screen reader users.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'If a button reads “Next Page,” set its accessibility name to “Next Page” (not “Go Forward”).',
					'pojo-accessibility',
				),

				__(
					'For a search icon that shows a magnifying glass, give it the hidden label “Search” so screen-reader users hear “Search” when they land on it.',
					'pojo-accessibility',
				),
			],
		},
	},
	html_lang_exists: {
		violationName: __('Missing Page Language', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Set the main language of the page.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If the page’s language isn’t set, screen readers may mispronounce words, making the content harder to understand for people who rely on them.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Tell browsers and assistive tools what language your site uses so they can pronounce text correctly.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A website is written in English, but there’s no language setting, making it harder for screen readers to pronounce words correctly.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'In your site settings or template options, set the language to “English” (or your chosen language) so screen readers switch voices appropriately.',
					'pojo-accessibility',
				),

				__(
					'If your page is in French, change the language setting from blank or “Automatic” to “French.”',
					'pojo-accessibility',
				),
			],
		},
	},
	html_lang_valid: {
		violationName: __('Invalid Language Code', 'pojo-accessibility'),
		whatsTheIssue: __(
			'The page’s language setting must be valid.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If the language code isn’t valid, assistive technologies may not recognize it, leading to incorrect pronunciation and a confusing experience for people.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Set your site’s main language to a standard code so browsers and screen readers know how to pronounce text.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A page tries to set its language, but uses an incorrect code, causing screen readers to mispronounce the text.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'In your site settings, change the language from “english” or blank to the official code “en” (for English).',
					'pojo-accessibility',
				),

				__(
					'If your site is in Spanish, pick “es” instead of writing out “Spanish” or leaving it unset.',
					'pojo-accessibility',
				),
			],
		},
	},
	element_lang_valid: {
		violationName: __('Incorrect Language Tag', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Language changes in the content must use valid language settings.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If language changes aren’t properly marked, assistive technologies may mispronounce words, making the content harder to understand for people.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Tag any text in a different language with its proper code so assistive tools switch pronunciation correctly.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A paragraph switches from English to Spanish but doesn’t correctly mark the language change, confusing screen readers.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'For a French quote, apply the code “fr” to that paragraph so screen readers read it with French pronunciation.',
					'pojo-accessibility',
				),

				__(
					'If you slip in a German phrase, mark it as “de” rather than leaving it as default.',
					'pojo-accessibility',
				),
			],
		},
	},
	input_haspopup_conflict: {
		violationName: __('Unclear Form Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Inputs with suggestions should not have extra popup labels.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If extra popup labels are added where they aren’t needed, people relying on assistive technologies may get the wrong idea about how the input works, leading to confusion.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'If a text field already uses browser suggestions, turn off any extra “popup” option you added so they don’t conflict.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A search box with suggested terms uses an additional popup label, confusing assistive technologies about what will open.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'You added a “show menu” toggle to an email field that already shows domain suggestions—switch that toggle off so the browser list works normally.',
					'pojo-accessibility',
				),

				__(
					'If a phone-number field has both built-in dropdown and a custom “has popup” setting, remove the custom setting and let the browser handle it.',
					'pojo-accessibility',
				),
			],
		},
	},
	element_tabbable_role_valid: {
		violationName: __('Orientation Lock Issue', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Elements users can tab to must be correctly labeled as interactive',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If an element can be reached with the keyboard but isn’t labeled as interactive, people may not know what it does or how to use it.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'If something shouldn’t be clicked or typed into, remove it from Tab order if it should be interactive, make sure it’s focusable.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A focusable item looks interactive but doesn’t have a proper role, confusing screen reader users.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A banner image that isn’t clickable still got tab focus—turn off its focus setting so Tab skips it.',
					'pojo-accessibility',
				),

				__(
					'A custom drop-down that users need to open wasn’t reachable by keyboard—enable its “focusable” option so Tab lands on it first.',
					'pojo-accessibility',
				),
			],
		},
	},
	element_orientation_unlocked: {
		violationName: __('Locked Orientation View', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Content must work in both portrait and landscape views.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If content is locked to one screen orientation, it can be hard or impossible for some people to interact with the site, especially those with limited mobility or using mounted devices.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Avoid locking parts of your page into portrait or landscape use responsive settings so content rotates naturally.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A form forces users to turn their device sideways to fill it out, making it difficult for people who can’t easily rotate their screens.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'You added a rotate effect that only shows correctly in portrait—remove that so the page also works in landscape.',
					'pojo-accessibility',
				),

				__(
					'If a section flips upside down on mobile, switch to a flexible layout option that adapts to both orientations.',
					'pojo-accessibility',
				),
			],
		},
	},
	meta_redirect_optional: {
		violationName: __('Auto Refresh Without Warning', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Pages should not refresh automatically without a warning or option.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If a page refreshes without warning, people — especially those with disabilities — might lose their place, miss important information, or have trouble completing tasks.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Don’t force the page to reload on a timer either remove the automatic refresh or let visitors pause or extend it.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A page refreshes after a few minutes without telling the user, causing someone to lose information they were entering.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Your dashboard refreshes every minute—add a toggle so people can turn off auto-update if they need time to read.',
					'pojo-accessibility',
				),

				__(
					'If a warning page times out, show a “Stay on this page” button and a countdown so users aren’t surprised.',
					'pojo-accessibility',
				),
			],
		},
	},
	blink_elem_deprecated: {
		violationName: __('Persistent Blinking Content', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Avoid using content that blinks repeatedly.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'Persistent blinking can be distracting, overwhelming, or even dangerous for some people, making the website less safe and harder to use.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make any flashing or blinking element stop on its own within a few seconds or let people pause or view a non-blinking version.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An ad banner keeps blinking without stopping, distracting users and potentially triggering seizures for people with certain conditions.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A warning banner that flashes indefinitely is replaced with one that stops blinking after 3 seconds and includes a “Pause animation” button.',
					'pojo-accessibility',
				),

				__(
					'A promotional carousel offers a “View static version” link so users who find movement distracting can switch to a still layout.',
					'pojo-accessibility',
				),
			],
		},
	},
	marquee_elem_avoid: {
		violationName: __('Scrolling Text Used', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Don’t use scrolling text (marquee).',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'Scrolling text can be distracting and is not supported by modern accessibility standards, making the site harder to use for many people.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Remove automatic marquee effects or give people a simple toggle to stop or turn off the motion.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A message scrolls across the screen using outdated code, making it hard for users to read or interact with the page.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Replace an endlessly scrolling news ticker with a static list of headlines and an optional “Start scrolling” button for those who want the effect.',
					'pojo-accessibility',
				),

				__(
					'A marquee of customer logos includes an “Animation off” setting so viewers can read at their own pace.',
					'pojo-accessibility',
				),
			],
		},
	},
	table_headers_ref_valid: {
		violationName: __('Invalid Table Header Link', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Table headers must correctly link to their cells.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If table headers aren’t properly linked, people relying on assistive technologies may not understand the relationship between the data and its meaning, leading to confusion.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make sure every cell in a data table clearly points to the right column and row headings, so screen readers announce them together.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A data cell points to a header that doesn’t exist in the table, making it confusing for screen reader users to understand the information.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'In a price comparison table, each price cell is tagged to both the product name at the top and the feature name on the left.',
					'pojo-accessibility',
				),

				__(
					'A student-grades chart ensures each score cell is tied to “Alice” in the first column and “Math” in the header row.',
					'pojo-accessibility',
				),
			],
		},
	},
	table_scope_valid: {
		violationName: __('Invalid Table Scope Values', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Use the correct values for table header settings.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If table headers aren’t set up correctly, assistive technologies may not be able to explain the table structure properly, making it harder for people to understand the information.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Don’t add extra header labels if your table only has a first row or first column use simple settings to mark those instead.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A table header uses an invalid value for its scope, making it unclear to screen reader users how the table is organized.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A contact list table with names down the side and phone numbers across the top removes unnecessary “Header” markings on every cell—keeps only “Name” (column) and “Phone” (row) labels.',
					'pojo-accessibility',
				),

				__(
					'For a report table, mark the left column as “Category” and the top row as “Quarter” without adding extra header markers elsewhere.',
					'pojo-accessibility',
				),
			],
		},
	},
	table_headers_exists: {
		violationName: __('Missing Table Headers', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Data tables must clearly identify headers.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If tables don’t identify their headers, people relying on assistive technologies may not know how to read and understand the information correctly.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'If you’re using a table only for page layout, switch to a layout block if it’s real data, add clear header rows or columns.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A table lists information but doesn’t mark which cells are headers, making it confusing for screen reader users to understand the data.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A two-column design built with a table is redone using side-by-side layout blocks.',
					'pojo-accessibility',
				),

				__(
					'A sales-data table adds a bold header row “Product | Units Sold | Revenue” so every column is clearly labeled.',
					'pojo-accessibility',
				),
			],
		},
	},
	table_headers_related: {
		violationName: __('Complex Table Headers Missing', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Complex tables must link headers and data clearly.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If headers and data aren’t clearly linked in complex tables, people relying on assistive technologies can get lost or misunderstand the information.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'For tables where one cell relates to several row or column headers, tag each data cell to all the headings it belongs to.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'In a large table, data cells aren’t properly connected to their headers, making it hard for screen reader users to understand what each number means.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'In a schedule grid, meeting times are linked to both “Monday” and “Conference Room A” so assistive tech reads both.',
					'pojo-accessibility',
				),

				__(
					'A financial report table assigns each number cell to “Q1,” “Q2,” etc., and to “Expenses” or “Revenue” as appropriate.',
					'pojo-accessibility',
				),
			],
		},
	},
	table_structure_misuse: {
		violationName: __('Layout Table Misuse', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Tables used only for layout should not have headers or structure.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If a table meant just for layout has headers or structure, assistive technologies may misinterpret it as a data table, leading to a confusing experience.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Don’t use table markup for page layout if it’s decorative or structural, rebuild with layout blocks and remove captions, header tags, and other table-only features.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A layout table is marked with a role that hides it from assistive technologies, but it still includes headers, causing confusion for screen reader users.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A page section arranged in columns switches from a layout table to a responsive grid layout.',
					'pojo-accessibility',
				),

				__(
					'A “testimonial” layout that used <th> and <caption> is rebuilt with cards or panels, with no table elements at all.',
					'pojo-accessibility',
				),
			],
		},
	},
	dir_attribute_valid: {
		violationName: __('Invalid Text Direction', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Text direction settings must use a valid value.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If the text direction isn’t set properly, people may have trouble reading the content, especially in languages that flow right-to-left, like Arabic or Hebrew.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Set the text direction to match the language left-to-right for English, right-to-left for Hebrew/Arabic, or automatic if you’re mixing languages.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A page sets the text direction using an invalid value, making it harder for assistive technologies to display the content correctly.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'In your site or theme settings, choose Left-to-Right (LTR) if your content is in English or most European languages.',
					'pojo-accessibility',
				),

				__(
					'For a section in Arabic, switch its direction to Right-to-Left (RTL) so the text reads naturally.',
					'pojo-accessibility',
				),
				__(
					'If you have both English and another language, use the Auto setting so the browser figures it out.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_application_label_unique: {
		violationName: __('Duplicate Interactive Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Interactive areas must have a clear, unique label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If interactive areas don’t have unique labels, people relying on assistive technologies may not know what each area is for, making navigation confusing and frustrating.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give each interactive “app-style” region (like a widget panel) a unique name so screen readers know what it is.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Two app sections on a page are both labeled "Main Area," making it confusing for screen reader users to tell them apart.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A weather box gets the hidden name “Weather Forecast Panel” so assistive tools announce it.',
					'pojo-accessibility',
				),

				__(
					'A stock-ticker area is labeled “Stock Ticker Feed” (even if the label isn’t visible) to describe its purpose.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_application_labelled: {
		violationName: __('Missing Interactive Label', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Interactive areas must have a clear label describing their purpose.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If interactive areas don’t have a clear label, people relying on assistive technologies may struggle to understand and use the content correctly.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Link each application-style panel to visible heading text or add a hidden label so it’s announced correctly.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An app-like section is created but doesn’t have a label, leaving screen reader users unsure what the section is for.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Above a “News” widget, add the heading “Top Stories” and connect the panel to that heading so screen readers say “Top Stories, panel.”',
					'pojo-accessibility',
				),

				__(
					'If there’s no visible heading, give the panel a hidden label like “Search Widget” for clarity.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_article_label_unique: {
		violationName: __('Duplicate Article Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Articles must have a clear, unique label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If articles don’t have unique labels, people relying on assistive technologies may get confused about the content or skip important information.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make sure every article or blog post section has its own clear title so users know what it contains.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Two articles on a news site are both labeled "Story," making it hard for screen reader users to tell them apart.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A feature story gets the title "How to Improve Site Accessibility" in its hidden or visible label.',
					'pojo-accessibility',
				),

				__(
					'A guest post section is labeled "Guest Insights: UX Trends" so assistive tech announces the correct article heading.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_banner_label_unique: {
		violationName: __('Duplicate Banner Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Banners must have a clear, unique label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If banners don’t have unique labels, people relying on assistive technologies may get confused about the purpose of each section, leading to a frustrating experience.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give your main page header (the banner) a unique name describing your site or section.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Two banners on a page are both labeled "Site Banner," making it difficult for screen reader users to know which banner provides which information.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Label the top header region “Pelican Claims Site Header” so screen readers recognize it as the main banner.',
					'pojo-accessibility',
				),

				__(
					'If you have two headers, remove the extra label from the secondary one and keep only the primary banner named “Main Page Header.”',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_banner_single: {
		violationName: __('Multiple Banners Used', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Each page should have only one banner.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If there’s more than one banner, people relying on assistive technologies may get confused about the structure of the page, making navigation harder.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Only one element on the page should act as the main banner. Remove banner labels from any extra headers.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A website includes two banners at the top, confusing screen reader users about where the main site information starts.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'If both your logo area and top navigation were marked as banners, turn off the banner setting on the navigation so only the logo area remains the one true banner.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_complementary_label_unique: {
		violationName: __('Duplicate Sidebar Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Side content areas must have a clear, unique label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If side sections don’t have unique labels, people relying on assistive technologies may not understand the difference between them, leading to confusion when navigating the page.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give each sidebar or related-content region its own unique label so users understand its purpose.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Two sidebars are both labeled "Related Information," making it hard for screen reader users to tell them apart.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A news sidebar is labeled “Related Articles” so it’s announced as such.',
					'pojo-accessibility',
				),
				__(
					'A contact info box is named “Office Hours & Contacts.”',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_complementary_labelled: {
		violationName: __('Sidebar Missing Label', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Side content areas must have a clear label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If side content isn’t labeled, people relying on assistive technologies may miss important information or not understand the purpose of different sections.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Link each complementary section (sidebar, help panel) to its visible heading or add a hidden label so it’s announced properly.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A sidebar with extra information isn’t labeled, so screen reader users don’t know what the section is about.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Above a “Recent Posts” sidebar, add the heading “Recent Posts” and connect the section to it so screen readers say “Recent Posts, section.”',
					'pojo-accessibility',
				),

				__(
					'If no heading fits, give the section a hidden label like “Help & Support Panel.”',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_content_in_landmark: {
		violationName: __('Content Outside Landmarks', 'pojo-accessibility'),
		whatsTheIssue: __(
			'All content must be placed inside clear sections (landmarks).',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If content isn’t placed inside clear landmarks, people relying on assistive technologies may struggle to navigate and understand the structure of the page.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Enclose each major section of your page in the right landmark region so assistive tools know what each part is for.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A page has important content floating outside of main sections like “Main,” “Navigation,” or “Footer,” making it harder for screen reader users to find.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Main content: Put your primary article or page text inside a “Main Content” block or section so it’s announced as the main section.',
					'pojo-accessibility',
				),
				__(
					'Footer: Use your theme’s Footer area (or add a “Footer” block) so it’s recognized as the page’s footer.',
					'pojo-accessibility',
				),
				__(
					'Sidebar or related links: Place widgets like “Related Articles” or “Contact Info” inside a Sidebar or a “Complementary” region.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_contentinfo_label_unique: {
		violationName: __('Duplicate Footer Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Footer sections must have a clear, unique label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If footer sections don’t have unique labels, people relying on assistive technologies may get confused about the different types of information available at the bottom of the page.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give your footer area a unique name (like “Site Footer”) so screen readers announce it as the page’s footer.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Two footers on a page are both labeled "Footer," making it hard for screen reader users to know which one contains which information.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'In your footer settings, add the hidden label “Site Footer” so assistive tools recognize it.',
					'pojo-accessibility',
				),
				__(
					'If you have a legal notice and a separate copyright block, label only the main footer section and leave the rest unlabeled.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_contentinfo_single: {
		violationName: __('Multiple Footers Present', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Each page should have only one footer section.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If there’s more than one footer, people relying on assistive technologies may get confused about the page structure, making navigation harder and less predictable.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Keep only one section marked as the page’s footer and remove any extra footer roles from secondary sections.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A page has two footers, making it confusing for screen reader users to understand where the main site information ends.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'If both your top bar and bottom bar were set as footers, turn off the footer label on the top bar so only the true footer remains.',
					'pojo-accessibility',
				),
				__(
					'A copyright widget had a footer setting—remove that so only the main footer block is treated as contentinfo.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_document_label_unique: {
		violationName: __('Duplicate Document Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Documents must have a clear, unique label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If documents don’t have unique labels, people relying on assistive technologies may not understand the difference between them, leading to confusion and frustration.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'For any special document-like widget or panel, give it its own visible or hidden title so users understand its purpose.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Two embedded documents on a page are both labeled "Document," making it difficult for screen reader users to tell them apart.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'A news feed panel is labeled “Breaking News Feed” so screen readers announce it.',
					'pojo-accessibility',
				),
				__(
					'A downloadable report section gets a hidden label “Monthly Sales Report” if no visible heading fits.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_form_label_unique: {
		violationName: __('Unclear Form Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Forms must have a clear, unique label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If forms don’t have unique labels, people relying on assistive technologies may get confused about what each form is for, leading to mistakes and frustration.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give each form on the page a short, unique name (for example, “Contact Form” or “Newsletter Signup”) so assistive tools can tell them apart.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A page has two different forms, but both are labeled "Form," making it hard for screen reader users to know which form they are filling out.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Label your contact form “Contact Us Form” in the form settings.',
					'pojo-accessibility',
				),
				__(
					'A separate survey form is labeled “Customer Feedback Survey.”',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_landmark_name_unique: {
		violationName: __('Duplicate Landmark Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Landmark sections must have a unique label or be clearly separated.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If landmarks aren’t uniquely labeled or clearly separated, people relying on assistive technologies can get confused about the page layout, making navigation harder.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'If you have more than one section of the same kind (like two sidebars), give each a different label so users know which is which.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Two navigation sections are both labeled "Main Menu," making it hard for screen reader users to tell them apart.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Rename one sidebar “Related Articles” and the other “Recommended Products.”',
					'pojo-accessibility',
				),
				__(
					'For two menus, label one “Main Navigation” and the other “Footer Menu.”',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_main_label_unique: {
		violationName: __('Duplicate Main Content Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Main sections must have a clear, unique label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If main sections don’t have unique labels, people relying on assistive technologies may get lost or misunderstand the structure of the page.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Identify one area as your page’s main content; if you need additional main-like sections, give each a unique label instead of multiple “Main” roles.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A page has two main sections, both labeled "Main Content," making it confusing for screen reader users to know which section they are in.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Ensure only your primary content block is set as “Main.”',
					'pojo-accessibility',
				),
				__(
					'If you show search results in a separate main-style panel, label it “Search Results Panel” rather than marking it as another main region.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_navigation_label_unique: {
		violationName: __('Duplicate Navigation Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Navigation menus must have a clear, unique label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If navigation menus don’t have unique labels, people relying on assistive technologies may get confused and struggle to move around the site.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give every navigation menu (header, sidebar, footer) its own label so users know which menu they’re in.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A page has two navigation sections, both labeled "Navigation," making it hard for screen reader users to know which menu they are using.',
				'pojo-accessibility',
			),
			resolution: [
				__('Label your top menu “Primary Navigation.”', 'pojo-accessibility'),
				__('Label a footer menu “Footer Links.”', 'pojo-accessibility'),
			],
		},
	},
	aria_region_label_unique: {
		violationName: __('Duplicate Region Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Content sections (regions) must have a clear, unique label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If content sections don’t have unique labels, people relying on assistive technologies may get confused about the layout and miss important information.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give each section or “region” (like a news box or sidebar) its own name so users know what it contains.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'Two regions on a page are both labeled "Section," making it difficult for screen reader users to understand the difference between them.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Label your weather updates panel “Weather Forecast” and your stock ticker panel “Market Updates.”',
					'pojo-accessibility',
				),
				__(
					'If you have two help boxes, name one “FAQ Help” and the other “Live Support Info.”',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_region_labelled: {
		violationName: __('Unlabeled Content Region', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Content sections must have a clear label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If content sections aren’t labeled, people relying on assistive technologies may not understand the purpose of different parts of the page, making navigation harder.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Tie each section to its visible heading or add a hidden name so screen readers announce it correctly.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A section with additional information is not labeled, making it unclear for screen reader users what the section is about.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Add a heading “Real-Time Log” above a log panel and connect the panel to that heading.',
					'pojo-accessibility',
				),
				__(
					'If there’s no visible heading, give the panel a hidden label like “Real-Time Log Panel.”',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_search_label_unique: {
		violationName: __('Duplicate Search Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Search areas must have a clear, unique label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If search areas don’t have unique labels, people relying on assistive technologies may get confused and struggle to find the right search tool.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give each search input its own label so people know what they’re searching.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A page has two search bars, but both are labeled "Search," making it hard for screen reader users to know which search feature they are using.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Label one search box “Search Products” and another “Search Blog Posts.”',
					'pojo-accessibility',
				),
				__(
					'If your theme forces a generic “Search,” add hidden text “Search Site” to distinguish it.',
					'pojo-accessibility',
				),
			],
		},
	},
	aria_toolbar_label_unique: {
		violationName: __('Duplicate Toolbar Labels', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Toolbars must have a clear, unique label.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If toolbars don’t have unique labels, people relying on assistive technologies may get confused about which toolbar to use, leading to mistakes and frustration.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give every toolbar or set of tools a clear name so users know what controls they’re grouped in.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A page has multiple toolbars, but they are all labeled "Toolbar," making it difficult for screen reader users to know what each one controls.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Call your formatting toolbar “Text Formatting Tools.”',
					'pojo-accessibility',
				),
				__(
					'Name a layout toolbar “Page Layout Controls.”',
					'pojo-accessibility',
				),
			],
		},
	},
	skip_main_exists: {
		violationName: __('Missing Skip Link', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Pages must let users skip straight to the main content.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			"If people can't easily skip to the main content, especially keyboard and screen reader users, navigating the site becomes slow, frustrating, and tiring.",
			'pojo-accessibility',
		),
		howToResolve: __(
			'Add a “Skip to main content” link as the first focusable item so keyboard users can jump straight to your page’s main area.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A user has to tab through the entire navigation menu every time they visit a new page because there’s no shortcut to jump to the main content.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Include a hidden link at the top labeled “Skip to main content” that appears when focused.',
					'pojo-accessibility',
				),
				__(
					'Ensure that pressing Tab brings that link into view before the navigation menu.',
					'pojo-accessibility',
				),
			],
		},
	},
	page_title_exists: {
		violationName: __('Missing Page Title', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Each page must have a clear, descriptive title.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If the page title doesn’t describe the content clearly, people may have trouble understanding where they are, especially when using tabs, bookmarks, or screen readers.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make sure every page actually has a title ⎯ and that the title tells visitors what’s on the page.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A page title just says "Home" even though it’s a product page, making it unclear to users and screen readers what the page is about.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'If the title box in your page or SEO settings is blank, type a short description such as “About Our Clinic.”',
					'pojo-accessibility',
				),
				__(
					'If the title shows “Untitled Page,” replace it with something specific like “Contact Us – Email & Location.”',
					'pojo-accessibility',
				),
				__(
					'If the design template “hides” the title area completely, switch to (or edit) a template that includes a title field, then add a descriptive phrase like “Organic Dog Treats – Home.”',
					'pojo-accessibility',
				),
			],
		},
	},
	frame_title_exists: {
		violationName: __('Missing Iframe Title', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Embedded content (iframes) must have a clear, unique title.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If embedded content doesn’t have a descriptive title, people relying on assistive technologies may not know what the content is or whether they want to interact with it.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Give each embedded frame (like videos or file previews) a short title so everyone knows what’s inside.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'An embedded video has no title, making it unclear to screen reader users what the embedded content is about.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'For a project file embed, set its title to “Project Files Preview.”',
					'pojo-accessibility',
				),
				__(
					'For a tutorial video, use “How-To Tutorial Video.”',
					'pojo-accessibility',
				),
			],
		},
	},
	list_children_valid: {
		violationName: __('Invalid List Items', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Lists must only contain list items.',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If lists are not built with the right items, assistive technologies can misread the structure, making it harder for people to understand the content.',
			'pojo-accessibility',
		),
		howToResolve: __(
			'Make sure every item in a list or grouped set is a true list item so screen readers announce them in order.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A list groups together elements that aren’t proper list items, confusing screen readers.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'In a bullet list of features, ensure each feature is a list item—don’t mix in headings or plain text blocks.',
					'pojo-accessibility',
				),
				__(
					'For grouped icons or buttons, use a list container so each icon is treated as one item.',
					'pojo-accessibility',
				),
			],
		},
	},
	table_aria_descendants: {
		violationName: __('Misused Table Roles', 'pojo-accessibility'),
		whatsTheIssue: __(
			'Don’t override the natural roles of table elements',
			'pojo-accessibility',
		),
		whyItMatters: __(
			'If table elements have their natural roles changed, assistive technologies may misread the table, making it harder for people to understand the data',
			'pojo-accessibility',
		),
		howToResolve: __(
			'When you add a table or grid, don’t layer extra labels or roles onto each row or cell. Use the table block’s built-in settings.',
			'pojo-accessibility',
		),
		seeAnExample: {
			issue: __(
				'A table header cell (<th>) is manually given a different role, making it confusing for screen readers to understand the table structure.',
				'pojo-accessibility',
			),
			resolution: [
				__(
					'Use your table widget’s header toggle for the first row instead of manually tagging each header cell.',
					'pojo-accessibility',
				),
				__(
					'If you’ve marked up each cell again, remove those extra settings so the table remains clean and predictable.',
					'pojo-accessibility',
				),
			],
		},
	},
};
