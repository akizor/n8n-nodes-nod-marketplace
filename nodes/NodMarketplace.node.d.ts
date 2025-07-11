import { INodeType, INodeTypeDescription, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
export declare class NodMarketplace implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
