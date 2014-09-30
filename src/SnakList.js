/**
 * @licence GNU GPL v2+
 * @author Daniel Werner < daniel.werner@wikimedia.de >
 * @author H. Snater < mediawiki@snater.com >
 */
( function( wb, $ ) {
'use strict';

/**
 * Container for a list of Snaks. Each snak within the list in unique, Snaks considered as equal
 * will not be added to the list a second time.
 *
 * @constructor
 * @abstract
 * @since 0.3
 *
 * @param {wb.datamodel.Snak[]|wb.datamodel.Snak|wb.datamodel.SnakList} [snaks] One or more Snaks in
 *        the list initially.
 */
var SELF = wb.datamodel.SnakList = function WbSnakList( snaks ) {
	this._snaks = [];
	this.length = 0;

	if( $.isArray( snaks ) ) {
		for( var i in snaks ) {
			this.addSnak( snaks[i] );
		}
	}
	else if( snaks instanceof wb.datamodel.SnakList ) {
		this._snaks = snaks.toArray();
		this.length = this._snaks.length;
	}
	else if( snaks instanceof wb.datamodel.Snak ) {
		this.addSnak( snaks );
	}
	else if( snaks !== undefined ) {
		throw new Error( 'Unknown first argument in SnakList constructor' );
	}
};

$.extend( SELF.prototype, {
	/**
	 * Number of snaks in the list currently.
	 * @type number
	 */
	length: 0,

	/**
	 * List of snaks for keeping track over Snaks internally.
	 * @type wb.datamodel.Snak[]
	 */
	_snaks: null,

	/**
	 * Will add a given Snak to the list of Snaks. If an equal Snak is in the list already, the
	 * Snak will not be added.
	 *
	 * @param {wb.datamodel.Snak} snak
	 * @return boolean Whether Snak was not yet in the list and therefore added.
	 */
	addSnak: function( snak ) {
		if( !( snak instanceof wb.datamodel.Snak ) ) {
			throw new Error( 'No Snak given which could be added to the Snak list' );
		}
		// if an equal Snak is in the list already, don't add it again!
		if( !this.hasSnak( snak ) ) {
			this._snaks.push( snak );
			this.length++;
			return true;
		}
		return false;
	},

	/**
	 * Removes a given Snak from the list.
	 *
	 * @param {wb.datamodel.Snak} snak
	 * @return boolean Whether Snak was in the list and therefore removed.
	 */
	removeSnak: function( snak ) {
		// if an equal Snak is in the list already, don't add it again
		for( var i in this._snaks ) {
			if( this._snaks[i].equals( snak ) ) {
				// JS will not leave 'gaps' in the array, so no worries about the each()'s
				// callback's index.
				this._snaks.splice( i, 1 );
				this.length--;
				return true;
			}
		}
		return false;
	},

	/**
	 * Returns a snak list with the snaks that feature the specified property id. If the property id
	 * parameter is omitted, a copy of the whole SnakList object is returned.
	 *
	 * @param {string} [propertyId]
	 * @return {wikibase.datamodel.SnakList}
	 */
	getFilteredSnakList: function( propertyId ) {
		if( !propertyId ) {
			return new wb.datamodel.SnakList( $.merge( [], this._snaks ) );
		}

		var filteredQualifiers = new wb.datamodel.SnakList();

		this.each( function( i, snak ) {
			if( snak.getPropertyId() === propertyId ) {
				filteredQualifiers.addSnak( snak );
			}
		} );

		return filteredQualifiers;
	},

	/**
	 * Returns a list of SnakList objects, each of them grouped by the property used by the snaks.
	 *
	 * @return {wikibase.datamodel.SnakList[]}
	 */
	getGroupedSnakLists: function() {
		var groupedSnakLists = [],
			propertyIds = this.getPropertyOrder();

		for( var i = 0; i < propertyIds.length; i++ ) {
			groupedSnakLists.push( this.getFilteredSnakList( propertyIds[i] ) );
		}

		return groupedSnakLists;
	},

	/**
	 * Returns whether the list contains a Snak equal to a given one.
	 *
	 * @param {wb.datamodel.Snak} snak
	 * @return boolean
	 */
	hasSnak: function( snak ) {
		for( var i in this._snaks ) {
			if( this._snaks[i].equals( snak ) ) {
				return true;
			}
		}
		return false;
	},

	/**
	 * Will return whether a given Snak list equals this one.
	 *
	 * @param {wb.datamodel.SnakList} snakList
	 * @return boolean
	 */
	equals: function( snakList ) {
		if( snakList.constructor !== this.constructor
			|| snakList.length !== this.length
		) {
			return false;
		}

		var otherSnaks = snakList.toArray();

		// Compare to other snak lists snaks considering order:
		for( var i = 0; i < otherSnaks.length; i++ ) {
			if( !this._snaks[i].equals( otherSnaks[i] ) ) {
				return false;
			}
		}

		return true;
	},

	/**
	 * Iterates over all Snaks in the list, similar to jQuery.each.
	 *
	 * @param {Function} fn A callback, called for each Snak in the list. The callback can have
	 *        two parameters:
	 *        (1) {Number} index A continuous number, increased with each callback.
	 *        (2) {wb.datamodel.Snak} snak A Snak from the list.
	 *        If false is returned by one of the callbacks, the iteration will stop. The context of
	 *        the callbacks will be the Snak object.
	 */
	each: function( fn ) {
		$.each.call( null, this._snaks, fn );
	},

	/**
	 * Adds the snaks of another snak list to this snak list.
	 *
	 * @param {wikibase.datamodel.SnakList} snakList
	 */
	add: function( snakList ) {
		var self = this;

		snakList.each( function( i, snak ) {
			if( !self.hasSnak( snak ) ) {
				self._snaks.push( snak );
				self.length++;
			}
		} );
	},

	/**
	 * Returns a list of property ids representing the order of the snaks grouped by property.
	 *
	 * @return {string[]}
	 */
	getPropertyOrder: function() {
		var propertyIds = [];

		this.each( function( i, snak ) {
			var propertyId = snak.getPropertyId();

			if( $.inArray( propertyId, propertyIds ) === -1 ) {
				propertyIds.push( propertyId );
			}
		} );

		return propertyIds;
	},

	/**
	 * Returns a snak's index within the snak list. Returns -1 when the snak could not be found.
	 *
	 * @param {wikibase.datamodel.Snak} snak
	 * @return {number}
	 */
	indexOf: function( snak ) {
		for( var i = 0; i < this._snaks.length; i++ ) {
			if( this._snaks[i].equals( snak ) ) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * Returns the indices of the snak list where a certain snak may be moved to. A snak may be
	 * moved within its property group. It may also be moved to the slots between property groups
	 * which involves moving the whole property group the snak belongs to.
	 *
	 * @param {wikibase.datamodel.Snak} snak
	 * @return {number[]}
	 */
	getValidMoveIndices: function( snak ) {
		var self = this,
			indices = [],
			isGroupLast = false;

		this.each( function( i, snakListSnak ) {
			if( snakListSnak.getPropertyId() === snak.getPropertyId() ) {
				// Detect slots within the snak's property group.
				if( snakListSnak !== snak ) {
					indices.push( i );
				} else {
					var nextSnak = self._snaks[i + 1];
					if( nextSnak && nextSnak.getPropertyId() !== snak.getPropertyId() ) {
						// Snak is the last of its group.
						isGroupLast = true;
					}
				}
			} else {
				// Detect slots between property groups.
				var previousSnak = self._snaks[i - 1],
					isNewPropertyGroup = (
						i !== 0
						&& snakListSnak.getPropertyId() !== previousSnak.getPropertyId()
					);

				if(
					// Since this snak's property group is not at the top of the snak list, the
					// snak (with its group) may always be moved to the top:
					i === 0
					// The snak (with its group) may always be moved to between groups except to
					// adjacent slots between property groups since the snak's property group would
					// in fact not be moved.
					|| isNewPropertyGroup && previousSnak.getPropertyId() !== snak.getPropertyId()
				) {
					indices.push( i );
				}
			}
		} );

		// Allow moving to last position if snak is not at the end already:
		if( snak !== this._snaks[this._snaks.length - 1] ) {
			indices.push( this._snaks.length );
		}

		return indices;
	},

	/**
	 * Moves a snaklist's snak to a new index.
	 *
	 * @param {wikibase.datamodel.Snak} snak Snak to move within the list.
	 * @param {number} toIndex
	 * @return {wikibase.datamodel.SnakList} This SnakList object.
	 *
	 * @throws {Error} if snak is not allowed to be moved to toIndex.
	 */
	move: function( snak, toIndex ) {
		if( this.indexOf( snak ) === toIndex ) {
			return this;
		}

		var validIndices = this.getValidMoveIndices( snak );

		if( $.inArray( toIndex, validIndices ) === -1 ) {
			throw new Error( 'Tried to move snak to index ' + toIndex + ' but only the following '
				+ 'indices are allowed: ' + validIndices.join( ', ' ) );
		}

		var previousSnak = this._snaks[toIndex -1],
			nextSnak = this._snaks[toIndex + 1],
			insertBefore = this._snaks[toIndex];

		if(
			previousSnak && previousSnak.getPropertyId() === snak.getPropertyId()
			|| nextSnak && nextSnak.getPropertyId() === snak.getPropertyId()
		) {
			// Moving snak within its property group.
			this._snaks.splice( this.indexOf( snak ), 1 );

			if( insertBefore ) {
				this._snaks.splice( toIndex, 0, snak );
			} else {
				this._snaks.push( snak );
			}
		} else {
			// Moving the whole snak group.
			var groupedSnaks = [];

			for( var i = 0; i < this._snaks.length; i++ ) {
				if( this._snaks[i].getPropertyId() === snak.getPropertyId() ) {
					groupedSnaks.push( this._snaks[i] );
				}
			}

			for( i = 0; i < groupedSnaks.length; i++ ) {
				this._snaks.splice( this.indexOf( groupedSnaks[i] ), 1 );
				if( insertBefore ) {
					this._snaks.splice( this.indexOf( insertBefore ), 0, groupedSnaks[i] );
				} else {
					this._snaks.push( groupedSnaks[i] );
				}
			}
		}

		return this;
	},

	/**
	 * Moves a snak towards the top of the snak list by one step.
	 *
	 * @param {wikibase.datamodel.Snak} snak
	 * @return {wikibase.datamodel.SnakList} This SnakList object.
	 */
	moveUp: function( snak ) {
		var index = this.indexOf( snak ),
			validIndices = this.getValidMoveIndices( snak );

		for( var i = validIndices.length - 1; i >= 0; i-- ) {
			if( validIndices[i] < index ) {
				this.move( snak, validIndices[i] );
				break;
			}
		}

		return this;
	},

	/**
	 * Moves a snak towards the bottom of the snak list by one step.
	 *
	 * @param {wikibase.datamodel.Snak} snak
	 * @return {wikibase.datamodel.SnakList} This SnakList object.
	 */
	moveDown: function( snak ) {
		var index = this.indexOf( snak ),
			validIndices = this.getValidMoveIndices( snak );

		for( var i = 0; i < validIndices.length; i++ ) {
			if( validIndices[i] > index ) {
				this.move( snak, validIndices[i] );
				break;
			}
		}

		return this;
	},

	/**
	 * Returns all Snaks in this list as an Array of Snaks. Changes to the array will not modify
	 * the original list Object.
	 *
	 * @return wb.datamodel.Snak[]
	 */
	toArray: function() {
		return this._snaks.slice(); // don't reveal internal array!
	}
} );

}( wikibase, jQuery ) );
