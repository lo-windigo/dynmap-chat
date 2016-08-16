/*

DynMap Chat Importer
===

Displays server chat pulled from the DynMap plugin
---

by Windigo < https://fragdev.com/ >

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with this program.  If not, see
<http://www.gnu.org/licenses/>.

*/

(function($) {

	var cache, chatBox, feed, settings;

	// Public interface: saves settings, and kicks off periodic fetches/updates
	$.fn.dmChat = function(feed, options) {

		// If we haven't been given a feed, bail!
		if(!feed) {
			console.log("dmChat(): No feed specified!");
			return this;
		}

		feed = feed+"up/world/world/";

		// Set up our chat cache & display box
		cache = [];
		chatBox = $('<ul class="dm-chat"></ul>');

		// Get the users' options & override the defaults
		settings = $.extend({
			cacheLength: 15,
			updateInterval: 5
		}, options);

		this.empty().append(chatBox);

		// Refresh chat box on a defined interval
		setInterval(function(feed) {
	

		console.log("dmChat(): Polling JSON feed at "+feed+".");

		// Pull new chat messages from the JSON feed
		$.getJSON(feed,
			function(data) {

				console.log("dmChat(): JSON data retrieved. Processing...");

				// Add messages to the cache
				$(data.updates).each(function(i, item) {

					if(item.type == 'chat') {

						// Check for duplicates
						var match = $(cache)
						.filter(function(j) {

							return (this.timestamp == item.timestamp &&
							 this.playerName == item.playerName &&
							 this.message == item.message);

						}).length;

						// If we don't have this item in the cache, add it
						if(match < 1) {

							cache.push(item);
						}
					}
				});

				// Sort cache by timestamp, descending
				cache.sort(function(a, b) {

					if(a.timestamp > b.timestamp)
						return -1;

					if(a.timestamp < b.timestamp)
						return 1;

					return 0;
				});

				// Trim cache of older values
				if(cache.length > settings.cacheLength) {

					cache = cache.slice(0, settings.cacheLength - 1);
				}

				chatBox.empty();

				// Covert cache to HTML elements
				$(cache).each(function(i, item) {
				
					chatBox.append('<li class="dm-message"><strong class="dm-player">'+
						item.playerName+'</strong>: '+item.message+'</li>');
				});
			});

		}, settings.updateInterval * 1000, feed);

		return this;
	};

})(jQuery);
