export default {
	"title": {
		"type": "plain_text",
		"text": "Channel Picker"
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit"
	},
	"callback_id": "channel_picker_modal",
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


export const ErrorModal = {
	"title": {
		"type": "plain_text",
		"text": "Channel Picker - ERROR"
	},
	"callback_id": "channel_picker_error_modal",
	"blocks": [
		{
			"block_id": "block",
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Sorry I can't access that message. \nThis shortcut only works on messages in public channels."
			}
		}
	],
	"type": "modal"
}