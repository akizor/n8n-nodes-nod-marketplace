import { INodeType, INodeTypeDescription, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
export declare class NodMarketplace implements INodeType {
    description: INodeTypeDescription;
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
export declare const tools: {
    name: string;
    description: string;
    parameters: {
        name: string;
        type: string;
        description: string;
    }[];
}[];
