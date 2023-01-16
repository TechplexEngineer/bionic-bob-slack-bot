const blocks = [
    {
        "type": "header",
        "text": {
            "type": "plain_text",
            "text": "Team Quick Links",
            "emoji": true
        }
    },
    {
        "type": "divider"
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Bionics Docs*\n\n Bionics docs is team team's core documentation site with information about our tools and processes."
        },
        "accessory": {
            "type": "image",
            "image_url": "https://docs.team4909.org/images/bionics-docs-logo.png",
            "alt_text": "Bionics Docs Logo"
        }
    },
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Open Bionics Docs ➚",
                    "emoji": true
                },
                "url": "https://docs.team4909.org/home/",
                "style": "primary"
            }
        ]
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Order Sheet*\n\n We use a lot of parts and tools during the build season. We use this spreadsheet to track items to order and our order history."
        },
        "accessory": {
            "type": "image",
            "image_url": "https://docs.team4909.org/images/google-sheets.png",
            "alt_text": "Order Sheet"
        }
    },
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Open Order Sheet ➚",
                    "emoji": true
                },
                "url": "https://docs.google.com/spreadsheets/d/1BGMXljo7L7N766PpeVszUuOC9rf_mTWG5kIJSzcwGbo/edit#gid=1432125071",
                "style": "primary"
            }
        ]
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Build Calendar*\n\n Student team leads work to keep this calendar up to date with weekly plans and accomplishments."
        },
        "accessory": {
            "type": "image",
            "image_url": "https://docs.team4909.org/images/calendar-icon.png",
            "alt_text": "Build Calendar"
        }
    },
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Open Build Calendar ➚",
                    "emoji": true
                },
                "url": "https://team4909.org/calendar",
                "style": "primary"
            }
        ]
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Monday.com*\n\n Used to organize and plan team work.",
            "verbatim": true
        },
        "accessory": {
            "type": "image",
            "image_url": "https://docs.team4909.org/images/monday-logo.png",
            "alt_text": "plane"
        }
    },
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Open Monday.com ➚",
                    "emoji": true
                },
                "url": "https://team4909.monday.com/",
                "style": "primary"
            }
        ]
    },
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Trell*\n\n Used to organize hand-off between design to manufacturing.",
            "verbatim": true
        },
        "accessory": {
            "type": "image",
            "image_url": "https://docs.team4909.org/images/trello-logo.png",
            "alt_text": "plane"
        }
    },
    {
        "type": "actions",
        "elements": [
            {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Open Trello ➚",
                    "emoji": true
                },
                "url": "https://trello.com/invite/team4909bionics/ATTIfa132292b74632c5cc038925957c228594F5FB12",
                "style": "primary"
            }
        ]
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


