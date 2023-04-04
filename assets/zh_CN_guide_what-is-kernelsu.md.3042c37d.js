import{_ as e,o as t,c as a,a as r}from"./app.56e61cad.js";const f=JSON.parse('{"title":"什么是 KernelSU?","description":"","frontmatter":{},"headers":[{"level":2,"title":"功能","slug":"features","link":"#features","children":[]},{"level":2,"title":"如何使用","slug":"how-to-use","link":"#how-to-use","children":[]},{"level":2,"title":"如何构建","slug":"how-to-build","link":"#how-to-build","children":[]},{"level":2,"title":"讨论","slug":"discussion","link":"#discussion","children":[]}],"relativePath":"zh_CN/guide/what-is-kernelsu.md"}'),i={name:"zh_CN/guide/what-is-kernelsu.md"},s=r('<h1 id="introduction" tabindex="-1">什么是 KernelSU? <a class="header-anchor" href="#introduction" aria-hidden="true">#</a></h1><p>KernelSU 是 Android GKI 设备的 root 解决方案，它工作在内核模式，并直接在内核空间中为用户空间应用程序授予 root 权限。</p><h2 id="features" tabindex="-1">功能 <a class="header-anchor" href="#features" aria-hidden="true">#</a></h2><p>KernelSU 的主要特点是它是<strong>基于内核的</strong>。 KernelSU 运行在内核空间， 所以它可以提供我们以前从未有过的内核接口。 例如，我们可以在内核模式下为任何进程添加硬件断点；我们可以在任何进程的物理内存中访问，而无人知晓；我们可以在内核空间拦截任何系统调用; 等等。</p><p>KernelSU 还提供了一个基于 overlayfs 的模块系统，允许您加载自定义插件到系统中。它还提供了一种修改 /system 分区中文件的机制。</p><h2 id="how-to-use" tabindex="-1">如何使用 <a class="header-anchor" href="#how-to-use" aria-hidden="true">#</a></h2><p>请参考: <a href="./installation.html">安装</a></p><h2 id="how-to-build" tabindex="-1">如何构建 <a class="header-anchor" href="#how-to-build" aria-hidden="true">#</a></h2><p>请参考: <a href="./how-to-build.html">如何构建</a></p><h2 id="discussion" tabindex="-1">讨论 <a class="header-anchor" href="#discussion" aria-hidden="true">#</a></h2><ul><li>Telegram: <a href="https://t.me/KernelSU" target="_blank" rel="noreferrer">@KernelSU</a></li></ul>',11),n=[s];function l(o,h,d,u,c,_){return t(),a("div",null,n)}const m=e(i,[["render",l]]);export{f as __pageData,m as default};
