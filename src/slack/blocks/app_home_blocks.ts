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
            // "accessory": {
            //     "type": "image",
            //     "image_url": "https://docs.team4909.org/images/bionics-docs-logo.png",
            //     "alt_text": "Bionics Docs Logo"
            // }
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
                    // "style": "primary"
                }
            ]
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Trello*\n\n Used to organize hand-off between design to manufacturing.",
                "verbatim": true
            },
            // "accessory": {
            //     "type": "image",
            //     "image_url": "https://docs.team4909.org/images/trello-logo.png",
            //     "alt_text": "plane"
            // }
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Trello Invite ➚",
                        "emoji": true
                    },
                    "url": "https://trello.com/invite/team4909bionics/ATTIfa132292b74632c5cc038925957c228594F5FB12",
                    // "style": "primary"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Manufacturing ➚",
                        "emoji": true
                    },
                    "url": "https://trello.com/b/OGUJmSaG/design-to-manufacturing",
                    // "style": "primary"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Operations ➚",
                        "emoji": true
                    },
                    "url": "https://trello.com/b/kIldmPwM/operations",
                    // "style": "primary"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Robot ➚",
                        "emoji": true
                    },
                    "url": "https://trello.com/b/e2LD6Dta/robot",
                    // "style": "primary"
                }
            ]
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Order Sheet*\n\n We use a lot of parts and tools during the build season. We use the order sheet spreadsheet to track items to order and our order history."
            },
            // "accessory": {
            //     "type": "image",
            //     "image_url": "https://docs.team4909.org/images/google-sheets.png",
            //     "alt_text": "Order Sheet"
            // }
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
                    // "style": "primary"
                }
            ]
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Canva*\n\n Canva is a flexible design tool for print and digital media."
            },
            // "accessory": {
            //     "type": "image",
            //     "image_url": "https://docs.team4909.org/images/canva.png",
            //     "alt_text": "Canva Logo"
            // }
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Canva Team Join ➚",
                        "emoji": true
                    },
                    "url": "https://www.canva.com/brand/join?token=rMSOBEAxDYw0KxI8wLByjQ&brandingVariant=edu&referrer=team-invite",
                    // "style": "primary"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Shared Canva Folder ➚",
                        "emoji": true
                    },
                    "url": "https://www.canva.com/folder/FAFOjWxLvTo",
                    // "style": "primary"
                }
            ]
        },
        {
            "type": "divider"
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Meal Train ➚",
                        "emoji": true
                    },
                    "url": "https://www.mealtrain.com/trains/3m55w",
                    // "style": "primary"
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


