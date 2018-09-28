var popupDialog = popupDialog || (function ($) {
    'use strict';

	// Creating modal dialog's DOM
	var $dialog = $(
		'<div class="modal fade modal__notification" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="overflow-y:visible;">' +
		'<div class="modal-dialog modal-m">' +
		'<div class="modal-content">' +
			'<div class="modal-header"> <button type="button" class="close" data-dismiss="modal">×</button><h3 style="margin:0;"></h3></div>' +
			'<div class="modal-body">' +
				'<div class="modal-message"></div>' +
            '</div>' +
		'</div></div></div>');

	return {
		/**
		 * Opens our dialog
         * @param title title
		 * @param message Custom message
		 * @param options Custom options:
		 * 				  options.dialogSize - bootstrap postfix for dialog size, e.g. "sm", "m";
		 * 				  options.progressType - bootstrap postfix for progress bar type, e.g. "success", "warning".
		 */
		show: function (title, message,data, options ) {
			// Assigning defaults
			if (typeof options === 'undefined') {
				options = {};
			}
			if (typeof message === 'undefined') {
				message = 'Loading';
			}
			var settings = $.extend({
				dialogSize: 'm',
                onHide: null, // This callback runs after the dialog was hidden
                onShown: null 
			}, options);

			// Configuring dialog
			$dialog.find('.modal-dialog').attr('class', 'modal-dialog').addClass('modal-' + settings.dialogSize);
            $dialog.find('h3').text(title);
            $dialog.find('.modal-message').html(message);
			// Adding callbacks
			if (typeof settings.onHide === 'function') {
				$dialog.off('hidden.bs.modal').on('hidden.bs.modal', function (e) {
					settings.onHide.call($dialog);
				});
			}
			// Opening dialog
            $dialog.modal({backdrop: true});
            $dialog.on('shown.bs.modal', function(){
                if (typeof settings.onShown === 'function') {
                    settings.onShown.call($dialog, data);
                }
            } );
		},
		/**
		 * Closes dialog
		 */
		hide: function () {
			$dialog.modal('hide');
		}
	};

})(jQuery);

