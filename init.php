<?php

define( 'WIKIBASE_DATAMODEL_JAVASCRIPT_VERSION', '1.0.2-dev' );

if ( defined( 'MEDIAWIKI' ) ) {
	call_user_func( function() {
		require_once __DIR__ . '/init.mw.php';
	} );
}
