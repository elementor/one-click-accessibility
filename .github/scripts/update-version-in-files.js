'use strict';

const fs = require( "fs" );

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

		// update version in image-optimization.php
		await replaceInFileWithArray( './image-optimization.php',
			[
				{
					from:  /\* Version: (.*)/m,
					to: `* Version: ${ VERSION }`,
				},
				{
					from:  /define\( \'IMAGE_OPTIMIZER_VERSION\', \'(.*)\' \)\;/m,
					to: `define( 'IMAGE_OPTIMIZER_VERSION', '${ VERSION }' );`,
				},
			]
		);

	} catch ( err ) {
		// eslint-disable-next-line no-console
		console.error( 'Error occurred:', err );
		process.exit( 1 );
	}
};

run();
