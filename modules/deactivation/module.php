<?php

namespace EA11y\Modules\Deactivation;

use EA11y\Classes\Logger;
use EA11y\Classes\Module_Base;
use EA11y\Classes\Utils;
use EA11y\Classes\Services\Client;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Class Module
 */
class Module extends Module_Base {

	const SERVICE_ENDPOINT = 'feedback/deactivation';

	/**
	 * Get module name.
	 * Retrieve the module name.
	 *
	 * @access public
	 * @return string Module name.
	 */
	public function get_name(): string {
		return 'deactivation';
	}

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
		add_thickbox();

		Utils\Assets::enqueue_app_assets( 'deactivation-ally' );

		wp_localize_script(
			'deactivation-ally',
			'ea11yDeactivationFeedback',
			[
				'nonce' => wp_create_nonce( 'ea11y_deactivation_feedback' ),
				'ajaxurl' => admin_url( 'admin-ajax.php' ),
			]
		);
		
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
		$additional_data = '';

		// Safely handle additional_data if it exists
		if ( isset( $_POST['additional_data'] ) ) {
			$additional_data = sanitize_textarea_field( wp_unslash( $_POST['additional_data'] ) );
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
	 * @param string $additional_data Additional feedback data from text fields
	 * @return bool Whether the feedback was sent successfully
	 */
	private function send_feedback_to_service( string $reason, string $additional_data = '' ): bool {
		$feedback_data = $this->prepare_feedback_data( $reason, $additional_data );

		$response = Client::get_instance()->make_request(
			'POST',
			self::SERVICE_ENDPOINT,
			$feedback_data
		);

		if ( empty( $response ) || is_wp_error( $response ) ) {
			Logger::error( 'Failed to post feedback:' . $response->get_error_message() );
			return false;
		}
		
		return true;
	}

	/**
	 * Prepare feedback data for the service
	 *
	 * @param string $reason The deactivation reason
	 * @param string $additional_data Additional feedback data from text fields
	 * @return array Formatted feedback data
	 */
	private function prepare_feedback_data( string $reason, string $additional_data = '' ): array {
		$data = [
			'app'         => 'ally',
			'app_version' => EA11Y_VERSION,
			'selected_answer'         => $reason,
			'site_url'       => home_url(),
			'wp_version'     => get_bloginfo( 'version' ),
			'php_version'    => PHP_VERSION,
			'timestamp'      => current_time( 'mysql' ),
			'user_agent'     => sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ?? '' ) ),
			'locale'         => get_locale(),
		];

		// Add additional data if provided
		if ( ! empty( $additional_data ) ) {
			$data['feedback_text'] = $additional_data;
		}

		return $data;
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
