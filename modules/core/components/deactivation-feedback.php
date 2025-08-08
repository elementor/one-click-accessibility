<?php

namespace EA11y\Modules\Core\Components;

use EA11y\Classes\Utils;
use EA11y\Classes\Logger;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Deactivation_Feedback {

	/**
	 * Check if we should show the deactivation feedback modal
	 *
	 * @return bool
	 */
	private function should_show_feedback(): bool {
		global $pagenow;

		return 'plugins.php' === $pagenow && Utils::user_is_admin();
	}

	/**
	 * Enqueue deactivation feedback assets
	 */
	public function enqueue_deactivation_assets(): void {
		if ( ! $this->should_show_feedback() ) {
			return;
		}

		// Enqueue thickbox for modal
		wp_enqueue_script( 'thickbox' );
		wp_enqueue_style( 'thickbox' );

		// Add our custom styles and scripts
		wp_add_inline_style( 'thickbox', $this->get_deactivation_css() );
		wp_add_inline_script( 'thickbox', $this->get_deactivation_js() );
	}

	/**
	 * Get CSS for deactivation feedback modal
	 *
	 * @return string
	 */
	private function get_deactivation_css(): string {
		ob_start(); ?>
		.ea11y-deactivation-modal {
			display: none;
		}

		.ea11y-deactivation-content {
			padding: 20px;
		}

		/* Thickbox auto-height adjustments */
		#TB_window {
			height: auto !important;
			max-height: 90vh;
			overflow: auto;
			top: 50% !important;
			left: 50% !important;
			transform: translate(-50%, -50%) !important;
			margin: 0 !important;
			width: 600px !important;
		}

		#TB_ajaxContent {
			height: auto !important;
			overflow: visible;
			padding: 0;
			width: 100% !important;
		}

		#TB_title {
			padding: 5px;
		}

		#TB_closeWindowButton .tb-close-icon {
			box-shadow: none !important;
		}

		#TB_ajaxWindowTitle {
			font-size: 14px;
			letter-spacing: 1px;
		}

		#TB_iframeContent {
			height: auto !important;
		}

		.ea11y-deactivation-content h3 {
			margin-top: 0;
			color: #23282d;
			font-size: 18px;
			font-weight: 600;
		}

		.ea11y-deactivation-content p {
			color: #666;
			margin-bottom: 20px;
		}

		.ea11y-feedback-options {
			margin-bottom: 20px;
		}

		.ea11y-feedback-option {
			margin-bottom: 15px;
		}

		.ea11y-feedback-option > label {
			display: flex;
			align-items: center;
			cursor: pointer;
			color: #23282d;
			margin-bottom: 8px;
		}

		.ea11y-feedback-option input[type="radio"] {
			margin-right: 8px;
		}

		.ea11y-feedback-text-field {
			margin-left: 24px;
			margin-top: 8px;
		}

		.ea11y-feedback-text-field label {
			display: block;
			font-size: 12px;
			color: #666;
			margin-bottom: 4px;
		}

		.ea11y-feedback-text-field input,
		.ea11y-feedback-text-field textarea {
			width: 100%;
			padding: 6px 8px;
			border: 1px solid #ddd;
			border-radius: 3px;
			font-size: 13px;
			resize: vertical;
		}

		.ea11y-feedback-text-field input:focus,
		.ea11y-feedback-text-field textarea:focus {
			border-color: #0073aa;
			box-shadow: 0 0 0 1px #0073aa;
			outline: none;
		}

		.ea11y-deactivation-buttons {
			display: flex;
			flex-direction: row-reverse;
			justify-content: space-between;
			gap: 10px;
			border-top: 1px solid #e1e1e1;
			padding-top: 20px;
		}

		.ea11y-btn {
			padding: 8px 16px;
			border: none;
			background: none;
			text-decoration: none;
			border-radius: 3px;
			cursor: pointer;
			font-size: 13px;
			font-weight: 600;
			color: #c0c0c0;
			transition: all 0.3s ease;
		}

		.ea11y-btn:hover {
			background: none;
			color: #000;
		}

		.ea11y-btn-primary {
			background: rgb(240, 171, 252);
			border-color: rgb(240, 171, 252);
			color: #000;
			font-weight: 600;
			transition: all 0.3s ease;
		}

		.ea11y-btn-primary:hover {
			background: #e881fa;
			border-color: #e881fa;
			color: #000;
		}

		.ea11y-btn:focus {
			box-shadow: 0 0 0 1px #5b9dd9, 0 0 2px 1px rgba(30, 140, 190, 0.8);
			outline: none;
		}
		<?php
		return ob_get_clean();
	}

	/**
	 * Get JavaScript for deactivation feedback modal
	 *
	 * @return string
	 */
	private function get_deactivation_js(): string {
		$plugin_basename = plugin_basename( EA11Y_MAIN_FILE );
		$nonce = wp_create_nonce( 'ea11y_deactivation_feedback' );

		ob_start(); ?>
		jQuery(document).ready(function($) {
			// Find the deactivate link for ea11y plugin using multiple selectors
			let deactivateLink = $('tr[data-plugin="<?php echo esc_js( $plugin_basename ); ?>"] .deactivate a');

			// Fallback: try by ID pattern
			if (!deactivateLink.length) {
				deactivateLink = $('a[id*="deactivate-pojo-accessibility"]');
			}

			// Fallback: try by href pattern
			if (!deactivateLink.length) {
				deactivateLink = $('a[href*="plugin=pojo-accessibility"][href*="action=deactivate"]');
			}

			if (deactivateLink.length) {
				const originalHref = deactivateLink.attr('href');

				// Override the deactivate link click
				deactivateLink.on('click', function(e) {
					e.preventDefault();

					// Show the feedback modal with auto height
					tb_show('QUICK FEEDBACK', '#TB_inline?width=550&inlineId=ea11y-deactivation-modal');

					return false;
				});

				// Handle radio button changes to show/hide text fields
				$(document).on('change', 'input[name="ea11y_deactivation_reason"]', function() {
					// Hide all text fields first
					$('.ea11y-feedback-text-field').hide();

					// Show the relevant text field based on selection
					let selectedValue = $(this).val();
					if (selectedValue === 'unclear_how_to_use') {
						$('#text_field_unclear.ea11y-feedback-text-field').show();
					} else if (selectedValue === 'switched_solution') {
						$('#text_field_switched.ea11y-feedback-text-field').show();
					} else if (selectedValue === 'other') {
						$('#text_field_other.ea11y-feedback-text-field').show();
					}
				});

				// Handle submit and deactivate
				$(document).on('click', '#ea11y-submit-deactivate', function(e) {
					e.preventDefault();

					const selectedReason = $('input[name="ea11y_deactivation_reason"]:checked').val() || '';

					// Collect additional text field data
					let additionalData = {};
					if (selectedReason === 'unclear_how_to_use') {
						additionalData.unclear_details = $('#unclear_details').val();
					} else if (selectedReason === 'switched_solution') {
						additionalData.switched_details = $('#switched_details').val();
					} else if (selectedReason === 'other') {
						additionalData.other_details = $('#other_details').val();
					}

					// Send feedback via AJAX (optional)
					if (selectedReason) {
						$.ajax({
							url: ajaxurl,
							type: 'POST',
							data: {
								action: 'ea11y_deactivation_feedback',
								reason: selectedReason,
								additional_data: additionalData,
								nonce: '<?php echo esc_js( $nonce ); ?>'
							},
							complete: function() {
								// Close modal and proceed with deactivation
								tb_remove();
								window.location.href = originalHref;
							}
						});
					} else {
						// Close modal and proceed with deactivation
						tb_remove();
						window.location.href = originalHref;
					}
				});

				// Handle skip and deactivate
				$(document).on('click', '#ea11y-skip-deactivate', function(e) {
					e.preventDefault();
					tb_remove();
					window.location.href = originalHref;
				});
			}
		});
		<?php
		return ob_get_clean();
	}

	/**
	 * Add deactivation feedback modal HTML to footer
	 */
	public function add_deactivation_modal(): void {
		if ( ! $this->should_show_feedback() ) {
			return;
		}
		?>
		<div id="ea11y-deactivation-modal" class="ea11y-deactivation-modal">
			<div class="ea11y-deactivation-content">
				<h4>
					<?php esc_html_e( 'If you have a moment, please share why you are deactivating Ally:', 'pojo-accessibility' ); ?>
				</h4>

				<div class="ea11y-feedback-options">
					<div class="ea11y-feedback-option">
						<label for="reason_no_longer_needed">
							<input type="radio" name="ea11y_deactivation_reason" value="no_longer_needed" id="reason_no_longer_needed">
							<?php esc_html_e( 'I no longer need this plugin', 'pojo-accessibility' ); ?>
						</label>
					</div>

					<div class="ea11y-feedback-option">
						<label for="reason_too_expensive">
							<input type="radio" name="ea11y_deactivation_reason" value="too_expensive" id="reason_too_expensive">
							<?php esc_html_e( 'It\'s too expensive', 'pojo-accessibility' ); ?>
						</label>
					</div>

					<div class="ea11y-feedback-option">
						<label for="reason_no_results">
							<input type="radio" name="ea11y_deactivation_reason" value="no_results" id="reason_no_results">
							<?php esc_html_e( 'The plugin didn\'t provide the results I was hoping for', 'pojo-accessibility' ); ?>
						</label>
					</div>

					<div class="ea11y-feedback-option">
						<label for="reason_unclear">
							<input type="radio" name="ea11y_deactivation_reason" value="unclear_how_to_use" id="reason_unclear">
							<?php esc_html_e( 'I wasn\'t sure how to use the plugin', 'pojo-accessibility' ); ?>
						</label>
						<div class="ea11y-feedback-text-field" id="text_field_unclear" style="display: none;">
							<label for="unclear_details"><?php esc_html_e( 'Optional: Was anything unclear or confusing?', 'pojo-accessibility' ); ?></label>
							<textarea id="unclear_details" name="unclear_details" rows="3" placeholder="<?php esc_attr_e( 'Please share details...', 'pojo-accessibility' ); ?>"></textarea>
						</div>
					</div>

					<div class="ea11y-feedback-option">
						<label for="reason_technical">
							<input type="radio" name="ea11y_deactivation_reason" value="technical_issues" id="reason_technical">
							<?php esc_html_e( 'I had technical issues or conflicts with my site', 'pojo-accessibility' ); ?>
						</label>
					</div>

					<div class="ea11y-feedback-option">
						<label for="reason_switched">
							<input type="radio" name="ea11y_deactivation_reason" value="switched_solution" id="reason_switched">
							<?php esc_html_e( 'I switched to a different solution', 'pojo-accessibility' ); ?>
						</label>
						<div class="ea11y-feedback-text-field" id="text_field_switched" style="display: none;">
							<label for="switched_details"><?php esc_html_e( 'Optional: Please share which solution:', 'pojo-accessibility' ); ?></label>
							<input type="text" id="switched_details" name="switched_details" placeholder="<?php esc_attr_e( 'Solution name...', 'pojo-accessibility' ); ?>">
						</div>
					</div>

					<div class="ea11y-feedback-option">
						<label for="reason_other">
							<input type="radio" name="ea11y_deactivation_reason" value="other" id="reason_other">
							<?php esc_html_e( 'Other', 'pojo-accessibility' ); ?>
						</label>
						<div class="ea11y-feedback-text-field" id="text_field_other" style="display: none;">
							<label for="other_details"><?php esc_html_e( 'Optional: Please share the reason:', 'pojo-accessibility' ); ?></label>
							<textarea id="other_details" name="other_details" rows="3" placeholder="<?php esc_attr_e( 'Please explain...', 'pojo-accessibility' ); ?>"></textarea>
						</div>
					</div>
				</div>

				<div class="ea11y-deactivation-buttons">
					<button type="button" id="ea11y-skip-deactivate" class="ea11y-btn">
						<?php esc_html_e( 'Skip & Deactivate', 'pojo-accessibility' ); ?>
					</button>
					<button type="button" id="ea11y-submit-deactivate" class="ea11y-btn ea11y-btn-primary">
						<?php esc_html_e( 'Submit & Deactivate', 'pojo-accessibility' ); ?>
					</button>
				</div>
			</div>
		</div>
		<?php
	}

	/**
	 * Handle AJAX feedback submission
	 */
	public function handle_deactivation_feedback(): void {
		// Verify nonce
		$nonce = sanitize_text_field( wp_unslash( $_POST['nonce'] ?? '' ) );
		if ( ! wp_verify_nonce( $nonce, 'ea11y_deactivation_feedback' ) ) {
			wp_send_json_error( esc_html__( 'Security check failed', 'pojo-accessibility' ) );
			return;
		}

		// Check user capabilities
		if ( ! Utils::user_is_admin() ) {
			wp_send_json_error( esc_html__( 'Insufficient permissions', 'pojo-accessibility' ) );
			return;
		}

		$reason = sanitize_text_field( wp_unslash( $_POST['reason'] ?? '' ) );
		$additional_data = [];

		// Safely handle additional_data if it exists
		if ( isset( $_POST['additional_data'] ) && is_array( $_POST['additional_data'] ) ) {
			$additional_data_raw = map_deep( wp_unslash( $_POST['additional_data'] ), 'sanitize_text_field' );
			foreach ( $additional_data_raw as $key => $value ) {
				$additional_data[ sanitize_key( $key ) ] = sanitize_textarea_field( $value );
			}
		}

		if ( empty( $reason ) ) {
			wp_send_json_success( [ 'message' => 'No reason provided' ] );
			return;
		}

		// Send feedback to external service
		$feedback_sent = $this->send_feedback_to_service( $reason, $additional_data );

		if ( $feedback_sent ) {
			wp_send_json_success( [ 'message' => 'Feedback sent successfully' ] );
		} else {
			// Still return success to not block deactivation, but log the error
			Logger::error( 'Failed to send deactivation feedback to service' );
			wp_send_json_success( [ 'message' => 'Feedback logged locally' ] );
		}
	}

	/**
	 * Send feedback to external service
	 *
	 * @param string $reason The deactivation reason
	 * @param array  $additional_data Additional feedback data from text fields
	 * @return bool Whether the feedback was sent successfully
	 */
	private function send_feedback_to_service( string $reason, array $additional_data = [] ): bool {
		$feedback_data = $this->prepare_feedback_data( $reason, $additional_data );

		// Get the feedback service endpoint
		$service_url = $this->get_feedback_service_url();

		if ( empty( $service_url ) ) {
			return false;
		}

		// Send the feedback via HTTP POST
		$response = wp_remote_post( $service_url, [
			'timeout'     => 10,
			'redirection' => 5,
			'httpversion' => '1.0',
			'blocking'    => true,
			'headers'     => [
				'Content-Type' => 'application/json',
				'User-Agent'   => 'WordPress/' . get_bloginfo( 'version' ) . '; ' . home_url(),
			],
			'body'        => wp_json_encode( $feedback_data ),
			'cookies'     => [],
		] );

		// Check for errors
		if ( is_wp_error( $response ) ) {
			Logger::error( 'Failed to post feedback:' . $response->get_error_message() );
			return false;
		}

		$response_code = wp_remote_retrieve_response_code( $response );

		// Consider 2xx status codes as success
		if ( $response_code >= 200 && $response_code < 300 ) {
			return true;
		}

		Logger::error( 'Feedback error: HTTP ' . $response_code );
		return false;
	}

	/**
	 * Prepare feedback data for the service
	 *
	 * @param string $reason The deactivation reason
	 * @param array  $additional_data Additional feedback data from text fields
	 * @return array Formatted feedback data
	 */
	private function prepare_feedback_data( string $reason, array $additional_data = [] ): array {
		$data = [
			'plugin'         => 'ea11y',
			'plugin_version' => EA11Y_VERSION,
			'reason'         => $reason,
			'site_url'       => home_url(),
			'wp_version'     => get_bloginfo( 'version' ),
			'php_version'    => PHP_VERSION,
			'timestamp'      => current_time( 'mysql' ),
			'user_agent'     => sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ?? '' ) ),
			'locale'         => get_locale(),
		];

		// Add additional data if provided
		if ( ! empty( $additional_data ) ) {
			$data['additional_feedback'] = $additional_data;
		}

		return $data;
	}

	/**
	 * Get the feedback service URL
	 *
	 * @return string The service endpoint URL
	 */
	private function get_feedback_service_url(): string {
		// You can customize this URL or make it configurable
		$default_url = 'https://go.elementor.com/api/feedback/deactivation';

		/**
		 * Filter the feedback service URL
		 *
		 * @param string $url The feedback service URL
		 */
		return apply_filters( 'ea11y_feedback_service_url', $default_url );
	}

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_deactivation_assets' ] );
		add_action( 'admin_footer', [ $this, 'add_deactivation_modal' ] );
		add_action( 'wp_ajax_ea11y_deactivation_feedback', [ $this, 'handle_deactivation_feedback' ] );
	}
}
