<template>
  <Row class="rule-box">
    <Col span="24">
    <Select v-model:value="rule.field" size="small" style="width: 200px">
      <SelectOption v-for="p in props.properties" :key="p.name" :value="p.name">{{ p.display }}</SelectOption>
    </Select>
    <Select v-model:value="rule.operate" size="small" style="width: 100px">
      <SelectOption v-for="entry in operateEntries" :key="getHashCode(entry.operate)" :value="entry.operate">{{
        entry.display }}</SelectOption>
    </Select>
    <template v-if="property?.typeName == 'System.Boolean'">
      <Switch v-model:checked="rule.value" size="small" />
    </template>
    <template v-else-if="property?.typeName == 'System.Int32' || property?.typeName == 'System.Int64'">
      <template v-if="property?.valueRange.length == 0">
        <div style="width: 150px; display: inline-block;">
          <InputNumber v-model:value="rule.value" size="small"/>
        </div>
      </template>
      <template v-else>
        <Select v-model:value="rule.value" size="small" style="width: 150px">
          <SelectOption v-for="item in property.valueRange" :key="item.id" :value="item.id">{{ item.text }}
          </SelectOption>
        </Select>
      </template>
    </template>
    <template v-else-if="property?.typeName == 'System.DateTime'">
      <DatePicker v-model:value="rule.value" size="small" show-time style="width: 150px" />
    </template>
    <template v-else>
      <Input v-model:value="rule.value" size="small" style="width: 150px" />
    </template>
    <Button size="small" @click="fireRemove(rule)" style="margin-left: 8px">删除</Button>
    </Col>
  </Row>
</template>
<script lang="ts" setup>
import { PropType, ref, watch, onMounted } from 'vue';
import { Row, Col, Select, SelectOption, DatePicker, Input, InputNumber, Switch, Button } from 'ant-design-vue';
import { FilterRule, EntityProperty, FilterOperate, FilterOperateEntry, getHashCode } from '/@/utils/osharp';

// const props = defineProps({
//   rule: { type: Object as PropType<FilterRule>, required: true },
//   properties: { type: Array as PropType<EntityProperty[]>, required: true },
// });
const props = defineProps<{ rule: FilterRule; properties: EntityProperty[]; }>();
const emits = defineEmits(['remove']);

const operateEntries = ref<FilterOperateEntry[]>([]);
const property = ref<EntityProperty>();

onMounted(() => {
  fieldChange(props.rule.field);
});

watch(() => props.rule.field, newField => {
  fieldChange(newField);
});

function fireRemove(rule: FilterRule) {
  emits('remove', rule);
}

function fieldChange(field: string) {
  if (field == null || field == undefined || field == '') {
    return;
  }
  if (!props.properties || props.properties.length < 1) {
    return;
  }
  property.value = props.properties.find((m) => m.name === field);
  if (!property.value) {
    return;
  }

  let entries: FilterOperateEntry[] = [];
  switch (property.value.typeName) {
    case 'System.Boolean':
      entries = getOperateEntries([FilterOperate.Equal, FilterOperate.NotEqual]);
      if (!props.rule.value) {
        props.rule.value = false;
      }
      break;
    case 'System.Guid':
      entries = getOperateEntries([FilterOperate.Equal, FilterOperate.NotEqual]);
      if (!props.rule.value) {
        props.rule.value = '';
      }
      break;
    case 'System.Int32':
    case 'System.Int64':
      if (property.value.valueRange.length == 0) {
        //数值类型
        entries = getOperateEntries([
          FilterOperate.Equal,
          FilterOperate.NotEqual,
          FilterOperate.Less,
          FilterOperate.LessOrEqual,
          FilterOperate.Greater,
          FilterOperate.GreaterOrEqual,
        ]);
        if (!props.rule.value) {
          props.rule.value = 0;
        }
      } else {
        //枚举类型
        entries = getOperateEntries([FilterOperate.Equal, FilterOperate.NotEqual]);
        if (!props.rule.value) {
          props.rule.value = property.value.valueRange[0].id;
        }
      }
      break;
    case 'System.DateTime':
      entries = getOperateEntries([
        FilterOperate.Less,
        FilterOperate.Greater,
      ]);
      if (!props.rule.value) {
        props.rule.value = new Date();
      }
      break;
    case 'System.String':
      entries = getOperateEntries([
        FilterOperate.Equal,
        FilterOperate.NotEqual,
        FilterOperate.StartsWith,
        FilterOperate.EndsWith,
        FilterOperate.Contains,
        FilterOperate.NotContains,
      ]);
      if (!props.rule.value) {
        props.rule.value = '';
      }
      props.rule.operate = entries[4].operate;
      break;
    default:
      entries = getOperateEntries([
        FilterOperate.Equal,
        FilterOperate.NotEqual,
        FilterOperate.Less,
        FilterOperate.LessOrEqual,
        FilterOperate.Greater,
        FilterOperate.GreaterOrEqual,
        FilterOperate.StartsWith,
        FilterOperate.EndsWith,
        FilterOperate.Contains,
        FilterOperate.NotContains,
      ]);
      break;
  }
  operateEntries.value = entries;
  if (!props.rule.operate || !operateEntries.value.find((m) => m.operate === props.rule.operate)) {
    props.rule.operate = operateEntries.value[0].operate;
  }
}

function getOperateEntries(operates: FilterOperate[]): FilterOperateEntry[] {
  let entries: FilterOperateEntry[] = [];
  operates.forEach((operate) => {
    entries.push(new FilterOperateEntry(operate));
  });
  return entries;
}
</script>
<style lang="less" scoped>
.rule-box {
  margin: 3px;
}
</style>
