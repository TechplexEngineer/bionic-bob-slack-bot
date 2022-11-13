export type BTListResponseBTWebhookInfo = {
    previous: any
    next: any
    href: string
    items: Array<BTWebhookInfo>
}

export interface BTWebhookInfo {
    filter: any
    data: any
    description: any
    companyId: any
    url: string
    createdBy: BTUserSummaryInfo
    options: BTWebhookOptions
    projectId: any
    folderId: any
    events: Array<string>
    droppedEventCount: number
    name: any
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