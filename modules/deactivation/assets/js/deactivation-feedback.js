import '../css/style.css';

document.addEventListener('DOMContentLoaded', function () {
	function showEa11yModal(title, url, customClass) {
		if (window.tb_show) {
			window.tb_show(title, url);
		}
		setTimeout(function () {
			if (customClass) {
				const tbWindow = document.getElementById('TB_window');
				if (tbWindow) {
					tbWindow.classList.add(customClass);
				}
			}
		}, 5);
	}

	function hideAllTextFields() {
		const textFields = document.querySelectorAll('.ea11y-feedback-text-field');
		textFields.forEach(function (field) {
			field.style.display = 'none';
		});
	}

	function showTextField(fieldId) {
		const field = document.getElementById(fieldId);
		if (field) {
			field.style.display = 'block';
		}
	}

	function sendAjaxRequest(data, callback) {
		const formData = new URLSearchParams(data);

		fetch(window?.ea11yDeactivationFeedback?.ajaxurl || '', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: formData,
		})
			.then(() => {
				if (callback) {
					callback();
				}
			})
			.catch((error) => {
				console.warn('Feedback submission failed:', error);
				if (callback) {
					callback();
				}
			});
	}

	const deactivateLink = document.getElementById(
		'deactivate-pojo-accessibility',
	);

	if (deactivateLink) {
		const originalHref = deactivateLink.getAttribute('href');

		deactivateLink.addEventListener('click', function (e) {
			e.preventDefault();

			showEa11yModal(
				'QUICK FEEDBACK',
				'#TB_inline?width=550&height=auto&inlineId=ea11y-deactivation-modal',
				'ea11y-feedback-thickbox',
			);

			return false;
		});

		document.addEventListener('change', function (e) {
			if (e.target && e.target.name === 'ea11y_deactivation_reason') {
				hideAllTextFields();

				const selectedValue = e.target.value;
				if (selectedValue === 'unclear_how_to_use') {
					showTextField('text_field_unclear');
				} else if (selectedValue === 'switched_solution') {
					showTextField('text_field_switched');
				} else if (selectedValue === 'other') {
					showTextField('text_field_other');
				}
			}
		});

		document.addEventListener('click', function (e) {
			if (e.target && e.target.id === 'ea11y-submit-deactivate') {
				e.preventDefault();

				const selectedReasonElement = document.querySelector(
					'input[name="ea11y_deactivation_reason"]:checked',
				);
				const selectedReason = selectedReasonElement
					? selectedReasonElement.value
					: '';

				let additionalData = '';
				if (selectedReason === 'unclear_how_to_use') {
					const unclearDetails = document.getElementById('unclear_details');
					additionalData = unclearDetails ? unclearDetails.value : '';
				} else if (selectedReason === 'switched_solution') {
					const switchedDetails = document.getElementById('switched_details');
					additionalData = switchedDetails ? switchedDetails.value : '';
				} else if (selectedReason === 'other') {
					const otherDetails = document.getElementById('other_details');
					additionalData = otherDetails ? otherDetails.value : '';
				}

				if (selectedReason) {
					const requestData = {
						action: 'ea11y_deactivation_feedback',
						reason: selectedReason,
						additional_data: additionalData,
						nonce: window?.ea11yDeactivationFeedback?.nonce || '',
					};

					sendAjaxRequest(requestData, function () {
						if (window.tb_remove) {
							window.tb_remove();
						}
						window.location.href = originalHref;
					});
				} else {
					if (window.tb_remove) {
						window.tb_remove();
					}
					window.location.href = originalHref;
				}
			}
		});

		document.addEventListener('click', function (e) {
			if (e.target && e.target.id === 'ea11y-skip-deactivate') {
				e.preventDefault();
				if (window.tb_remove) {
					window.tb_remove();
				}
				window.location.href = originalHref;
			}
		});
	}
});
