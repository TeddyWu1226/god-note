<script setup lang="ts">
import '../../room.css';
import { ref, onMounted } from 'vue';
import { useGameStateStore } from '@/store/game-state-store';
import { RoomEnum } from '@/enums/room-enum';
import RoomTemplate from '@/components/RoomLayout/comps/RoomTemplate.vue';
import { CHARACTERS, MYSTERIOUS_EVENTS } from './story-content';

const gameStateStore = useGameStateStore();

const currentType = ref<'DIALOGUE' | 'EVENT'>('DIALOGUE');

// 當前對話內容
const currentCharacter = ref({ name: '', icon: '', dialogue: '' });
// 當前神秘事件內容
const currentEvent = ref({ title: '', icon: '', description: '' });

// 隨機產生情況
const randomizeSituation = () => {
  const typeChance = Math.random();
  if (typeChance < 0.8) {
    currentType.value = 'DIALOGUE';
    // 隨機選一個人物
    const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    // 隨機選一句對話
    const dial = char.dialogues[Math.floor(Math.random() * char.dialogues.length)];
    currentCharacter.value = {
      name: char.name,
      icon: char.icon,
      dialogue: dial
    };
  } else {
    currentType.value = 'EVENT';
    // 隨機選一個事件
    const ev = MYSTERIOUS_EVENTS[Math.floor(Math.random() * MYSTERIOUS_EVENTS.length)];
    currentEvent.value = {
      title: ev.title,
      icon: ev.icon,
      description: ev.description
    };
  }
};

const handleLeave = () => {
  // 切換回 Station 房間
  gameStateStore.setRoom(RoomEnum.Station.value);
};

onMounted(() => {
  randomizeSituation();
});
</script>

<template>
  <RoomTemplate title="在鎮上晃晃">
    <template #default>
      <div class="general-event">
        <!-- 情況 1：人物聊天 -->
        <template v-if="currentType === 'DIALOGUE'">
          <div class="event-icon">{{ currentCharacter.icon }}</div>
          <div class="dialog-box">
            <h3>{{ currentCharacter.name }}</h3>
            <p class="talk-text">{{ currentCharacter.dialogue }}</p>
          </div>
        </template>

        <!-- 情況 2：神秘的事件 -->
        <template v-else-if="currentType === 'EVENT'">
          <div class="event-icon">{{ currentEvent.icon }}</div>
          <div class="dialog-box">
            <h3>{{ currentEvent.title }}</h3>
            <p>{{ currentEvent.description }}</p>
            <p class="event-placeholder" style="color: #909399; font-style: italic; margin-top: 1rem;">
              （周圍一片安靜，似乎什麼也沒有發生...）
            </p>
          </div>
        </template>
      </div>
    </template>

    <template #button>
      <el-button type="primary" @click="randomizeSituation">晃晃</el-button>
      <el-button type="warning" @click="handleLeave">前往城口</el-button>
    </template>
  </RoomTemplate>
</template>

<style scoped>
.talk-text {
  font-style: italic;
  font-weight: bold;
  margin-top: 0.5rem;
}
h3 {
  margin: 0 0 0.5rem 0;
  color: #409eff;
}
</style>
