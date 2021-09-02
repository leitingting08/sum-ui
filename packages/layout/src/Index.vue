<template>
  <div class="sum-layout">
    <!-- header -->
     <el-container class="container" :style="headerStyles">
        <el-row align="middle" justify="space-between" type="flex" style="width:100%;">
          <!-- header 左边内容 -->
          <render v-if="titleType === 'function'" :render="headerTitle"  />
          <slot v-else-if="titleType === 'object' && headerTitle?.slot" :name="headerTitle?.slot" />
          <div v-else>{{headerTitle}}</div>
          <!-- header 右边内容 -->
          <render v-if="rightType === 'function'" :render="headerRight"  />
          <slot v-else-if="rightType === 'object' && headerRight?.slot" :name="headerRight?.slot" />
          <div v-else>{{headerRight}}</div>
        </el-row>
     </el-container>
      <!-- sider -->
      <el-container class="sider">
          <el-menu v-bind="menuProps" class="sum-menu">
            <el-sub-menu :index="`${index}`" v-for="({ title, icon, children },index) in menuData" :key="index">
                <template #title><i :class="icon" v-if="icon"></i><span v-if="!menuProps.collapse">{{ title }}</span></template>
                <template v-if="children && children.length">
                    <el-menu-item-group v-for="(sub,subindex) in children" :key="subindex">
                        <router-link :to="sub.path">
                          <el-menu-item :index="`${index}-${subindex}`">{{ sub.title }}</el-menu-item>
                        </router-link>
                    </el-menu-item-group>
                </template>
            </el-sub-menu>
            <a v-if="triggerCollapse" href="javascript:void(0)" :class="`arrow ${menuProps.collapse?'collapse':''}`" @click="menuProps.collapse=!menuProps.collapse"><i :class="`icon el-icon-arrow-${menuProps.collapse?'left':'right'}`"/></a>
          </el-menu>
        <!-- container -->
        <el-container>
            <el-main>
                <slot />
            </el-main>
            <el-footer class="center" v-if="typeof footer==='function'">
              <render :render="footer"  />
            </el-footer>
            <el-footer class="center" v-else-if="typeof footer==='object' && footer?.slot">
              <slot :name="footer.slot"/>
            </el-footer>
            <el-footer class="center" v-else>{{ footer }}</el-footer>
        </el-container>
      </el-container>
  </div>
</template>

<script>
import { defineComponent, toRefs } from 'vue'
import { ElContainer, ElRow, ElMenu, ElSubMenu, ElMenuItem, ElMenuItemGroup, ElIcon, ElMain, ElFooter } from 'element-plus'
import Render from './components/Render.vue'

export default defineComponent({
  name: 'sum-layout',
  components: {
    ElContainer,
    ElRow,
    ElMenu, 
    ElSubMenu, 
    ElMenuItem, 
    ElMenuItemGroup,
    ElIcon,
    ElMain,
    ElFooter,
    Render
  },
  props: {
    settings: {
      type: Object,
      default: {
        headerTitle: '',
        headerRight: '',
        menuData: [],
        menuProps: {},
        headerStyles: {},
        footer: ''
      }
    }
  },
  setup(props) {
    const { settings } = toRefs(props)
    const { headerTitle, headerRight, menuData, headerStyles, menuProps, triggerCollapse, footer } = settings.value
    const titleType = typeof headerTitle
    const rightType = typeof headerRight
    return {
      titleType,
      rightType,
      headerTitle, 
      headerRight,
      settings,
      menuData,
      menuProps,
      triggerCollapse,
      headerStyles,
      footer
    }
  }
})
</script>

<style lang="scss">
.sider {
  height: 100vh;
  .el-menu {
    height: 100%;
  }
  .center {
    text-align: center;
  }
  .sum-menu {
    position: relative;
    .arrow {
    position: absolute;
    top: 50%;
    right: -11px;
    margin-top: -18px;
    width: 10px;
    background: #dfdfdf;
    height: 36px;
    line-height: 36px;
    border-radius: 2px 0 0 2px;
    color: #9b9b9b;
    &.collapse {
      right: 0;
    }
    .icon {
      font-size: 12px;
    }
    &:hover {
      background-color: #888;

      .icon {
        color: #fff;
      }
    }
  }
  }
}
</style>
