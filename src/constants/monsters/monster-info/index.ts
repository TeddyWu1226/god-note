import {MistyForestMonster} from "@/constants/monsters/monster-info/1-misty-forest-monster";
import {RedMountainMonster} from "@/constants/monsters/monster-info/2-red-mountain-monster";
import {GiantsWastelandMonster} from "@/constants/monsters/monster-info/3-giants-wasteland-monster";
import {SplitCanyonMonster} from "@/constants/monsters/monster-info/4-split-canyon-monster";
import {EndAbyssMonster} from "@/constants/monsters/monster-info/5-end-abyss-monster";
import {JudgmentStageMonster} from "@/constants/monsters/monster-info/6-judgment-stage-monster";
import {Boss} from "@/constants/monsters/monster-info/99-boss-info";
import {SpecialMonster} from "@/constants/monsters/monster-info/98-special-monster";

export const Monster = {
    ...MistyForestMonster,
    ...RedMountainMonster,
    ...GiantsWastelandMonster,
    ...SplitCanyonMonster,
    ...EndAbyssMonster,
    ...JudgmentStageMonster,
    ...SpecialMonster,
    ...Boss,
};