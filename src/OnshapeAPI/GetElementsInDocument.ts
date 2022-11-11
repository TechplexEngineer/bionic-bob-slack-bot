export type GetElementsInDocumentOptional = {
    elementType?: string,
    elementId?: string,
    withThumbnails?: boolean,
    linkDocumentId?: string
};

export type GetElementsInDocumentResponse = Element[]

export interface Element {
    lengthUnits: string
    angleUnits: string
    massUnits: string
    timeUnits: string
    forceUnits: string
    pressureUnits: string
    momentUnits: string
    accelerationUnits: string
    angularVelocityUnits: string
    energyUnits: string
    areaUnits: string
    volumeUnits: string
    type: string
    elementType: string
    filename: any
    id: string
    dataType: string
    thumbnailInfo: any
    thumbnails: any
    microversionId: string
    foreignDataId: any
    unupdatable: boolean
    specifiedUnit: any
    name: string
}
