( function( wb, $ ) {
'use strict';

/**
 * List of texts for one language.
 * @class wikibase.datamodel.MultiTerm
 * @since 1.0
 * @licence GNU GPL v2+
 * @author H. Snater < mediawiki@snater.com >
 *
 * @constructor
 *
 * @param {string} languageCode
 * @param {string[]} texts
 */
var SELF = wb.datamodel.MultiTerm = function WbDataModelMultiTerm( languageCode, texts ) {
	this.setLanguageCode( languageCode );
	this.setTexts( texts );
};

$.extend( SELF.prototype, {
	/**
	 * @property {string}
	 * @private
	 */
	_languageCode: null,

	/**
	 * @property {string[]}
	 * @private
	 */
	_texts: null,

	/**
	 * @return {string}
	 */
	getLanguageCode: function() {
		return this._languageCode;
	},

	/**
	 * @param {string} languageCode
	 *
	 * @throws {Error} when the language code is not a string.
	 */
	setLanguageCode: function( languageCode ) {
		if( typeof languageCode !== 'string' ) {
			throw new Error( 'Language code has to be a string' );
		}
		this._languageCode = languageCode;
	},

	/**
	 * @return {string[]}
	 */
	getTexts: function() {
		return $.merge( [], this._texts );
	},

	/**
	 * @param {string[]} texts
	 *
	 * @throws {Error} when texts is not an array.
	 */
	setTexts: function( texts ) {
		if( !$.isArray( texts ) ) {
			throw new Error( 'texts needs to be an array of strings' );
		}
		this._texts = texts;
	},

	/**
	 * @param {*} multiTerm
	 * @return {boolean}
	 */
	equals: function( multiTerm ) {
		if( multiTerm === this ) {
			return true;
		} else if(
			!( multiTerm instanceof SELF )
			|| this._languageCode !== multiTerm.getLanguageCode()
		) {
			return false;
		}

		var otherTexts = multiTerm.getTexts();

		if( this._texts.length !== otherTexts.length ) {
			return false;
		}

		for( var i = 0; i < this._texts.length; i++ ) {
			if( $.inArray( this._texts[i], otherTexts ) === -1 ) {
				return false;
			}
		}

		return true;
	},

	/**
	 * @return {boolean}
	 */
	isEmpty: function() {
		return !this._texts.length;
	}

} );

}( wikibase, jQuery ) );
