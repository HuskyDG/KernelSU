import{_ as e,o as a,c as s,a as t}from"./app.56e61cad.js";const m=JSON.parse('{"title":"What is KernelSU?","description":"","frontmatter":{},"headers":[{"level":2,"title":"Features","slug":"features","link":"#features","children":[]},{"level":2,"title":"How to use","slug":"how-to-use","link":"#how-to-use","children":[]},{"level":2,"title":"How to build","slug":"how-to-build","link":"#how-to-build","children":[]},{"level":2,"title":"Discussion","slug":"discussion","link":"#discussion","children":[]}],"relativePath":"guide/what-is-kernelsu.md"}'),r={name:"guide/what-is-kernelsu.md"},i=t('<h1 id="what-is-kernelsu" tabindex="-1">What is KernelSU? <a class="header-anchor" href="#what-is-kernelsu" aria-hidden="true">#</a></h1><p>KernelSU is a root solution for Android GKI devices, it works in kernel mode and grant root permission to userspace application directly in kernel space.</p><h2 id="features" tabindex="-1">Features <a class="header-anchor" href="#features" aria-hidden="true">#</a></h2><p>The main feature of KernelSU is it is <strong>Kernel-based</strong>. KernelSU works in kernel mode, so it can provide kernel interface we never had before. For example, we can add hardware breakpoint to any process in kernel mode; We can access physical memory of any process without anybody being aware of; We can intercept any syscall in kernel space; etc.</p><p>And also, KernelSU provides a module system via overlayfs, which allows you to load your custom plugin into system. It also provides a mechanism to modify files in <code>/system</code> partition.</p><h2 id="how-to-use" tabindex="-1">How to use <a class="header-anchor" href="#how-to-use" aria-hidden="true">#</a></h2><p>Please refer: <a href="./installation.html">Installation</a></p><h2 id="how-to-build" tabindex="-1">How to build <a class="header-anchor" href="#how-to-build" aria-hidden="true">#</a></h2><p><a href="./how-to-build.html">How to build</a></p><h2 id="discussion" tabindex="-1">Discussion <a class="header-anchor" href="#discussion" aria-hidden="true">#</a></h2><ul><li>Telegram: <a href="https://t.me/KernelSU" target="_blank" rel="noreferrer">@KernelSU</a></li></ul>',11),o=[i];function n(l,d,h,c,u,p){return a(),s("div",null,o)}const w=e(r,[["render",n]]);export{m as __pageData,w as default};
