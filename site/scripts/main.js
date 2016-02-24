/**
 * Main JavaScript
 * Site Name
 *
 * Copyright (c) 2015. by Way2CU, http://way2cu.com
 * Authors:
 */

// create or use existing site scope
var Site = Site || {};

// make sure variable cache exists
Site.variable_cache = Site.variable_cache || {};


/**
 * Check if site is being displayed on mobile.
 * @return boolean
 */
Site.is_mobile = function() {
	var result = false;

	// check for cached value
	if ('mobile_version' in Site.variable_cache) {
		result = Site.variable_cache['mobile_version'];

	} else {
		// detect if site is mobile
		var elements = document.getElementsByName('viewport');

		// check all tags and find `meta`
		for (var i=0, count=elements.length; i<count; i++) {
			var tag = elements[i];

			if (tag.tagName == 'META') {
				result = true;
				break;
			}
		}

		// cache value so next time we are faster
		Site.variable_cache['mobile_version'] = result;
	}

	return result;
};

/**
 * Retrieve direct video URL from specified video id. Upon retrieving data
 * specified callback function will be called with exactly one object parameter
 * containing `url`, `width` and `height` of the video in question.
 *
 * @param string video_id         Unique video id;
 * @param function callback       Function to be called after video data has been obtained;
 * @param integer prefered_height Prefered video height, default 720p.
 */
Site.get_vimeo_video_url = function(video_id, callback, prefered_height) {
	var url = '//player.vimeo.com/video/{video_id}/config'.replace('{video_id}', video_id);
	var height = prefered_height || 720;

	var request = {
			async: true,
			cache: true,
			dataType: 'json',
			success: function(data) {
				// make sure we got the right data out
				if (!('request' in data))
					return;

				// find requested height
				var previous_height = 0;
				var result = null;
				for (var index in data.request.files.progressive) {
					var video = data.request.files.progressive[index];
					if (previous_height > video.height && video.height <= height) {
						result = {
								url: video.url,
								width: video.width,
								height: video.height
							};
						previous_height = video.height;
					}
				}

				// call function after we've found the right url
				if (result !== null)
					callback(result);
			}
		};

	$.ajax(url, request);
};

/**
 * Function called when document and images have been completely loaded.
 */
Site.on_load = function() {

	Caracal.lightbox = new LightBox('a.image.direct', false, false, true);

	// Function for showing Dialog Box

	var link = $('div.branch h3 a');
	var link1 = $('div.products h3 a');
	var btnClose = $('div.dialog_box a.close');
	var dialog = $('div.dialog_box');

	btnClose.on('click' , function(){
		dialog.css('visibility','hidden')
			  .css('opacity','0');
	});

	link.on('click' , function(){
		dialog.css('visibility','visible')
			  .css('opacity','1');
	});

	link1.on('click' , function(){
		dialog.css('visibility','visible')
			  .css('opacity','1');
	});
	
	// handle analytics event
	$('form').on('analytics-event', function(event, data) {
		if (!data.error)
			dataLayer.push({
            	'event':'leadSent'
            });
	});
};


// connect document `load` event with handler function
$(Site.on_load);
