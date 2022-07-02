import { getChannel } from "@/routes/slash_event-channel";

const channels = {
    "ok": true,
    "channels": [
        {
            "id": "C091KSAKY",
            "name": "general",
            "is_channel": true,
            "is_group": false,
            "is_im": false,
            "is_mpim": false,
            "is_private": false,
            "created": 1439435600,
            "is_archived": false,
            "is_general": true,
            "unlinked": 0,
            "name_normalized": "general",
            "is_shared": false,
            "is_org_shared": false,
            "is_pending_ext_shared": false,
            "pending_shared": [
            ],
            "context_team_id": "T091KQ231",
            "parent_conversation": null,
            "creator": "U091KHP3J",
            "is_ext_shared": false,
            "shared_team_ids": [
                "T091KQ231"
            ],
            "pending_connected_team_ids": [
            ],
            "is_member": true,
            "topic": {
                "value": "Vital Team Communication",
                "creator": "U091KHP3J",
                "last_set": 1439436141
            },
            "purpose": {
                "value": "This channel is for important information regarding the team. All team members are in this channel.",
                "creator": "U091KHP3J",
                "last_set": 1439436173
            },
            "previous_names": [
            ],
            "num_members": 89
        },
        {
            "id": "C03JB59PUER",
            "name": "2022-summer-heat",
            "is_channel": true,
            "is_group": false,
            "is_im": false,
            "is_mpim": false,
            "is_private": false,
            "created": 1654517980,
            "is_archived": true,
            "is_general": false,
            "unlinked": 0,
            "name_normalized": "2022-summer-heat",
            "is_shared": false,
            "is_org_shared": false,
            "is_pending_ext_shared": false,
            "pending_shared": [
            ],
            "context_team_id": "T091KQ231",
            "parent_conversation": null,
            "creator": "U0C57J0D9",
            "is_ext_shared": false,
            "shared_team_ids": [
                "T091KQ231"
            ],
            "pending_connected_team_ids": [
            ],
            "is_member": false,
            "topic": {
                "value": "",
                "creator": "",
                "last_set": 0
            },
            "purpose": {
                "value": "June 25th at Falmouth High School",
                "creator": "U0C57J0D9",
                "last_set": 1654517980
            },
            "previous_names": [
            ],
            "num_members": 0
        }
    ],
    "response_metadata": {
        "next_cursor": ""
    }
};



test("filter channels", () => {
    expect(getChannel(channels.channels, "2022-summer-heat")[0].id).toEqual("C03JB59PUER");
});