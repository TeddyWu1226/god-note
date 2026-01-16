import {
	AncientRootsWeights,
	BeginForestWeights,
	FairyBarrierWeights,
	TwilightWeights,
	SunkenGroveWeights,
	ScorchingDunesWeights,
	MirageOasisWeights,
	SandstormPassWeights,
	PyramidEntranceWeights,
	PharaohsRestWeights,
	SnowyFoothillsWeights,
	FrozenCliffsWeights,
	WindHowlRidgeWeights,
	FrozenCaveWeights,
	IceDungeonWeights
} from "@/constants/stage-monster-weights";

export const stageMonsterWeightsMap: Record<number, Record<string, number>> = {
	1: BeginForestWeights,
	2: SunkenGroveWeights,
	3: AncientRootsWeights,
	4: FairyBarrierWeights,
	5: TwilightWeights,
	6: ScorchingDunesWeights,
	7: MirageOasisWeights,
	8: SandstormPassWeights,
	9: PyramidEntranceWeights,
	10: PharaohsRestWeights,
	11: SnowyFoothillsWeights,
	12: FrozenCliffsWeights,
	13: WindHowlRidgeWeights,
	14: FrozenCaveWeights,
	15: IceDungeonWeights
}
