export interface GetBillOfMaterialsOptions {
	bomColumnIds?: string[];
	indented?: boolean;
	multiLevel?: boolean;
	generateIfAbsent?: boolean;
	linkDocumentId?: string;
	configuration?: string;
	templateId?: string;
	includeExcluded?: boolean;
	onlyVisibleColumns?: boolean;
}
