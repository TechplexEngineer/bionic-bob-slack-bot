export interface GetBillOfMaterialsResponse {
	bomTable: BomTable;
}

export interface BomTable {
	formatVersion: string;
	id: string;
	name: string;
	type: string;
	createdAt: string;
	templateId: string;
	bomSource: BomSource;
	headers: Header[];
	items: Item[];
}

export interface BomSource {
	document: Document;
	workspace: Workspace;
	element: Element;
	href: string;
	viewHref: string;
	configuration: string;
}

export interface Document {
	id: string;
	name: string;
}

export interface Workspace {
	id: string;
	name: string;
}

export interface Element {
	id: string;
	type: string;
	name: string;
	state: string;
}

export interface Header {
	name: string; // human readable name like "Part Number"
	propertyName: string; //camel case name like "partNumber"
	visible: boolean;
	propertyId: string; //typical OnshapeAPI id hex string, 24chars
}

export interface Item {
	itemSource: ItemSource;
	title2: string;
	title3: string;
	name: string;
	excludeFromBom: boolean;
	description: string;
	appearance: Appearance;
	notRevisionManaged: boolean;
	partNumber: string;
	item: string;
	material: Material;
	'57f3fb8efa3416c06701d626': string;
	title1: string;
	'5ace8269c046ad612c65a0bb': string;
	project: string;
	quantity: number;
	productLine: string;
	state: string;
	bomBehavior: string;
	vendor: string;
	'57f3fb8efa3416c06701d623': string;
	revision: string;
}

export interface ItemSource {
	viewHref: string;
	fullConfiguration: string;
	configuration: string;
	elementId: string;
	documentId: string;
	partId: string;
	wvmType: string;
	wvmId: string;
	isStandardContent: boolean;
	relatedOccurrences: string[];
	indentLevel: number;
}

export interface Appearance {
	color: Color;
	opacity: number;
	isGenerated: boolean;
}

export interface Color {
	red: number;
	green: number;
	blue: number;
}

export interface Material {
	libraryName: string;
	displayName: string;
	id: string;
	properties: any[];
}
