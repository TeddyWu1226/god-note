import {useStorage} from "@vueuse/core";
import {CharEnum} from "../enums/char-enum";


interface UnitType {
	hp: number; // 當前生命值
	hpLimit: number; //生命上限
	sp: number; // 當前法力值
	spLimit: number; // 法力上限
	level: number; //等級
	char: string; // 職業
}

export const CharInfo = useStorage<UnitType>('char-info',
	{
		hp: 100,
		hpLimit: 100,
		sp: 100,
		spLimit: 100,
		level: 1,
		char: CharEnum.Beginner.value
	}
)