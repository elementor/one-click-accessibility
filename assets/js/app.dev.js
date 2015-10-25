/*!
 * @author: Pojo Team
 */
/* global jQuery, PojoA11yOptions */

( function( $, window, document, undefined ) {
	'use strict';

	var Pojo_Accessibility_App = {
		cache: {
			$document: $( document ),
			$window: $( window )
		},

		cacheElements: function() {
			this.cache.$toolbar = $( '#pojo-a11y-toolbar' );
			this.cache.$btnToolbarToggle = this.cache.$toolbar.find( 'div.pojo-a11y-toolbar-toggle > a' );
			this.cache.$btnBackgrounGroup = this.cache.$toolbar.find( 'a.pojo-a11y-btn-background-group' );
			this.cache.$body = $( 'body' );
		},

		buildElements: function() {
			// Move the toolbar to top
			this.cache.$body.prepend( this.cache.$toolbar );
		},

		bindEvents: function() {
			var $self = this;

			$self.cache.$btnToolbarToggle.on( 'click', function( event ) {
				event.preventDefault();
				
				$self.cache.$toolbar.toggleClass( 'pojo-a11y-toolbar-open' );
			} );
			
			
			$self.bindToolbarButtons();
		},
		
		bindToolbarButtons: function() {
			var $self = this;

			$self.currentFontSize = 120;

			$self.cache.$toolbar.find( 'a.pojo-a11y-btn-resize-font' ).on( 'click', function( event ) {
				event.preventDefault();

				var MAX_SIZE = 160,
					MIN_SIZE = 120,
					action = $( this ).data( 'action' ),
					oldFontSize = $self.currentFontSize;

				if ( 'plus' === action && MAX_SIZE > oldFontSize ) {
					$self.currentFontSize += 10;
				}

				if ( 'minus' === action && MIN_SIZE < oldFontSize ) {
					$self.currentFontSize -= 10;
				}

				$self.cache.$body.removeClass( 'pojo-a11y-resize-font-' + oldFontSize );

				if ( 120 !== $self.currentFontSize ) {
					$self.cache.$body.addClass( 'pojo-a11y-resize-font-' + $self.currentFontSize );
				}
			} );

			$self.cache.$btnBackgrounGroup.on( 'click', function( event ) {
				event.preventDefault();
				
				var currentAction = $( this ).data( 'action' ),
					isButtonActive = $( this ).hasClass( 'active' ),
					bodyClasses = {
						'grayscale': 'pojo-a11y-grayscale',
						'contrast': 'pojo-a11y-contrast',
						'light-bg': 'pojo-a11y-light-background'
					};
				
				$.each( bodyClasses, function( action, bodyClass ) {
					if ( currentAction === action && ! isButtonActive ) {
						$self.cache.$body.addClass( bodyClass );
					} else {
						$self.cache.$body.removeClass( bodyClass );
					}
				} );
				
				$self.cache.$btnBackgrounGroup.removeClass( 'active' );
				
				if ( ! isButtonActive ) {
					$( this ).addClass( 'active' );
				}
			} );

			$self.cache.$toolbar.find( 'a.pojo-a11y-btn-links-underline' ).on( 'click', function( event ) {
				event.preventDefault();

				$self.cache.$body.toggleClass( 'pojo-a11y-links-underline' );
				$( this ).toggleClass( 'active' );
			} );

			$self.cache.$toolbar.find( 'a.pojo-a11y-btn-readable-font' ).on( 'click', function( event ) {
				event.preventDefault();

				$self.cache.$body.toggleClass( 'pojo-a11y-readable-font' );
				$( this ).toggleClass( 'active' );
			} );

			$self.cache.$toolbar.find( 'a.pojo-a11y-btn-reset' ).on( 'click', function( event ) {
				event.preventDefault();

				$self.cache.$body.removeClass( 'pojo-a11y-grayscale pojo-a11y-contrast pojo-a11y-light-background pojo-a11y-links-underline pojo-a11y-readable-font' );

				var MIN_SIZE = 120;
				$self.cache.$body.removeClass( 'pojo-a11y-resize-font-' + $self.currentFontSize );
				$self.currentFontSize = MIN_SIZE;
			} );
		},

		handleGlobalOptions: function() {
			if ( '1' === PojoA11yOptions.remove_link_target ) {
				$( 'a[target="_blank"]' ).attr( 'target', '' );
			}
			
			if ( '1' === PojoA11yOptions.add_role_links ) {
				$( 'a' ).attr( 'role', 'link' );
			}
		},
		
		init: function() {
			this.cacheElements();
			this.buildElements();
			this.bindEvents();
			this.handleGlobalOptions();
		}
	};

	$( document ).ready( function( $ ) {
		Pojo_Accessibility_App.init();
	} );

}( jQuery, window, document ) );
