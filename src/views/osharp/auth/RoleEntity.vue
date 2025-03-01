<!--
 <once-generated>
    这个文件只生成一次，再次生成不会被覆盖。
 </once-generated>
 <copyright file="src/views/osharp/auth/RoleEntity.vue" company="LiuliuSoft">
    OSHARP.ORG@2021
 </copyright>
 <site>https://www.osharp.org</site>
 <last-editor>郭明锋</last-editor> -->

<template>
  <div>
    <AdminTable v-bind="adminTableProps">
      <template #expandedRowRender="{ record }">
        <div>
          <FilterGroupV :group="record.filterGroup || { rules: [], groups: [], operate: FilterOperate.And, level: 1 }"
            :entity="record.entityType" />
          <Button @click="showGroupJson(record)" type="primary" style="margin: 5px;">显示JSON</Button>
          <Authority :value="`${authPath}.SetFilterGroup`">
            <Button @click="saveFilterGroup(record)" type="default" style="margin: 5px;">保存</Button>
          </Authority>
          <Alert v-if="record.groupJson" type="info" :showIcon="true" message="筛选规则JSON"
            :description="record.groupJson" />
        </div>
      </template>
    </AdminTable>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Button, Alert } from 'ant-design-vue';
import { AdminTable, AdminTableProps, FilterGroupV } from '/@/components/Osharp';
import { ActionItem, BasicColumn, BasicTableProps, FormSchema, FormProps } from '/@/components/Table';
import { useDrawer } from "/@/components/Drawer";
import { Authority } from '/@/components/Authority';
import { useMessage } from '/@/hooks/web/useMessage';
import { cloneDeep } from 'lodash';
import { CheckboxRender, TagRender, defaultModuleInfo, ModuleInfo, FilterOperate, transTagToOptions, dataAuthOperationTags, cleanFilterGroup } from '/@/utils/osharp';
import { readRoleNodeApi, readEntityinfoNodeApi, setRoleEntityFilterGroupApi } from '/@/api/osharp';

const module: ModuleInfo = {
  ...defaultModuleInfo,
  moduleName: 'Auth',
  moduleDisplay: '权限授权',
  entityName: 'RoleEntity',
  entityDisplay: '数据权限',
  entityFullName: 'OSharp.Hosting.Authorization.Entities.EntityRole,OSharp.Hosting.Core'
};
const authPath = computed(() => `Root.${module.areaName}.${module.moduleName}.${module.entityName}`).value;
const { createMessage } = useMessage();

const columns: BasicColumn[] = [
  { title: '角色', dataIndex: 'roleName', sorter: true, width: 120 },
  { title: '数据实体', dataIndex: 'entityName', align: 'left', sorter: true, width: 500, customRender: ({ text, record }) => `${text}[${record.entityType}]` },
  { title: '权限操作', dataIndex: 'operation', sorter: true, width: 100, customRender: ({ text }) => TagRender(text, dataAuthOperationTags) },
  { title: '是否锁定', dataIndex: 'isLocked', sorter: true, width: 100, customRender: ({ text }) => CheckboxRender(text) },
  { title: '创建时间', dataIndex: 'createdTime', sorter: true, width: 130, format: 'date|YYYY/MM/DD HH:mm' },
];

const editSchemas: FormSchema[] = [
  { label: '编号', field: 'id', component: 'Input', render: ({ values }) => values?.id || '自动生成' },
  { label: '角色', field: 'roleId', component: 'ApiSelect', componentProps: { api: readRoleNodeApi, labelField: 'roleName', valueField: 'roleId' }, colProps: { span: 24 } },
  { label: '数据实体', field: 'entityId', component: 'ApiSelect', componentProps: { api: readEntityinfoNodeApi, valueField: 'id', labelField: 'name' }, colProps: { span: 24 } },
  { label: '权限操作', field: 'operation', component: 'Select', componentProps: { options: transTagToOptions(dataAuthOperationTags) }, colProps: { span: 12 } },
  { label: '是否锁定', field: 'isLocked', component: 'Switch', colProps: { span: 12 } },
];

const filterSchemas: FormSchema[] = [
  { label: '角色编号', field: 'roleId', component: 'InputNumber', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
  { label: '数据编号', field: 'entityId', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
  { label: '数据权限操作', field: 'operation', component: 'Input', componentProps: { operate: FilterOperate.Contains }, colProps: { span: 12 } },
  { label: '是否锁定', field: 'isLocked', component: 'Switch', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
  { label: '创建时间', field: 'createdTime', component: 'DatePicker', componentProps: { operate: FilterOperate.Equal }, colProps: { span: 8 } },
];

const adminTableProps: AdminTableProps = {
  module: module,
  showExpand: true,
  tablePropsFn: tablePropsFn,
  tableActionsFn: tableActionsFn,
  tableDropDownActionsFn: tableDropDownActionsFn,
  filterFormPropsFn: filterFormPropsFn,
  editFormPropsFn: editFormPropsFn,
  editModalFn: (m, r) => m.setModalProps({ title: `更新${module.entityDisplay} - ${r.name}` }),
};

function tablePropsFn(p: BasicTableProps): BasicTableProps {
  p.title = `${module.entityDisplay}管理`;
  p.columns = columns;
  p.useSearchForm = true;
  p.showIndexColumn = true;
  return p;
}

function tableActionsFn(items: ActionItem[], record: Recordable) {
  return items;
}

function tableDropDownActionsFn(items: ActionItem[], record: Recordable) {
  items.push(
    { icon: 'ant-design:safety-certificate-outlined', label: '设置权限', onClick: setFilterGroup.bind(null, record) }
  );
  return items;
}

function filterFormPropsFn(p: FormProps): FormProps {
  p.schemas = filterSchemas;
  return p;
}
function editFormPropsFn(p: FormProps): FormProps {
  p.schemas = editSchemas;
  return p;
}

function showGroupJson(record: Recordable) {
  let group = cloneDeep(record.filterGroup);
  cleanFilterGroup(group, true);
  record.groupJson = JSON.stringify(group, null, 2);
}

async function saveFilterGroup(record: Recordable) {
  let group = cloneDeep(record.filterGroup);
  cleanFilterGroup(group, false);
  await setRoleEntityFilterGroupApi(record.id, group);
}

// #region 设置过滤条件组

const [registerSearchDrawer, searchDrawerMethods] = useDrawer();
const searchProps = ref();

function setFilterGroup(record: Recordable) {
  console.log(record);
}

// #endregion

</script>
