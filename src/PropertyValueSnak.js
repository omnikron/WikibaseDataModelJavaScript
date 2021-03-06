( function( wb, dv, util ) {
'use strict';

var PARENT = wb.datamodel.Snak;

/**
 * Snak occupying a specific value.
 * @class wikibase.datamodel.PropertyValueSnak
 * @extends wikibase.datamodel.Snak
 * @since 0.3
 * @licence GNU GPL v2+
 * @author Daniel Werner
 *
 * @constructor
 *
 * @param {string} propertyId
 * @param {dataValues.DataValue} value
 *
 * @throws {Error} value is not a dataValues.DataValue instance.
 */
var SELF = wb.datamodel.PropertyValueSnak = util.inherit(
	'WbDataModelPropertyValueSnak',
	PARENT,
	function( propertyId, value ) {
		if( !( value instanceof dv.DataValue ) ) {
			throw new Error( 'The value has to be an instance of dataValues.DataValue' );
		}
		PARENT.call( this, propertyId );
		this._value = value;
	},
{
	/**
	 * @property {dataValues.DataValue}
	 * @private
	 */
	_value: null,

	/**
	 * Returns the Snak object's value in form of a DataValue object.
	 *
	 * @return {dataValues.DataValue}
	 */
	getValue: function() {
		return this._value;
	},

	/**
	 * @inheritdoc
	 */
	equals: function( snak ) {
		return PARENT.prototype.equals.call( this, snak ) && this._value.equals( snak.getValue() );
	}
} );

/**
 * @inheritdoc
 * @property {string} [TYPE='value']
 * @static
 */
SELF.TYPE = 'value';

}( wikibase, dataValues, util ) );
