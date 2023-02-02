export type BTListResponseBTWebhookInfo = {
    previous: any
    next: any
    href: string
    items: Array<BTWebhookInfo>
}

export interface BTWebhookInfo {
    name: any
    description: any
    filter: any
    data: any
    companyId: any
    url: string
    createdBy: BTUserSummaryInfo
    options: BTWebhookOptions
    projectId: any
    folderId: any
    events: Array<string>
    droppedEventCount: number
    id: string
    href: string
}

export interface BTWebhookOptions {
    collapseEvents: boolean
}

export interface BTUserSummaryInfo {
    source: number
    personalMessageAllowed: boolean
    isLight: boolean
    isGuest: boolean
    company: any
    globalPermissions: any
    lastLoginTime: string
    documentationNameOverride: any
    firstName: string
    lastName: string
    email: string
    documentationName: any
    state: number
    image: string
    name: string
    id: string
    href: string
}