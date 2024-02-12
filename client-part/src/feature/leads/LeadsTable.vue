<script lang="ts" setup>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { columns, DEBOUNCE_DELAY, MIN_CHARS_SEARCH } from '@/feature/leads/leads-config'
import { useLeadsApi } from '@/services/hooks/leads'
import { useRequest } from 'vue-request'

const search = ref('')
const isMinChars = computed(() => search.value.length > MIN_CHARS_SEARCH)

const { getLeads } = useLeadsApi()

const { data, loading, run } = useRequest(() => getLeads(search.value), {
  debounceInterval: DEBOUNCE_DELAY,
  manual: true
})

watch(search, () => {
  if (isMinChars.value || !search.value) {
    run()
  }
})

onBeforeMount(run)

const computedData = computed(() => data.value?.data)
</script>

<template>
  <a-input-search v-model:value="search" placeholder="input search text" style="width: 200px" />

  <a-table
    :dataSource="computedData"
    :columns="columns"
    :pagination="false"
    :loading="loading"
    :expand-column-width="50"
  >
    <template #expandedRowRender="{ record }">
      <td colspan="6" class="ant-table-cell" v-if="record.contacts">
        <div class="contact-box" v-for="contact in record.contacts" :key="contact.id">
          <span>{{ contact.name }}</span>
        </div>
      </td>
    </template>
    <template #expandColumnTitle> </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <span class="ant-tag ant-tag-has-color" :style="{ backgroundColor: record.status.color }">
          {{ record.status.name }}
        </span>
      </template>
      <template v-else-if="column.key === 'responsible_user'">
        <span>
          {{ record.responsible_user.name }}
        </span>
      </template>
    </template>
  </a-table>
</template>

<style>
.ant-tag {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.88);
  font-size: 12px;
  line-height: 20px;
  list-style: none;
  display: inline-block;
  height: auto;
  margin-inline-end: 8px;
  padding-inline: 7px;
  white-space: nowrap;
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  opacity: 1;
  transition: all 0.2s;
  text-align: start;
}

.contact-box {
  display: flex;
  align-items: center;
  margin-left: 24px;
}
</style>
