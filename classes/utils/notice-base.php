<?php

namespace EA11y\Classes\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * Class Notice_Base
 */
class Notice_Base {
	/**
	 * The action prefix for the notice
	 *
	 * @var string
	 */
	const ACTION_PREFIX = 'ea11y_admin_notice';

	/**
	 * The option name / meta key for dismissed notices
	 *
	 * @var string
	 */
	const DISMISSED_NOTICES = 'ea11y_dismissed_notices';

	/**
	 * @var bool $conditions
	 */
	public bool $conditions = true;

	/**
	 * Whether the notice is dismissible
	 *
	 * @var bool
	 */
	public bool $is_dismissible = false;

	/**
	 * Whether the notice is dismissible per user or globally
	 *
	 * @var bool
	 */
	public bool $per_user = true;

	/**
	 * The notice ID
	 *
	 * @var string
	 */
	public string $id = '';

	/**
	 * The notice content
	 *
	 * @var string
	 */
	public string $content;

	/**
	 * should be one of 'info', 'warning', 'error', 'success', 'error-elementor'
	 * @var string
	 */
	public string $type;

	/**
	 * @var mixed|string
	 */
	public $capability;

	/**
	 * Get the notice ID
	 *
	 * @return string
	 */
	public function get_id() : string {
		return $this->id;
	}

	/**
	 * Get the action name for the notice
	 *
	 * @return string
	 */
	public function get_action_name() : string {
		return self::ACTION_PREFIX . '_' . $this->get_id();
	}


	public function show(): bool {
		if ( ! $this->conditions ) {
			return false;
		}
		if ( $this->is_dismissible && $this->is_dismissed() ) {
			return false;
		}
		if ( $this->capability && ! current_user_can( $this->capability ) ) {
			return false;
		}
		return true;
	}

	public function is_dismissed() : bool {
		if ( $this->per_user ) {
			$dismissed = get_user_meta( get_current_user_id(), self::DISMISSED_NOTICES, true );
		} else {
			$dismissed = get_option( self::DISMISSED_NOTICES, [] );
		}
		return in_array( $this->get_id(), (array) $dismissed );
	}

	public function dismiss(): void {
		$dismissed = get_option( self::DISMISSED_NOTICES, [] );
		$dismissed[] = $this->get_id();
		update_option( self::DISMISSED_NOTICES, $dismissed, false );
	}

	public function undismiss(): void {
		$dismissed = get_option( self::DISMISSED_NOTICES, [] );

		if ( ! in_array( $this->get_id(), $dismissed ) ) {
			return;
		}

		$dismissed = array_diff( $dismissed, [ $this->get_id() ] );
		update_option( self::DISMISSED_NOTICES, $dismissed, false );
	}

	public function dismiss_per_user(): void {
		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			wp_send_json_error( [ 'message' => 'Invalid user' ] );
		}
		$dismissed = get_user_meta( $user_id, self::DISMISSED_NOTICES, true );
		if ( ! $dismissed ) {
			$dismissed = [];
		}
		$dismissed[] = $this->get_id();
		update_user_meta( $user_id, self::DISMISSED_NOTICES, $dismissed );
	}

	public function handle_dismiss() {
		if ( ! $this->is_dismissible ) {
			return;
		}
		if ( ! isset( $_REQUEST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_REQUEST['nonce'] ) ), $this->get_action_name() ) ) {
			wp_send_json_error( [ 'message' => 'Invalid nonce' ] );
		}

		if ( $this->per_user ) {
			$this->dismiss_per_user();
		} else {
			$this->dismiss();
		}

		wp_send_json_success( [] );
	}

	public function render() {
		echo sprintf( '<div class="notice_wrapper notice %1$s notice-%2$s %2$s %3$s" data-notice-id="%3$s" data-notice-action="%4$s" data-notice-nonce="%5$s">%6$s</div>',
			$this->is_dismissible ? 'ea11y-dismiss is-dismissible' : '',
			esc_attr( $this->type ),
			esc_attr( $this->get_id() ),
			esc_attr( $this->get_action_name() ),
			wp_create_nonce( $this->get_action_name() ),
			$this->content()
		);
	}

	public function print_js() {
		// used to make sure we only print this js once per page
		$action = 'admin_notices_print_js';
		if ( did_action( $action ) ) {
			return;
		}
		do_action( $action );

		?>
		<script>
			jQuery( document ).ready( function() {
				jQuery( '.ea11y-dismiss' ).on( 'click', function() {
					const $this = jQuery( this );
					const data = {
						action: 'ea11y_admin_notice_dismiss',
						nonce: $this.data( 'notice-nonce' ),
						notice_id: $this.data( 'notice-id' ),
					};
					jQuery.post( ajaxurl, data, function( response ) {
						if ( response.success ) {
							$this.slideUp();
						}
					} );
				} );
			} );
		</script>
		<?php
	}

	public function maybe_show_notice() {
		if ( ! $this->show() ) {
			return;
		}
		if ( $this->is_dismissible ) {
			add_action( 'admin_footer', [ $this, 'print_js' ] );
		}

		$this->render();
	}

	public function content(): string {
		return $this->content;
	}

	/**
	 * @throws \Exception
	 */
	public function __construct() {
		if ( ! $this->content() ) {
			throw new \Exception( 'Notice content is required' );
		}

		if ( ! in_array( $this->type, [ 'info', 'warning', 'error', 'success', 'error-elementor' ] ) ) {
			throw new \Exception( 'Invalid notice type' );
		}
	}
}
