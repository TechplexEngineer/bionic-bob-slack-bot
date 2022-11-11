export interface GetDocumentResponse {
    jsonType: string
    documentThumbnailElementId: string
    isUpgradedToLatestVersion: boolean
    betaCapabilityIds: any[]
    isOrphaned: boolean
    public: boolean
    defaultElementId: string
    recentVersion: any
    hasRelevantInsertables: boolean
    canUnshare: boolean
    userAccountLimitsBreached: boolean
    supportTeamUserAndShared: boolean
    isUsingManagedWorkflow: boolean
    likedByCurrentUser: boolean
    sequence: any
    permission: string
    tags: any[]
    projectId: any
    thumbnail: Thumbnail
    defaultWorkspace: DefaultWorkspace
    parentId: any
    permissionSet: string[]
    notes: any
    notRevisionManaged: boolean
    trash: boolean
    totalWorkspacesUpdating: number
    totalWorkspacesScheduledForUpdate: number
    documentLabels: any[]
    numberOfTimesReferenced: number
    numberOfTimesCopied: number
    likes: number
    documentType: number
    createdWithEducationPlan: boolean
    anonymousAccessAllowed: boolean
    anonymousAllowsExport: boolean
    trashedAt: any
    hasReleaseRevisionableObjects: boolean
    resourceType: string
    isMutable: boolean
    isContainer: boolean
    canMove: boolean
    owner: Owner
    description: any
    modifiedAt: string
    createdAt: string
    createdBy: CreatedBy
    modifiedBy: ModifiedBy
    isEnterpriseOwned: boolean
    id: string
    href: string
    name: string
}

export interface Thumbnail {
    sizes: any[][]
    secondarySizes: any
    id: any
    href: string
}

export interface DefaultWorkspace {
    canDelete: boolean
    isReadOnly: boolean
    overrideDate: any
    lastModifier: LastModifier
    type: string
    description: string
    creator: Creator
    modifiedAt: string
    thumbnail: any
    createdAt: string
    documentId: string
    microversion: string
    parents: any
    parent: string
    id: string
    href: string
    name: string
}

export interface LastModifier {
    state: number
    image: string
    id: string
    href: string
    name: string
}

export interface Creator {
    state: number
    image: string
    id: string
    href: string
    name: string
}

export interface Owner {
    isEnterpriseOwnedResource: boolean
    type: number
    image: string
    id: string
    href: string
    name: string
}

export interface CreatedBy {
    state: number
    image: string
    id: string
    href: string
    name: string
}

export interface ModifiedBy {
    state: number
    image: string
    id: string
    href: string
    name: string
}
