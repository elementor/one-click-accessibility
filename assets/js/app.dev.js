/*!
 * @author: Pojo Team
 */
/* global jQuery */

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

			$self.cache.$toolbar.find( 'a.pojo-a11y-btn-grayscale' ).on( 'click', function( event ) {
				event.preventDefault();

				$self.cache.$body.toggleClass( 'pojo-a11y-grayscale' );
				$( this ).toggleClass( 'active' );
			} );

			$self.cache.$toolbar.find( 'a.pojo-a11y-btn-contrast' ).on( 'click', function( event ) {
				event.preventDefault();

				$self.cache.$body.toggleClass( 'pojo-a11y-contrast' );
				$( this ).toggleClass( 'active' );
			} );

			$self.cache.$toolbar.find( 'a.pojo-a11y-btn-light-bg' ).on( 'click', function( event ) {
				event.preventDefault();

				$self.cache.$body.toggleClass( 'pojo-a11y-light-background' );
				$( this ).toggleClass( 'active' );
			} );

			$self.cache.$toolbar.find( 'a.pojo-a11y-btn-links-underline' ).on( 'click', function( event ) {
				event.preventDefault();

				$self.cache.$body.toggleClass( 'pojo-a11y-links-underline' );
				$( this ).toggleClass( 'active' );
			} );

			$self.cache.$toolbar.find( 'a.pojo-a11y-btn-font-readable' ).on( 'click', function( event ) {
				event.preventDefault();

				$self.cache.$body.toggleClass( 'pojo-a11y-font-readable' );
				$( this ).toggleClass( 'active' );
			} );

			$self.cache.$toolbar.find( 'a.pojo-a11y-btn-reset' ).on( 'click', function( event ) {
				event.preventDefault();

				$self.cache.$body.removeClass( 'pojo-a11y-grayscale pojo-a11y-contrast pojo-a11y-light-background pojo-a11y-links-underline pojo-a11y-font-readable' );

				var MIN_SIZE = 120;
				$self.cache.$body.removeClass( 'pojo-a11y-resize-font-' + $self.currentFontSize );
				$self.currentFontSize = MIN_SIZE;
			} );
		},

		init: function() {
			this.cacheElements();
			this.buildElements();
			this.bindEvents();
		}
	};

	$( document ).ready( function( $ ) {
		Pojo_Accessibility_App.init();
	} );

}( jQuery, window, document ) );
