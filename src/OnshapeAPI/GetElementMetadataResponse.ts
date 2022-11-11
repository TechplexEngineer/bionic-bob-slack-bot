export interface GetElementMetadataResponse {
    jsonType: string
    elementType: number
    mimeType: string
    elementId: string
    properties: Property[]
    // thumbnail: Thumbnail
    href: string
}

export interface Property {
    computedProperty: boolean
    computedPropertyError: string
    defaultValue: DefaultValue
    dirty: boolean
    editable: boolean
    editableInUi: boolean
    enumValues: EnumValue[]
    initialValue: InitialValue
    multivalued: boolean
    name: string
    propertyId: string
    propertySource: number
    required: boolean
    schemaId: string
    uiHints: UiHints
    validator: Validator
    value: Value
    valueType: string
}

export interface DefaultValue {
}

export interface EnumValue {
    label: string
    state: number
    value: string
}

export interface InitialValue {
}

export interface UiHints {
    multiline: boolean
}

export interface Validator {
    max: number
    maxCount: number
    maxDate: string
    maxLength: number
    min: number
    minCount: number
    minDate: string
    minLength: number
    pattern: string
    quantityType: number
}

export interface Value {
}

export interface Thumbnail {
    href: string
    id: string
    secondarySizes: SecondarySize[][]
    sizes: Size[]
}

export interface SecondarySize {
    href: string
    mediaType: string
    renderMode: string
    sheetName: string
    size: string
    uniqueId: string
    viewOrientation: string
}

export interface Size {
    href: string
    mediaType: string
    renderMode: string
    sheetName: string
    size: string
    uniqueId: string
    viewOrientation: string
}


const example = {
    "href": "string",
    "jsonType": "string",
    "properties": [
        {
            "computedProperty": true,
            "computedPropertyError": "string",
            "defaultValue": {},
            "dirty": true,
            "editable": true,
            "editableInUi": true,
            "enumValues": [
                {
                    "label": "string",
                    "state": 0,
                    "value": "string"
                }
            ],
            "initialValue": {},
            "multivalued": true,
            "name": "string",
            "propertyId": "string",
            "propertySource": 0,
            "required": true,
            "schemaId": "string",
            "uiHints": {
                "multiline": true
            },
            "validator": {
                "max": 0,
                "maxCount": 0,
                "maxDate": "2022-11-11T16:49:36.192Z",
                "maxLength": 0,
                "min": 0,
                "minCount": 0,
                "minDate": "2022-11-11T16:49:36.192Z",
                "minLength": 0,
                "pattern": "string",
                "quantityType": 0
            },
            "value": {},
            "valueType": "string"
        }
    ],
    "thumbnail": {
        "href": "string",
        "id": "string",
        "secondarySizes": [
            [
                {
                    "href": "string",
                    "mediaType": "string",
                    "renderMode": "string",
                    "sheetName": "string",
                    "size": "string",
                    "uniqueId": "string",
                    "viewOrientation": "string"
                }
            ]
        ],
        "sizes": [
            {
                "href": "string",
                "mediaType": "string",
                "renderMode": "string",
                "sheetName": "string",
                "size": "string",
                "uniqueId": "string",
                "viewOrientation": "string"
            }
        ]
    }
}