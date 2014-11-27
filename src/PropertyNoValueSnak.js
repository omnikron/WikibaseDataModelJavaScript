( function( wb, util ) {
'use strict';

var PARENT = wb.datamodel.Snak;

/**
 * Snak explicitly occupying no value.
 * @class wikibase.datamodel.PropertyNoValueSnak
 * @extends wikibase.datamodel.Snak
 * @since 0.3
 * @licence GNU GPL v2+
 * @author Daniel Werner < daniel.werner@wikimedia.de >
 *
 * @constructor
 *
 * @param {string} propertyId
 */
var SELF
	= wb.datamodel.PropertyNoValueSnak
	= util.inherit( 'WbDataModelPropertyNoValueSnak', PARENT, {} );

/**
 * @inheritdoc
 * @type {string}
 * @static
 */
SELF.TYPE = 'novalue';

}( wikibase, util ) );
