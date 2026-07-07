import { __ } from '@wordpress/i18n';
import '../css/style.css';

const REASON_FIELDS = {
	unclear_how_to_use: ['ea11y_text_field_unclear', 'ea11y_unclear_details'],
	switched_solution: ['ea11y_text_field_switched', 'ea11y_switched_details'],
	other: ['ea11y_text_field_other', 'ea11y_other_details'],
};

class Ea11yDeactivationHandler {
	constructor() {
		this.deactivationLink = document.getElementById(
			'deactivate-pojo-accessibility',
		);

		if (!this.deactivationLink) {
			return;
		}

		this.originalDeactivationLink = this.deactivationLink.getAttribute('href');

		this.init();
	}

	modal(title, url, cssClass) {
		window.tb_show?.(title, url);
		setTimeout(
			() => document.getElementById('TB_window')?.classList.add(cssClass),
			5,
		);
	}

	resetModal() {
		this.hideFields();
		document
			.querySelectorAll('input[name="ea11y_deactivation_reason"]')
			.forEach((radio) => {
				radio.checked = false;
			});
	}

	hideFields() {
		document
			.querySelectorAll('.ea11y-feedback-text-field')
			.forEach((f) => (f.style.display = 'none'));
	}

	toggleField(reason) {
		this.hideFields();

		const fieldId = REASON_FIELDS[reason]?.[0];

		if (fieldId) {
			document.getElementById(fieldId).style.display = 'block';
		}
	}

	handleOptionClick(e) {
		const option = e.target.closest('.ea11y-feedback-option');

		if (!option || e.target.closest('.ea11y-feedback-text-field')) {
			return;
		}

		const radio = option.querySelector(
			'input[type="radio"][name="ea11y_deactivation_reason"]',
		);

		if (!radio) {
			return;
		}

		radio.checked = true;

		this.toggleField(radio.value);
	}

	sendRequest(data, done) {
		fetch(window?.ea11yDeactivationFeedback?.ajaxurl || '', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams(data),
		}).finally(done);
	}

	handleSubmit() {
		const reason = document.querySelector(
			'input[name="ea11y_deactivation_reason"]:checked',
		)?.value;
		const detailsId = REASON_FIELDS[reason]?.[1];
		const extra = detailsId
			? document.getElementById(detailsId)?.value || ''
			: '';

		if (reason) {
			this.sendRequest(
				{
					action: 'ea11y_deactivation_feedback',
					reason,
					additional_data: extra,
					nonce: window?.ea11yDeactivationFeedback?.nonce || '',
				},
				() => this.deactivate(),
			);
		} else {
			this.deactivate();
		}
	}

	deactivate() {
		window.tb_remove?.();
		window.location.href = this.originalDeactivationLink;
	}

	init() {
		this.deactivationLink.addEventListener('click', (e) => {
			e.preventDefault();
			this.resetModal();
			this.modal(
				__('Quick feedback', 'pojo-accessibility'),
				'#TB_inline?width=600&height=auto&inlineId=ea11y-deactivation-modal',
				'ea11y-feedback-thickbox',
			);
		});

		document.addEventListener('change', (e) => {
			if (e.target?.name === 'ea11y_deactivation_reason') {
				this.toggleField(e.target.value);
			}
		});

		document.addEventListener('click', (e) => {
			if (e.target?.id === 'ea11y-submit-deactivate') {
				e.preventDefault();
				this.handleSubmit();

				return;
			}
			if (e.target?.id === 'ea11y-skip-deactivate') {
				e.preventDefault();
				this.deactivate();

				return;
			}

			this.handleOptionClick(e);
		});
	}
}

document.addEventListener(
	'DOMContentLoaded',
	() => new Ea11yDeactivationHandler(),
);
