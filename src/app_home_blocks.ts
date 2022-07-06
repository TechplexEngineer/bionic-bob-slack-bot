
const blocks = [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Team Quick Links v4",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Bionics Docs*\n\n Bionics docs is team team's core documentation site with information about our tools and processes."
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Open Bionics Docs",
					"emoji": true
				},
				"value": "click_me_123",
				"url": "https://docs.team4909.org/home/",
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Order Sheet*\n\n We use a lot of parts and tools during the build season. We use this spreadsheet to track items to order and our order history."
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Open Order Sheet",
					"emoji": true
				},
				"value": "open_order_sheet",
				"url": "https://docs.google.com/spreadsheets/d/1BGMXljo7L7N766PpeVszUuOC9rf_mTWG5kIJSzcwGbo/edit#gid=1432125071",
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Build Calendar*\n\n Student team leads work to keep this calendar up to date with weekly plans and accomplishments."
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Open Build Calendar",
					"emoji": true
				},
				"value": "open_build_calendar",
				"url": "https://docs.google.com/spreadsheets/d/1bPFVPb-jnDz4s6Q-JSQdgSMTSXSyvz-zeSsYXMhwa-Q/edit#gid=0",
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Monday.com*\n\n Used to organize and plan team work."
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Open monday.com",
					"emoji": true
				},
				"value": "open_build_calendar",
				"url": "https://team4909.monday.com/",
			}
		}
	
	
	];
export default {
    type: 'home',
    title: {
    	type: 'plain_text',
    	text: 'Team Quick Links'
    },
    blocks: blocks
};


