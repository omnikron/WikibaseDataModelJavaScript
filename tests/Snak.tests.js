/**
 * @licence GNU GPL v2+
 * @author Jeroen De Dauw < jeroendedauw@gmail.com >
 * @author Daniel Werner < daniel.werner@wikimedia.de >
 */

( function( wb, dv, $, QUnit, undefined ) {
	'use strict';

	QUnit.module( 'wikibase.datamodel.snak.js', QUnit.newMwEnvironment() );

	QUnit.test( 'wb.datamodel.Snak.prototype, its constructor and wb.datamodel.Snak static functions', function( assert ) {
		var snakInfo = [
			[ wb.datamodel.PropertyNoValueSnak ],
			[ wb.datamodel.PropertySomeValueSnak ],
			[ wb.datamodel.PropertyValueSnak, [ '21', new dv.StringValue( 'test' ) ] ]
		];
		var unequalSnak = new wb.datamodel.PropertyValueSnak( '21', new dv.StringValue( 'not equal!' ) );

		/**
		 * Does test functions of the Snak prototype which turn the Snak into an Object representing
		 * the Snak.
		 *
		 * @param {wb.datamodel.Snak} snak
		 * @param {String} methodLabel Objectification method name used in test messages
		 * @param {String} toObjectFnName name of a function in wb.datamodel.Snak.prototype
		 * @param {String} fromObjectFnName name of a function in wb.datamodel.Snak
		 */
		var snakToObjectTest = function( snak, methodLabel, toObjectFnName, fromObjectFnName ) {
			var objectifiedSnak = snak[ toObjectFnName ]();

			assert.ok(
				$.isPlainObject( objectifiedSnak ),
				toObjectFnName + '() will return a plain object'
			);

			assert.ok(
				objectifiedSnak.snaktype === snak.getType(),
				"In the " + methodLabel + ", the 'snaktype' field is set correctly"
			);

			var deobjectifiedSnak = wb.datamodel.Snak[ fromObjectFnName ]( objectifiedSnak );

			assert.ok(
				deobjectifiedSnak instanceof wb.datamodel.Snak,
				'Constructing new Snak from ' + methodLabel + ' via wb.datamodel.Snak.' + fromObjectFnName
					+ '() successful'
			);

			assert.ok(
				deobjectifiedSnak.equals( snak ) && snak.equals( deobjectifiedSnak ),
				'Newly constructed Snak from json is equal to original Snak'
			);
		};

		$.each( snakInfo, function( i, info ) {
			var snakConstructor = info[0],
				snakParams = info[1] || [ '42' ],
				snak = new snakConstructor( snakParams[0], snakParams[1] );

			assert.ok(
				snak instanceof wb.datamodel.Snak,
				'New snak is an instance of wikibase.Snak'
			);

			assert.ok(
				snak.equals( snak ),
				'Snak is equal to itself'
			);

			assert.ok(
				!snak.equals( unequalSnak ) && !unequalSnak.equals( snak ),
				'Snak is not equal to some other random Snak'
			);

			assert.strictEqual(
				snak.getPropertyId(),
				snakParams[ 0 ],
				'Property id was set correctly'
			);

			assert.strictEqual(
				snak.getType(),
				snakConstructor.TYPE,
				'Snak type "' + snak.getType() + '" was set correctly'
			);

			snakToObjectTest( snak, 'JSON', 'toJSON', 'newFromJSON' );
			snakToObjectTest( snak, 'Map', 'toMap', 'newFromMap' );
		} );

	} );

}( wikibase, dataValues, jQuery, QUnit ) );
