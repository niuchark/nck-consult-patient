import 'vue-router'

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export {}

declare module 'vue-router' {
  interface RouteMeta {
    // 扩展vue-router模块，增加RouteMeta接口
    // 是可选的
    title?: string
  }
}
