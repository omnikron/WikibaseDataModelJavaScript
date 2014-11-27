( function( wb ) {
'use strict';

var PARENT = wb.datamodel.Group;

/**
 * List of Statement objects, constrained to a single property id.
 * @class wikibase.datamodel.StatementGroup
 * @extends wikibase.datamodel.Group
 * @since 1.0
 * @licence GNU GPL v2+
 * @author H. Snater < mediawiki@snater.com >
 *
 * @constructor
 *
 * @param {wikibase.datamodel.StatementList} [statementList]
 */
wb.datamodel.StatementGroup = util.inherit(
	'WbDataModelStatementGroup',
	PARENT,
	function( propertyId, statementList ) {
		PARENT.call( this, propertyId, wb.datamodel.StatementList, 'getPropertyIds', statementList );
	}
);

}( wikibase ) );
