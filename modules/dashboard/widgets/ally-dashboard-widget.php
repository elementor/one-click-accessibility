<?php

namespace EA11y\Modules\Dashboard\Widgets;

use EA11y\Modules\Scanner\Classes\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Ally_Dashboard_Widget {
	/**
	 * Displays the Ally dashboard widget.
	 *
	 * @access public
	 */
	public static function ally_widget_render(): void {
		$stats = Utils::get_scanner_stats();
		$is_not_empty = $stats['pages'] > 0;
		$percent = $stats['issues_total'] ? $stats['issues_fixed'] / $stats['issues_total'] * 100 : 0;
		$link = $is_not_empty
			? admin_url( 'admin.php?page=accessibility-settings' )
			: site_url().'?open-ea11y-assistant=1&open-ea11y-assistant-src=Ally_dashboard';
	?>
		<div class="ea11y-dashboard-widget">
			<div class="ea11y-dashboard-widget-img">
				<?php echo self::generate_progress_svg($percent); ?>
				<?php if (!$is_not_empty): ?>
					<span class="ea11y-dashboard-widget-count">
						<?php echo esc_html( $stats['pages'] ); ?>
					</span>
				<?php endif; ?>
			</div>
			<div class="ea11y-dashboard-widget-info">
				<h4 class="ea11y-dashboard-widget-title">
					<?php $is_not_empty
						? esc_html_e( 'Keep improving your accessibility', 'pojo-accessibility' )
						: esc_html_e( "Important: your site hasn't been scanned", 'pojo-accessibility' ); ?>
				</h4>
				<?php if ($is_not_empty): ?>
					<p class="ea11y-dashboard-widget-stats">
						<span class="ea11y-dashboard-widget-stats-details ea11y-dashboard-widget-stats-details--green">
							<?php echo esc_html(
								sprintf(
									__( '%s issues fixed', 'pojo-accessibility' ),
									$stats['issues_fixed']
								)
							); ?>
						</span>
						<span class="ea11y-dashboard-widget-stats-details ea11y-dashboard-widget-stats-details--red">
							<?php echo esc_html(
								sprintf(
									__( '%s open issues', 'pojo-accessibility' ),
									$stats['issues_total']
								)
							); ?>
						</span>
					</p>
				<?php else: ?>
					<p class="ea11y-dashboard-widget-description">
						<?php esc_html_e( 'Run your first accessibility scan for instant insights and quick, actionable fixes.', 'pojo-accessibility' ) ?>
					</p>
				<?php endif; ?>

				<a href="<?php echo esc_url( $link ); ?>" <?php echo !$is_not_empty ? 'target="_blank" rel="noreferrer" ': ''; ?> class="button button-primary">
					<?php $is_not_empty
						? esc_html_e( 'Fix open issues', 'pojo-accessibility' )
						: esc_html_e( 'Scan home page', 'pojo-accessibility' ); ?>
				</a>
			</div>
		</div>
	<?php }

	public static function generate_progress_svg($percent): string {
		$radius = 70;
		$circumference = 2 * M_PI * $radius;
		$offset = $circumference - ($percent / 100) * $circumference;

		return '
			<svg xmlns="http://www.w3.org/2000/svg" width="151" height="151" viewBox="0 0 151 151">
				<!-- Background circle -->
				<circle cx="75.5" cy="75.5" r="70" stroke="' . ($percent > 0 ? '#DC2626' : '#E0E0E0') . '" stroke-width="12" fill="none"/>

				<!-- Foreground progress -->
				<circle cx="75.5" cy="75.5" r="70" stroke="#10B981" stroke-width="12" fill="none" transform="rotate(-90 75.5 75.5)"
					stroke-dasharray="'.$circumference.'"
					stroke-dashoffset="'.$offset.'"
				/>
			</svg>
		';
	}


	/**
	 * Add widget to the list
	 *
	 * @access public
	 */
	public static function register_ally_dashboard_widgets() {
		add_meta_box(
			'ea11y-dashboard-widget',
			'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
					<path fill-rule="evenodd" clip-rule="evenodd" d="M1.6853 15.5557C0.586489 13.9112 0 11.9778 0 10C0 7.34785 1.05357 4.8043 2.92893 2.92893C4.8043 1.05357 7.34785 0 10 0C11.9778 0 13.9112 0.586489 15.5557 1.6853C17.2002 2.78412 18.4819 4.3459 19.2388 6.17316C19.9957 8.00042 20.1937 10.0111 19.8078 11.9509C19.422 13.8907 18.4696 15.6725 17.0711 17.0711C15.6725 18.4696 13.8907 19.422 11.9509 19.8078C10.0111 20.1937 8.00042 19.9957 6.17316 19.2388C4.3459 18.4819 2.78412 17.2002 1.6853 15.5557ZM7.50039 5.83301H5.83398V14.1666H7.50039V5.83301ZM14.166 5.83301H9.16683V7.49941H14.166V5.83301ZM14.166 9.16585H9.16683V10.8323H14.166V9.16585ZM14.166 12.5002H9.16683V14.1666H14.166V12.5002Z" fill="#0C0D0E"/>
				</svg>'.esc_html__( 'Accessibility', 'pojo-accessibility' ),
			[ self::class, 'ally_widget_render' ],
			'dashboard',
			'column3',
			'high'
		);
	}

	public static function init(): void {
		// Register Dashboard Widgets.
		add_action( 'wp_dashboard_setup', [ self::class, 'register_ally_dashboard_widgets' ], 99 );
	}
}
