/**
 * GeneXus SDK
 *
 * SDK para desarrolladores de patterns GeneXus.
 * Provee acceso al modelo de la Knowledge Base y utilidades para navegación de instancias de pattern.
 *
 * @packageDocumentation
 */
export { GXObjectType, GXObjectCategory, getObjectCategory } from './types/GXObjectType';
export { Platform, PlatformInfo, PLATFORM_INFO, isWebPlatform, isMobilePlatform, getSpecificPlatforms } from './types/Platform';
export { eDBType } from './types/DataTypes';
export { KBObject, KBObjectWithProperties, KBObjectWithAttributes, KBAttribute, KBVariable, createKBObject } from './model/KBObject';
export { KBModel, KBModelProvider, SearchOptions, SearchResult } from './model/KBModel';
export { Transaction, TransactionLevel, createTransaction, isTransaction } from './objects/Transaction';
export { SDT, SDTField, createSDT, isSDT, flattenSDTFields } from './objects/SDT';
export { Theme, ThemeClass, createTheme, isTheme, getThemeClasses } from './objects/Theme';
export { Domain, DomainEnumValue, createDomain, isDomain, isDomainEnum } from './objects/Domain';
export { MasterPage, createMasterPage, isMasterPage } from './objects/MasterPage';
export { PatternXmlNode, PatternInstanceElement, PatternInstance, formatCaption } from './patterns/PatternInstanceElement';
export { ElementTypeDefinition, AttributeDefinition, ChildElementDefinition, PatternDefinition } from './patterns/PatternDefinition';
export { PatternExtensionAPI, IPatternCustomTypeSupport, IPatternCustomTypeEditor, CustomTypeContext, CustomTypeValue, IPatternEditorHelper, CustomShowElementResult, EditorHelperContext, PatternEditorCommand, CommandState, CommandStatus, IPatternEditorCommand, CommandExecutionContext, PatternEditorCommandBase, ResolvedCustomType, IPatternVariableProvider, VariableProviderContext, VariableInfo, KBObjectCache, KBObjectInfo } from './patterns/PatternExtensionAPI';
//# sourceMappingURL=index.d.ts.map