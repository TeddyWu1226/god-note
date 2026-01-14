import {WarriorSkill} from "@/constants/skill/warrior-skill";
import {WizardSkill} from "@/constants/skill/wizard-skill";
import {CommonSkill} from "@/constants/skill/common-skill";

export const Skills = {
	...WarriorSkill, ...WizardSkill, ...CommonSkill
}