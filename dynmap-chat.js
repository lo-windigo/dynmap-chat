/*

DynMap Chat Importer
===

Displays server chat pulled from the DynMap plugin
---

by Windigo < http://micro.fragdev.com/windigo/ >

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



// Encapsulate the code for Drupal
(function($)
{
	var DynMapChat = {

		// ID of page element to be replaced
		chatBox : '#block-block-2 .content',

		// Cache of messages
		chatCache : [],

		// Length of message cache before trim
		chatCacheLength : 15,

		// URL of JSON feed from DynMap plugin
		chatFeed : 'http://public.tekkitcrunch.com/map/standalone/dynmap_public.json',

		// Interval, in seconds, to udpate the chat box
		updateInterval : 5,


		// Initialization function
		Init : function()
		{
			//$('#'+DynMapChat.chatBox+' h2').text('Dynamic Chat');

			DynMapChat.UpdateChatBox();
		},


		// Update Chat box with new values
		UpdateChatBox : function()
		{
			var chatContents = $('<ul></ul>');

			// Pull new chat messages from the JSON feed
			$.getJSON(DynMapChat.chatFeed, function(data)
			{
				// Add messages to the cache
				$(data.updates).each(function(i, item)
				{
					if(item.type == 'chat')
					{
						var match = $(DynMapChat.chatCache)
						.filter(function(j)
						{
							return (this.timestamp == item.timestamp &&
							 this.playerName == item.playerName &&
							 this.message == item.message);
						})
						.length;

						if(match < 1)
						{
							DynMapChat.chatCache.push(item);
						}
					}
				});

				// Sort cache by timestamp, descending
				DynMapChat.chatCache.sort(function(a, b)
				{
					if(a.timestamp == b.timestamp)
					{
						return 0;
					}
					else if(a.timestamp < b.timestamp)
					{
						return 1;
					}

					return -1;
				});

				// Trim cache of older values
				if(DynMapChat.chatCache.length > DynMapChat.chatCacheLength)
				{
					DynMapChat.chatCache = DynMapChat.chatCache.slice(0,
						DynMapChat.chatCacheLength - 1);
				}


				// Covert cache to HTML elements
				$(DynMapChat.chatCache).each(function(i, item)
				{
					chatContents.append('<li><strong>'+item.playerName
						+'</strong>: '+item.message+'</li>');
				});

				// Replace older contents with latest
				$(DynMapChat.chatBox)
				.empty()
				.append(chatContents);
			});

			// Refresh chat box on a defined interval
			window.setTimeout(function()
			{
				DynMapChat.UpdateChatBox();
			}, DynMapChat.updateInterval * 1000);
		}
	};


	// Initialize the DynMap Chat Display
	DynMapChat.Init();

})(jQuery);
