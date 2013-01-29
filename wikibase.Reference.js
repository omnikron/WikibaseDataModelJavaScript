/**
 * @file
 * @ingroup WikibaseLib
 * @licence GNU GPL v2+
 * @author Jeroen De Dauw < jeroendedauw@gmail.com >
 */
( function( wb, $, undefined ) {
	'use strict';

	/**
	 * Represents a Wikibase Reference in JavaScript.
	 * @constructor
	 * @since 0.3
	 * @see https://meta.wikimedia.org/wiki/Wikidata/Data_model#ReferenceRecords
	 *
	 * @param {wb.Snak[]|wb.Snak|wb.SnakList} [snaks]
	 * @param {string} [hash] The hash of the Reference, required when API is used to change or
	 *        remove a certain Reference. In the PHP object model, the hash of a Reference changes
	 *        always when the Reference changes. In the JavaScript Reference object the hash will
	 *        not change but remain the same.
	 *
	 * TODO: get rid of 'hash' parameter and introduce a method to generate the hash, but make sure
	 *       it will be the same as it would be for a Reference in PHP.
	 */
	wb.Reference = function( snaks, hash ) {
		this.setSnaks( snaks );
		this._hash = hash;
	};

	wb.Reference.prototype = {
		/**
		 * @type string|null
		 */
		_hash: null,

		/**
		 * @type wb.SnakList
		 * @todo think about implementing a SnakList rather than having an Array here
		 */
		_snaks: null,

		/**
		 * Will return the hash set for the reference initially in the constructor. This is required
		 * when changing a reference via the API and differs from the PHP's Reference's getHash.
		 * @since 0.4
		 *
		 * @return string|null
		 */
		getHash: function() {
			return this._hash;
		},

		/**
		 * Returns a list of the Snaks.
		 *
		 * @return wb.SnakList
		 */
		getSnaks: function() {
			return this._snaks;
		},

		/**
		 * Overwrites the current set of snaks.
		 *
		  * @param {wb.Snak[]|wb.Snak|wb.SnakList} snaks
		 */
		setSnaks: function( snaks ) {
			this._snaks = new wb.SnakList( snaks );
		}
	};

	wb.Reference.newFromJSON = function( json ) {
		return new wb.Reference(
			wb.SnakList.newFromJSON( json.snaks ),
			json.hash
		);
	};

}( wikibase, jQuery ) );
