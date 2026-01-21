import {WarriorSkill} from "@/constants/skill/char-skill/warrior-skill";
import {WizardSkill} from "@/constants/skill/char-skill/wizard-skill";
import {CommonSkill} from "@/constants/skill/char-skill/common-skill";
import {OffhandSkill} from "@/constants/skill/offhand-skill/offhand-skill";

export const Skills = {
	...WarriorSkill, ...WizardSkill, ...CommonSkill, ...OffhandSkill
}