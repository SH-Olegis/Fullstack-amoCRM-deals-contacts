<template>
  <a-input-search
      v-model:value="search"
      placeholder="input search text"
      style="width: 200px"
  />

  <a-table :dataSource="contacts"
           :columns="columns"
           :pagination="false"
           :loading="isLoading"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
import { debounce } from 'lodash-es';
import moment from 'moment';

import api from '@/api/api';

import type { Leads } from '@/components/leads/leads-config';
import { columns, DEBOUNCE_DELAY, MIN_CHARS_SEARCH } from '@/components/leads/leads-config';

export default defineComponent({
  name: 'LeadsTable',
  setup() {
    const contacts = ref<Leads[]>([]);
    const search = ref<string>('');
    const isLoading = ref<boolean>(false);
    const isMinChars = computed<boolean>(() => search.value.length > MIN_CHARS_SEARCH);

    const formatDataToContacts = (data: any[]): Leads[] => data.map((item) => ({
      name: item.name,
      budget: item.budget,
      status: item.status,
      responsible: item.responsible,
      date: moment(item.date).format('DD.MM.YYYY'),
    }));

    const getContacts = debounce(async () => {
      isLoading.value = true;

      try {
        const { data } = await api.get('/leads', {
          params: {
            query: search.value
          }
        });

        contacts.value = formatDataToContacts(data);
      } catch (error) {
        console.error("Error fetching contacts: ", error);
      } finally {
        isLoading.value = false;
      }
    }, DEBOUNCE_DELAY);

    watch(search, () => {
      if (isMinChars.value || !search.value) {
        getContacts();
      }
    });

    onBeforeMount(() => {
      getContacts()
    });

    return {
      contacts,
      columns,
      isLoading,
      search,
    }
  }
})
</script>
