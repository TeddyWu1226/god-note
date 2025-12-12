import {useStorage} from "@vueuse/core";
import {operationStatusEnum} from "@/enums/enums";

interface OperationStorageType {
	current: operationStatusEnum
}

export const Operation = useStorage<OperationStorageType>('operation',
	{
		current: operationStatusEnum.Default
	}
)