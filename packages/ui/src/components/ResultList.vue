<script setup>
defineProps()
</script>

<template>
  <ul class="list">
    <li
      v-for="pageInfo in pages"
      :class="[selectedPage?.id === pageInfo.id ? 'active' : '']"
      @click="$emit('onChange', pageInfo)"
    >
      <div>
        <img :src="pageInfo.favIconUrl" :alt="pageInfo.title" class="page-icon" />
      </div>
      <div>
        <span>Title </span>
        <span>{{ pageInfo.title }}</span>
      </div>
    </li>
  </ul>
</template>

<style>
.list {
  padding: 0;
  font-size: 14px;

  --auto-grid-min-size: 16rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--auto-grid-min-size), 1fr));
}

.list li {
  list-style: none;
  display: flex;
  padding: 8px 16px;
  gap: .6rem;
}

.list li:hover, .list li.active {
  background-color: rgba(200, 200, 200, .08);
}

.list li img {
  padding-top: calc(((14px * 1.5) - 14px) / 2);
}

.list-item {
  padding: 8px 16px;
  width: 240px;
  border: 1px solid #e5e5e5;
}

.url-txt {
  overflow-wrap: break-word;
}

.page-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
}
</style>
