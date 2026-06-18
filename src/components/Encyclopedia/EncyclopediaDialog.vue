<script setup lang="ts">
import {ref, computed} from 'vue';
import {MistyForestMonster} from "@/constants/monsters/monster-info/1-misty-forest-monster";
import {Boss} from "@/constants/monsters/monster-info/99-boss-info";
import {SpecialBoss} from "@/constants/monsters/monster-info/98-special-boss-info";
import {Dagger, Sword, Axe, MagicStick, Weapon} from "@/constants/items/equipment/weapon-info";
import {SKILL_TEMPLATES} from "@/constants/skill/learned-skill";

const props = defineProps<{
  modelValue: boolean
}>();
const emit = defineEmits(['update:modelValue']);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const activeTab = ref('monster');

// ===================== 怪物資料 =====================
interface MonsterEntry {
  name: string;
  icon: string;
  description: string;
  level: number;
  hp: number;
  ad: number;
  adDefend: number;
  dodge: number;
  hit: number;
  tag: string; // '', 'elite', 'boss'
}

const monsterList = computed<MonsterEntry[]>(() => {
  const list: MonsterEntry[] = [];

  // 迷霧森林普通怪物
  for (const [, m] of Object.entries(MistyForestMonster)) {
    const cls = (m as any).class || '';
    let tag = '';
    if (cls.includes('elite')) tag = '菁英';
    list.push({
      name: (m as any).name,
      icon: (m as any).icon,
      description: (m as any).description || '',
      level: (m as any).level ?? 0,
      hp: (m as any).hpLimit ?? (m as any).hp ?? 0,
      ad: (m as any).ad ?? 0,
      adDefend: (m as any).adDefend ?? 0,
      dodge: (m as any).dodge ?? 0,
      hit: (m as any).hit ?? 0,
      tag,
    });
  }

  // Boss
  for (const [, m] of Object.entries(Boss)) {
    list.push({
      name: (m as any).name,
      icon: (m as any).icon,
      description: (m as any).description || '',
      level: (m as any).level ?? 0,
      hp: (m as any).hpLimit ?? (m as any).hp ?? 0,
      ad: (m as any).ad ?? 0,
      adDefend: (m as any).adDefend ?? 0,
      dodge: (m as any).dodge ?? 0,
      hit: (m as any).hit ?? 0,
      tag: 'Boss',
    });
  }

  // 特殊 Boss
  for (const [, m] of Object.entries(SpecialBoss)) {
    list.push({
      name: (m as any).name,
      icon: (m as any).icon,
      description: (m as any).description || '',
      level: (m as any).level ?? 0,
      hp: (m as any).hpLimit ?? (m as any).hp ?? 0,
      ad: (m as any).ad ?? 0,
      adDefend: (m as any).adDefend ?? 0,
      dodge: (m as any).dodge ?? 0,
      hit: (m as any).hit ?? 0,
      tag: 'Boss',
    });
  }
  return list;
});

// ===================== 武器資料 =====================
interface WeaponEntry {
  name: string;
  icon: string;
  description: string;
  quality: number;
  category: string;
  stats: Record<string, number>;
  isTwoHanded?: boolean;
}

// 計算特殊武器（不在標準四類中的武器）
const standardWeaponKeys = new Set([
  ...Object.keys(Dagger),
  ...Object.keys(Sword),
  ...Object.keys(Axe),
  ...Object.keys(MagicStick),
]);
const SpecialWeapons: Record<string, any> = {};
for (const [key, val] of Object.entries(Weapon)) {
  if (!standardWeaponKeys.has(key)) {
    SpecialWeapons[key] = val;
  }
}

const weaponCategories = [
  {key: 'dagger', label: '🔪 短刀', data: Dagger},
  {key: 'sword', label: '🗡️ 劍', data: Sword},
  {key: 'axe', label: '🪓 斧', data: Axe},
  {key: 'magic', label: '🪄 法杖', data: MagicStick},
  ...(Object.keys(SpecialWeapons).length > 0 ? [{key: 'special', label: '⭐ 特殊', data: SpecialWeapons}] : []),
];

const activeWeaponCategory = ref('dagger');

const weaponList = computed<WeaponEntry[]>(() => {
  const cat = weaponCategories.find(c => c.key === activeWeaponCategory.value);
  if (!cat) return [];
  const list: WeaponEntry[] = [];
  for (const [, w] of Object.entries(cat.data)) {
    const stats: Record<string, number> = {};
    if ((w as any).ad) stats['攻擊'] = (w as any).ad;
    if ((w as any).hit) stats['命中'] = (w as any).hit;
    if ((w as any).critRate) stats['爆擊率'] = (w as any).critRate;
    if ((w as any).critIncrease) stats['爆擊增傷'] = (w as any).critIncrease;
    if ((w as any).apIncrease) stats['法傷增幅%'] = (w as any).apIncrease;
    if ((w as any).hpLimit) stats['生命上限'] = (w as any).hpLimit;
    list.push({
      name: (w as any).name,
      icon: (w as any).icon,
      description: (w as any).description || '',
      quality: (w as any).quality ?? 0,
      category: cat.label,
      stats,
      isTwoHanded: (w as any).isTwoHanded,
    });
  }
  return list.sort((a, b) => a.quality - b.quality);
});

// ===================== 技能資料 =====================
interface SkillEntry {
  id: string;
  name: string;
  icon: string;
  type: string;
  rarity: string;
  costSp: number;
  costAction: number;
  maxCd: number;
  maxProficiency: number;
}

const skillSubTab = ref('active');

const skillList = computed<SkillEntry[]>(() => {
  const list: SkillEntry[] = [];
  for (const [id, s] of Object.entries(SKILL_TEMPLATES)) {
    const sk = s as any;
    if (skillSubTab.value === 'active' && sk.type !== 'active') continue;
    if (skillSubTab.value === 'passive' && sk.type !== 'passive') continue;
    list.push({
      id,
      name: sk.name,
      icon: sk.icon || '❔',
      type: sk.type,
      rarity: sk.rarity || 'common',
      costSp: sk.costSp ?? 0,
      costAction: sk.costAction ?? 0,
      maxCd: sk.maxCd ?? 0,
      maxProficiency: sk.maxProficiency ?? 0,
    });
  }
  return list;
});

// ===================== 格式輔助 =====================
const getQualityColor = (q: number) => {
  if (q >= 11) return '#e74c3c';  // 特殊
  if (q >= 5) return '#9b59b6';   // 紫
  if (q >= 4) return '#3498db';   // 藍
  if (q >= 3) return '#2ecc71';   // 綠
  if (q >= 2) return '#f1c40f';   // 黃
  return '#95a5a6';               // 灰
};

const getQualityLabel = (q: number) => {
  if (q >= 11) return '特殊';
  if (q >= 5) return '精良';
  if (q >= 4) return '優良';
  if (q >= 3) return '良好';
  if (q >= 2) return '普通';
  if (q >= 1) return '粗糙';
  return '破損';
};

const getRarityColor = (r: string) => {
  switch (r) {
    case 'legendary':
      return '#e67e22';
    case 'rare':
      return '#9b59b6';
    case 'unique':
      return '#e74c3c';
    default:
      return '#95a5a6';
  }
};

const getRarityLabel = (r: string) => {
  switch (r) {
    case 'legendary':
      return '傳說';
    case 'rare':
      return '稀有';
    case 'unique':
      return '唯一';
    default:
      return '普通';
  }
};

const getMonsterTagColor = (tag: string) => {
  if (tag === 'Boss') return '#e74c3c';
  if (tag === '菁英') return '#3498db';
  return '';
};

const isImageIcon = (icon: string) => {
  return icon.startsWith('/') || icon.startsWith('monsters/') || icon.startsWith('skills/');
};
</script>

<template>
  <el-dialog
      v-model="dialogVisible"
      title="📚 圖鑑"
      width="650px"
      custom-class="encyclopedia-dialog"
      :append-to-body="true"
      destroy-on-close
  >
    <el-tabs v-model="activeTab" type="border-card" class="enc-tabs">
      <!-- ========== 怪物圖鑑 ========== -->
      <el-tab-pane label="👾 怪物" name="monster">
        <div class="enc-list">
          <div
              v-for="m in monsterList"
              :key="m.name"
              class="enc-card monster-card-entry"
          >
            <div class="card-header">
              <span class="monster-icon">
                <img v-if="isImageIcon(m.icon)" :src="m.icon" alt="" class="icon-img"/>
                <span v-else class="icon-emoji">{{ m.icon }}</span>
              </span>
              <div class="card-title-area">
                <span class="card-name">{{ m.name }}</span>
                <el-tag
                    v-if="m.tag"
                    size="small"
                    :color="getMonsterTagColor(m.tag)"
                    effect="dark"
                    class="tag-badge"
                >{{ m.tag }}
                </el-tag>
              </div>
              <span class="level-badge">Lv.{{ m.level }}</span>
            </div>
            <p class="card-desc">{{ m.description }}</p>
            <div class="stat-row">
              <span class="stat">❤️ {{ m.hp }}</span>
              <span class="stat">⚔️ {{ m.ad }}</span>
              <span class="stat">🛡️ {{ m.adDefend }}</span>
              <span class="stat">💨 {{ m.dodge }}</span>
              <span class="stat">🎯 {{ m.hit }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- ========== 武器圖鑑 ========== -->
      <el-tab-pane label="⚔️ 武器" name="weapon">
        <div class="weapon-category-bar">
          <el-radio-group v-model="activeWeaponCategory" size="small">
            <el-radio-button
                v-for="cat in weaponCategories"
                :key="cat.key"
                :value="cat.key"
            >{{ cat.label }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="enc-list">
          <div
              v-for="w in weaponList"
              :key="w.name"
              class="enc-card weapon-card-entry"
          >
            <div class="card-header">
              <span class="icon-emoji weapon-icon">{{ w.icon }}</span>
              <div class="card-title-area">
                <span class="card-name" :style="{ color: getQualityColor(w.quality) }">{{ w.name }}</span>
                <el-tag size="small" :color="getQualityColor(w.quality)" effect="dark" class="tag-badge">
                  {{ getQualityLabel(w.quality) }}
                </el-tag>
                <el-tag v-if="w.isTwoHanded" size="small" type="warning" effect="plain" class="tag-badge">雙手
                </el-tag>
              </div>
            </div>
            <p class="card-desc">{{ w.description }}</p>
            <div class="stat-row">
              <span v-for="(val, key) in w.stats" :key="key" class="stat">
                {{ key }}: <strong>{{ val > 0 ? '+' : '' }}{{ val }}</strong>
              </span>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- ========== 技能圖鑑 ========== -->
      <el-tab-pane label="✨ 技能" name="skill">
        <div class="skill-sub-bar">
          <el-radio-group v-model="skillSubTab" size="small">
            <el-radio-button value="active">主動技能</el-radio-button>
            <el-radio-button value="passive">被動技能</el-radio-button>
          </el-radio-group>
        </div>
        <div class="enc-list">
          <div
              v-for="s in skillList"
              :key="s.id"
              class="enc-card skill-card-entry"
          >
            <div class="card-header">
              <span class="skill-icon-wrap">
                <img v-if="isImageIcon(s.icon)" :src="s.icon" alt="" class="icon-img skill-icon-img"/>
                <span v-else class="icon-emoji">{{ s.icon }}</span>
              </span>
              <div class="card-title-area">
                <span class="card-name">{{ s.name }}</span>
                <el-tag
                    size="small"
                    :color="getRarityColor(s.rarity)"
                    effect="dark"
                    class="tag-badge"
                >{{ getRarityLabel(s.rarity) }}
                </el-tag>
              </div>
            </div>
            <div class="stat-row skill-stats" v-if="s.type === 'active'">
              <span class="stat" v-if="s.costSp">🔮 SP: {{ s.costSp }}</span>
              <span class="stat" v-if="s.costAction">⚡ AP: {{ s.costAction }}</span>
              <span class="stat" v-if="s.maxCd">⏳ CD: {{ s.maxCd }}回合</span>
              <span class="stat" v-if="s.maxProficiency">📈 熟練度上限: {{ s.maxProficiency }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<style scoped>
.enc-tabs {
  border: none;
  background: transparent;
}

:deep(.el-tabs__content) {
  padding: 0.5rem;
}

.enc-list {
  max-height: 55vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-right: 0.25rem;
}

/* 卡片通用 */
.enc-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.enc-card:hover {
  border-color: var(--el-color-primary-light-5);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.card-title-area {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex: 1;
}

.card-name {
  font-weight: bold;
  font-size: 0.95rem;
}

.tag-badge {
  border: none !important;
  font-size: 0.7rem !important;
  height: 1.2rem !important;
  line-height: 1.2rem !important;
  padding: 0 0.35rem !important;
}

.level-badge {
  font-size: 0.75rem;
  color: #aaa;
  font-weight: bold;
  white-space: nowrap;
}

.card-desc {
  margin: 0.2rem 0 0.4rem;
  font-size: 0.8rem;
  color: #999;
  line-height: 1.4;
}

.stat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.stat {
  font-size: 0.78rem;
  color: #bbb;
  white-space: nowrap;
}

.stat strong {
  color: #e0e0e0;
}

/* 圖示 */
.icon-emoji {
  font-size: 1.5rem;
  line-height: 1;
}

.icon-img {
  width: 2rem;
  height: 2rem;
  object-fit: contain;
  border-radius: 0.25rem;
}

.monster-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  flex-shrink: 0;
}

.skill-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
}

.skill-icon-img {
  width: 1.6rem;
  height: 1.6rem;
}

.weapon-icon {
  font-size: 1.6rem;
}

/* 分類列 */
.weapon-category-bar,
.skill-sub-bar {
  margin-bottom: 0.5rem;
}

.skill-stats {
  margin-top: 0.25rem;
}

/* 滾動條 */
.enc-list::-webkit-scrollbar {
  width: 4px;
}

.enc-list::-webkit-scrollbar-track {
  background: transparent;
}

.enc-list::-webkit-scrollbar-thumb {
  background: var(--el-border-color-darker);
  border-radius: 2px;
}
</style>
