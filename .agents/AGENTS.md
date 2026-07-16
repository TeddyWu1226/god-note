# Workspace Rules for Tower RPG Developer Agent

## Vue 3 Development & Syntax Rules

- **Strict Vue 3 Slot Syntax**: Never nest `<template v-slot:slotname>` (or `#slotname`) inside `v-if`, `v-else`, `v-for`, or any standard HTML tags. In Vue 3, `v-slot` can **only** be declared on components or `<template>` tags that are **direct children** of the component providing the slot.
  - *Incorrect*:
    ```html
    <template v-else>
      <template v-slot:default>...</template>
    </template>
    ```
  - *Correct*:
    ```html
    <RoomTemplate>
      <template #default>
        <template v-if="condition">...</template>
      </template>
    </RoomTemplate>
    ```
  - Declaring a slot nested deep inside conditionals will fail the Vue template compilation and break the development server.

## Testing Rules

- 測試一律都由我自己測試
