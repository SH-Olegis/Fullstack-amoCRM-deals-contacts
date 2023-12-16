<script lang="ts">
import { defineComponent } from 'vue';

import LeadsTable from '@/components/leads/LeadsTable.vue';

export default defineComponent({
  name: 'App',
  components: {
    LeadsTable
  }
})
</script>

<template>
  <LeadsTable />
</template>
