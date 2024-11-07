'use strict';

const fs = require( "fs" );
const MAIN_FILE_NAME = 'pojo-accessibility.php';
const VERSION_CONSTANT = 'EA11Y_VERSION';

const { VERSION } = process.env;
 if ( ! VERSION ) {
	throw new Error( 'VERSION is not defined in the environment variables.' );
}

async function replaceInFileWithArray( filePath, replacementArray ) {
	try {
		let content = fs.readFileSync( filePath, { encoding: 'utf8' } );

		for ( const replacement of replacementArray ) {
			console.log( `Replacing ${ replacement.from } with ${ replacement.to } in ${ filePath }` );
			content = content.replace( replacement.from, replacement.to );
		}
		console.log( content );
		//fs.writeFileSync( filePath, content, { encoding: 'utf8' } );
		console.log( `All replacements in ${ filePath } were successful.`);
	} catch (error) {
		console.error( `An error occurred in ${ filePath }:`, error );
	}
}

const run = async () => {
	try {
		// update stable tag in readme.txt
		await replaceInFileWithArray( './readme.txt',
			[
				{
					from:  /Stable tag: (.*)/m,
					to: `Stable tag: ${ VERSION }`,
				},
				{
					from:  /= NEXT_VERSION =/m,
					to: `= ${ VERSION } =`,
				},
			]
		);

		// update version in MAIN_FILE_NAME
		await replaceInFileWithArray( `./${MAIN_FILE_NAME}`,
			[
				{
					from:  /\* Version: (.*)/m,
					to: `* Version: ${ VERSION }`,
				},
				{
					from:  new RegExp(`define\\( '${VERSION_CONSTANT}', '(.*)' \\);`, 'm' ),
					to: `define( '${VERSION_CONSTANT}', '${VERSION}' );`,
				}
			]
		);

	} catch ( err ) {
		// eslint-disable-next-line no-console
		console.error( 'Error occurred:', err );
		process.exit( 1 );
	}
};

run();
