( function( wb, $ ) {
	'use strict';

/**
 * Container for a list of snaks.
 * For reduced complexity, hash management as done in the back-end object model is omitted. When
 * altering a reference via the API, a new Reference object featuring the new hash generated by the
 * back-end should be instantiated.
 * @class wikibase.datamodel.Reference
 * @since 0.3
 * @licence GNU GPL v2+
 * @author Daniel Werner < daniel.werner@wikimedia.de >
 * @author H. Snater < mediawiki@snater.com >
 *
 * @constructor
 *
 * @param {wikibase.datamodel.SnakList|null} [snaks]
 * @param {string} [hash] Omit, if the Reference object should represent a new reference.
 *
 * @throws {Error} if snaks are not passed as SnakList instance.
 */
var SELF = wb.datamodel.Reference = function WbDataModelReference( snaks, hash ) {
	snaks = snaks || new wb.datamodel.SnakList();

	if( !( snaks instanceof wb.datamodel.SnakList ) ) {
		throw new Error( 'Snak objects need to be supplied as a SnakList' );
	}

	this._snaks = snaks;
	this._hash = hash;
};

$.extend( SELF.prototype, {
	/**
	 * @type {string|null}
	 * @private
	 */
	_hash: null,

	/**
	 * @type {wikibase.datamodel.SnakList}
	 * @private
	 */
	_snaks: null,

	/**
	 * Returns the Reference's hash.
	 *
	 * @return {string|null}
	 */
	getHash: function() {
		return this._hash;
	},

	/**
	 * Returns the Reference's Snaks.
	 *
	 * @return {wikibase.datamodel.SnakList}
	 */
	getSnaks: function() {
		return this._snaks;
	},

	/**
	 * @param {*} reference
	 * @return {boolean}
	 */
	equals: function( reference ) {
		return reference === this
			|| this._snaks.equals( reference.getSnaks() ) && this._hash === reference.getHash();
	}
} );

}( wikibase, jQuery ) );
