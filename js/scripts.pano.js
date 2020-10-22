var panorama, panorama2, panorama3, viewer, container, infospot;

container = document.querySelector( '#container' );

panorama = new PANOLENS.ImagePanorama( '/asset/Hall.jpg' );
panorama2 = new PANOLENS.ImagePanorama( '/asset/Hall1.jpg' );
panorama3 = new PANOLENS.ImagePanorama( '/asset/Hall2.jpg' );



  // viewer.setPanorama( panorama2 );
// } );

// panorama.add( infospot );

viewer = new PANOLENS.Viewer( {output: 'console', container: container});
viewer.add( panorama, panorama2, panorama3 );

panorama.link( panorama2, new THREE.Vector3( 2600, 200, -1200 ) );
panorama2.link( panorama, new THREE.Vector3( -763.45, 49.53, -4932.50 ) );
panorama2.link( panorama3, new THREE.Vector3( 715.82, 179.27, 4934.89 ) );
panorama3.link( panorama2, new THREE.Vector3( 4861.00, 190.52, -1121.67 ) );

//viewer.addUpdateCallback(function(){
//  
//});




