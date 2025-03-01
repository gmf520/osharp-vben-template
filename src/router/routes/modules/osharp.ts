// -----------------------------------------------------------------------
//  <once-generated>
//     这个文件只生成一次，再次生成不会被覆盖。
//  </once-generated>
//
//  <copyright file="src/router/routes/modules/osharp.ts" company="LiuliuSoft">
//      OSHARP.ORG@2021
//  </copyright>
//  <site>https://www.osharp.org</site>
//  <last-editor>郭明锋</last-editor>
// -----------------------------------------------------------------------
import type { AppRouteModule } from '/@/router/types';
import { LAYOUT, getParentLayout } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const osharp: AppRouteModule = {
  path: '/system',
  name: 'OSharp',
  component: LAYOUT,
  redirect: '/system',
  meta: {
    orderNo: 1000,
    icon: 'ion:settings-outline',
    title: t('routes.osharp.system'),
    acl: ['Root.Admin'],
  },
  children: [
    {
      path: 'identity',
      name: 'Identity',
      component: getParentLayout('Identity'),
      redirect: '/system/identity/user',
      meta: {
        title: t('routes.osharp.identity.identity'),
        icon: 'ant-design:key-outlined',
        acl: ['Root.Admin.Identity'],
      },
      children: [
        {
          path: 'user',
          name: 'User',
          component: () => import('/@/views/osharp/identity/User.vue'),
          meta: {
            title: t('routes.osharp.identity.user'),
            icon: 'ant-design:user-outlined',
            acl: ['Root.Admin.Identity.User'],
          },
        },
        {
          path: 'role',
          name: 'Role',
          component: () => import('/@/views/osharp/identity/Role.vue'),
          meta: {
            title: t('routes.osharp.identity.role'),
            icon: 'ant-design:usergroup-add-outlined',
            acl: ['Root.Admin.Identity.Role'],
          },
        },
        {
          path: 'user-role',
          name: 'UserRole',
          component: () => import('/@/views/osharp/identity/UserRole.vue'),
          meta: {
            title: t('routes.osharp.identity.userRole'),
            icon: 'ant-design:usergroup-add-outlined',
            acl: ['Root.Admin.Identity.UserRole'],
          },
        },
        {
          path: 'login-log',
          name: 'LoginLog',
          component: () => import('/@/views/osharp/identity/LoginLog.vue'),
          meta: {
            title: t('routes.osharp.identity.loginLog'),
            icon: 'ant-design:login-outlined',
            acl: ['Root.Admin.Identity.LoginLog'],
          },
        },
      ],
    },
    {
      path: 'auth',
      name: 'Auth',
      component: getParentLayout('Auth'),
      redirect: '/system/auth/module',
      meta: {
        title: t('routes.osharp.auth.auth'),
        icon: 'ant-design:security-scan-outlined',
        acl: ['Root.Admin.Auth'],
      },
      children: [
        {
          path: 'module',
          name: 'Module',
          component: () => import('/@/views/osharp/auth/Module.vue'),
          meta: {
            title: t('routes.osharp.auth.module'),
            icon: 'ant-design:medium-outlined',
            acl: ['Root.Admin.Auth.Module'],
          },
        },
        {
          path: 'function',
          name: 'Function',
          component: () => import('/@/views/osharp/auth/Function.vue'),
          meta: {
            title: t('routes.osharp.auth.function'),
            icon: 'ant-design:function-outlined',
            acl: ['Root.Admin.Auth.Function'],
          },
        },
        {
          path: 'entity-info',
          name: 'EntityInfo',
          component: () => import('/@/views/osharp/auth/EntityInfo.vue'),
          meta: {
            title: t('routes.osharp.auth.entityInfo'),
            icon: 'ant-design:database-outlined',
            acl: ['Root.Admin.Auth.EntityInfo'],
          },
        },
        {
          path: 'role-entity',
          name: 'RoleEntity',
          component: () => import('/@/views/osharp/auth/RoleEntity.vue'),
          meta: {
            title: t('routes.osharp.auth.roleEntity'),
            icon: 'ant-design:database-outlined',
            acl: ['Root.Admin.Auth.RoleEntity'],
          },
        },
      ],
    },
    {
      path: 'infos',
      name: 'Infos',
      component: getParentLayout('Infos'),
      redirect: '/system/infos/article',
      meta: {
        title: t('routes.osharp.infos.infos'),
        icon: 'ant-design:info-circle-outlined',
        acl: ['Root.Admin.Infos'],
      },
      children: [
        {
          path: 'article',
          name: 'Article',
          component: () => import('/@/views/osharp/infos/Article.vue'),
          meta: {
            title: t('routes.osharp.infos.article'),
            icon: 'ant-design:container-outlined',
            acl: ['Root.Admin.Infos.Article'],
          },
        },
        {
          path: 'message',
          name: 'Message',
          component: () => import('/@/views/osharp/infos/Message.vue'),
          meta: {
            title: t('routes.osharp.infos.message'),
            icon: 'ant-design:message-outlined',
            acl: ['Root.Admin.Infos.Message'],
          },
        },
      ],
    },
    {
      path: 'sys',
      name: 'Sys',
      component: getParentLayout('Sys'),
      redirect: '/system/sys/pack',
      meta: {
        title: t('routes.osharp.sys.sys'),
        icon: 'ant-design:info-circle-outlined',
        acl: ['Root.Admin.Systems']
      },
      children: [
        {
          path: 'pack',
          name: 'Pack',
          component: () => import('/@/views/osharp/sys/Pack.vue'),
          meta: {
            title: t('routes.osharp.sys.pack'),
            icon: 'ant-design:container-outlined',
            acl: ['Root.Admin.Systems.Pack'],
          }
        }
      ]
    },
  ],
};

export default osharp;
