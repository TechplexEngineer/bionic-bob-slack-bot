export enum BTTranslationRequestInfo_State {
	ACTIVE = 'ACTIVE',
	DONE = 'DONE',
	FAILED = 'FAILED'
}

// response
export interface BTTranslationRequestInfo {
	documentId?: string;
	failureReason?: string;
	href?: string; //uri
	id?: string;
	name?: string;
	requestElementId?: string;
	requestState?: BTTranslationRequestInfo_State;
	resultDocumentId?: string;
	resultElementIds?: string[];
	resultExternalDataIds?: string[];
	resultWorkspaceId?: string;
	versionId?: string;
	viewRef?: string; //uri
	workspaceId?: string;
}

//request
export interface BTTranslateFormatParams {
	allowFaultyParts?: boolean;
	angularTolerance?: number; //double
	blobElementId?: string;
	blobMicroversionId?: string;
	cloudObjectId?: string;
	cloudStorageAccountId?: string;
	colorMethod?: string;
	configuration?: string;
	connectionId?: string;
	createComposite?: boolean;
	currentSheetOnly?: boolean;
	destinationName?: string;
	distanceTolerance?: number; //double
	elementId?: string;
	elementIds?: string[];
	emailLink?: boolean;
	emailMessage?: string;
	emailSubject?: string;
	emailTo?: string[];
	extractAssemblyHierarchy?: boolean;
	flatten?: boolean;
	flattenAssemblies?: boolean;
	foreignId?: string;
	formatName?: string;
	fromUserId?: string;
	getyAxisIsUp?: boolean;
	grouping?: boolean;
	imageHeight?: number; //int32
	imageWidth?: number; //int32
	importInBackground?: boolean;
	importWithinDocument?: boolean;
	includeExportIds?: boolean;
	joinAdjacentSurfaces?: boolean;
	level?: string;
	linkDocumentId?: string;
	linkDocumentWorkspaceId?: string;
	maximumChordLength?: number; //double
	notifyUser?: boolean;
	onePartPerDoc?: boolean;
	originalForeignId?: string;
	parentId?: string;
	partIds?: string;
	password?: string;
	passwordRequired?: boolean;
	processedForeignId?: string;
	projectId?: string;
	selectablePdfText?: boolean;
	sendCopyToMe?: boolean;
	sheetIndices?: number[]; //int32
	showOverriddenDimensions?: boolean;
	sourceName?: string;
	specifyUnits?: boolean;
	splinesAsPolylines?: boolean;
	splitAssembliesIntoMultipleDocuments?: boolean;
	stepVersionString?: string;
	storeInDocument?: boolean;
	textAsGeometry?: boolean;
	triggerAutoDownload?: boolean;
	unit?: string;
	uploadId?: string;
	validForDays?: number; //int32
	versionString?: string;
}
