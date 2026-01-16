import {MistyForestMonster} from "@/constants/monsters/monster-info/1-misty-forest-monster";
import {EndLessMonster} from "@/constants/monsters/monster-info/endless-monster";
import {ScorchedSandsMonster} from "@/constants/monsters/monster-info/2-scorched-sands-monster";
import {IcyPlateauMonster} from "@/constants/monsters/monster-info/3-icy-plateau-monster";


export const Monster = {
	...MistyForestMonster,
	...ScorchedSandsMonster,
	...IcyPlateauMonster,
	...EndLessMonster
}