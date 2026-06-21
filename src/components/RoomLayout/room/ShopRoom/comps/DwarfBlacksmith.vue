<script setup lang="ts">
// DwarfBlacksmith: Dwarf forge view stub
</script>

<template>
  <div class="blacksmith-container">
    <div class="blacksmith-icon">🔨</div>
    <h3 class="camp-title" style="color: #f56c6c;">旅團鐵匠鋪</h3>
    <p class="camp-desc" style="margin-bottom: 1.5rem;">
      「哐！哐！」身材粗壯的鐵匠正揮舞著沉重的鍛造錘，將一塊燒紅的鋼錠砸得火星四濺。滾燙的爐火照亮了掛滿兵器的牆壁，空氣中瀰漫著鐵鏽與煤煙的氣味。
    </p>
    <el-alert
        title="鍛造台維護中"
        type="warning"
        description="鐵匠抹了抹額頭上的汗水，粗聲粗氣地說：『冒險者，我的鍛造爐出了點小毛病正在重新調整，強化工具目前尚在整備，等過些日子我的爐子修好了，再來幫你熔煉精煉裝備吧！』"
        show-icon
        :closable="false"
        style="max-width: 450px; text-align: left;"
    />
  </div>
</template>

<style scoped>
</style>
