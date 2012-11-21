/**
 * QUnit tests for wikibase.Claim
 * @see https://www.mediawiki.org/wiki/Extension:Wikibase
 *
 * @since 0.3
 * @ingroup WikibaseLib
 *
 * @licence GNU GPL v2+
 * @author Jeroen De Dauw < jeroendedauw@gmail.com >
 */

( function( wb, dv, $, QUnit, undefined ) {
	'use strict';

	QUnit.module( 'wikibase.datamodel.snak.js', QUnit.newMwEnvironment() );

	QUnit.test( 'constructor', function( assert ) {
		var snakInfo = [
			[ wb.PropertyNoValueSnak ],
			[ wb.PropertySomeValueSnak ],
			[ wb.PropertyValueSnak, [ 21, new dv.StringValue( 'test' ) ] ]
		];

		$.each( snakInfo, function( i, info ) {
			var snakConstructor = info[0],
				snakParams = info[1] || [ 42 ];

			var snak = new snakConstructor( snakParams[0], snakParams[1] );

			assert.strictEqual(
				snak.getPropertyId(),
				snakParams[ 0 ],
				'Property id was set correctly'
			);

			assert.strictEqual(
				snak.TYPE,
				snakConstructor.prototype.TYPE,
				'Snak type was set correctly'
			);
		} );

	} );

}( wikibase, dataValues, jQuery, QUnit ) );
