export default {
	"title": {
		"type": "plain_text",
		"text": "Channel Picker"
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit"
	},
	"blocks": [
		{
			"block_id": "block",
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Which channel(s) should the users be added to?"
			},
			"accessory": {
				"type": "multi_conversations_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select channel",
					"emoji": true
				},
				"action_id": "selected_channels",
				"filter": {
					"include": [
						"public"
					]
				}
			}
		}
	],
	"type": "modal"
};
