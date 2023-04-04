import{_ as s,o as e,c as l,a}from"./app.56e61cad.js";const C=JSON.parse('{"title":"模块开发指南","description":"","frontmatter":{},"headers":[{"level":2,"title":"Busybox","slug":"busybox","link":"#busybox","children":[]},{"level":2,"title":"KernelSU 模块","slug":"kernelsu-modules","link":"#kernelsu-modules","children":[{"level":3,"title":"module.prop","slug":"module-prop","link":"#module-prop","children":[]},{"level":3,"title":"Shell 脚本","slug":"shell-scripts","link":"#shell-scripts","children":[]},{"level":3,"title":"system 目录","slug":"system-directories","link":"#system-directories","children":[]},{"level":3,"title":"system.prop","slug":"system-prop","link":"#system-prop","children":[]},{"level":3,"title":"sepolicy.rule","slug":"sepolicy-rule","link":"#sepolicy-rule","children":[]}]},{"level":2,"title":"模块安装包","slug":"module-installer","link":"#module-installer","children":[{"level":3,"title":"定制安装过程","slug":"customizing-installation","link":"#customizing-installation","children":[]}]},{"level":2,"title":"启动脚本","slug":"boot-scripts","link":"#boot-scripts","children":[]}],"relativePath":"zh_CN/guide/module.md"}'),n={name:"zh_CN/guide/module.md"},o=a(`<h1 id="introduction" tabindex="-1">模块开发指南 <a class="header-anchor" href="#introduction" aria-hidden="true">#</a></h1><p>KernelSU 提供了一个模块机制，它可以在保持系统分区完整性的同时达到修改系统分区的效果；这种机制通常被称之为 systemless。</p><p>KernelSU 的模块运作机制与 Magisk 几乎是一样的，如果你熟悉 Magisk 模块的开发，那么开发 KernelSU 的模块大同小异，你可以跳过下面有关模块的介绍，只需要了解 <a href="./difference-with-magisk.html">KernelSU 模块与 Magisk 模块的异同</a>。</p><h2 id="busybox" tabindex="-1">Busybox <a class="header-anchor" href="#busybox" aria-hidden="true">#</a></h2><p>KernelSU 提供了一个功能完备的 BusyBox 二进制文件（包括完整的SELinux支持）。可执行文件位于 <code>/data/adb/ksu/bin/busybox</code>。 KernelSU 的 BusyBox 支持运行时可切换的 &quot;ASH Standalone Shell Mode&quot;。 这种独立模式意味着在运行 BusyBox 的 ash shell 时，每个命令都会直接使用 BusyBox 中内置的应用程序，而不管 PATH 设置为什么。 例如，<code>ls</code>、<code>rm</code>、<code>chmod</code> 等命令将不会使用 PATH 中设置的命令（在Android的情况下，默认情况下分别为 <code>/system/bin/ls</code>、<code>/system/bin/rm</code> 和 <code>/system/bin/chmod</code>），而是直接调用 BusyBox 内置的应用程序。 这确保了脚本始终在可预测的环境中运行，并始终具有完整的命令套件，无论它运行在哪个Android版本上。 要强制一个命令不使用BusyBox，你必须使用完整路径调用可执行文件。</p><p>在 KernelSU 上下文中运行的每个 shell 脚本都将在 BusyBox 的 ash shell 中以独立模式运行。对于第三方开发者相关的内容，包括所有启动脚本和模块安装脚本。</p><p>对于想要在 KernelSU 之外使用这个“独立模式”功能的用户，有两种启用方法:</p><ol><li>设置环境变量 <code>ASH_STANDALONE</code> 为 <code>1</code>。例如：<code>ASH_STANDALONE=1 /data/adb/ksu/bin/busybox sh &lt;script&gt;</code></li><li>使用命令行选项切换：<code>/data/adb/ksu/bin/busybox sh -o standalone &lt;script&gt;</code></li></ol><p>为了确保所有后续的 <code>sh</code> shell 都在独立模式下执行，第一种是首选方法（这也是 KernelSU 和 KernelSU 管理器内部使用的方法），因为环境变量会被继承到子进程中。</p><div class="tip custom-block"><p class="custom-block-title">与 Magisk 的差异</p><p>KernelSU 的 BusyBox 现在是直接使用 Magisk 项目编译的二进制文件，<strong>感谢 Magisk！</strong> 因此，你完全不用担心 BusyBox 脚本与在 Magisk 和 KernelSU 之间的兼容问题，因为他们是完全一样的！</p></div><h2 id="kernelsu-modules" tabindex="-1">KernelSU 模块 <a class="header-anchor" href="#kernelsu-modules" aria-hidden="true">#</a></h2><p>KernelSU 模块就是一个放置在 <code>/data/adb/modules</code> 内且满足如下结构的文件夹：</p><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">/data/adb/modules</span></span>
<span class="line"><span style="color:#A6ACCD;">├── .</span></span>
<span class="line"><span style="color:#A6ACCD;">├── .</span></span>
<span class="line"><span style="color:#A6ACCD;">|</span></span>
<span class="line"><span style="color:#A6ACCD;">├── $MODID                  &lt;--- 模块的文件夹名称与模块 ID 相同</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** 模块配置文件 ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── module.prop         &lt;--- 此文件保存模块相关的一些配置，如模块 ID、版本等</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** 模块内容 ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── system              &lt;--- 这个文件夹通常会被挂载到系统</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │   ├── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │   └── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** 标记文件 ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── skip_mount          &lt;--- 如果这个文件存在，那么模块的 \`/system\` 将不会被挂载</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── disable             &lt;--- 如果这个文件存在，那么模块会被禁用</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── remove              &lt;--- 如果这个文件存在，下次重启的时候模块会被移除</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** 可选文件 ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── post-fs-data.sh     &lt;--- 这个脚本将会在 post-fs-data 模式下运行</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── service.sh          &lt;--- 这个脚本将会在 late_start 服务模式下运行</span></span>
<span class="line"><span style="color:#A6ACCD;">|   ├── uninstall.sh        &lt;--- 这个脚本将会在模块被卸载是运行</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── system.prop         &lt;--- 这个文件中指定的属性将会在系统启动时通过 resetprop 更改</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── sepolicy.rule       &lt;--- 这个文件中的 SELinux 策略将会在系统启动时加载</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** 自动生成的目录，不要手动创建或者修改！ ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── vendor              &lt;--- A symlink to $MODID/system/vendor</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── product             &lt;--- A symlink to $MODID/system/product</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── system_ext          &lt;--- A symlink to $MODID/system/system_ext</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │      *** Any additional files / folders are allowed ***</span></span>
<span class="line"><span style="color:#A6ACCD;">│   │</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">│   └── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">|</span></span>
<span class="line"><span style="color:#A6ACCD;">├── another_module</span></span>
<span class="line"><span style="color:#A6ACCD;">│   ├── .</span></span>
<span class="line"><span style="color:#A6ACCD;">│   └── .</span></span>
<span class="line"><span style="color:#A6ACCD;">├── .</span></span>
<span class="line"><span style="color:#A6ACCD;">├── .</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">与 Magisk 的差异</p><p>KernelSU 没有内置的针对 Zygisk 的支持，因此模块中没有 Zygisk 相关的内容，但你可以通过 <a href="https://github.com/Dr-TSNG/ZygiskOnKernelSU" target="_blank" rel="noreferrer">ZygiskOnKernelSU</a> 来支持 Zygisk 模块，此时 Zygisk 模块的内容与 Magisk 所支持的 Zygisk 是完全相同的。</p></div><h3 id="module-prop" tabindex="-1">module.prop <a class="header-anchor" href="#module-prop" aria-hidden="true">#</a></h3><p>module.prop 是一个模块的配置文件，在 KernelSU 中如果模块中不包含此文件，那么它将不被认为是一个模块；此文件的格式如下：</p><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">id=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">name=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">version=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">versionCode=&lt;int&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">author=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">description=&lt;string&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><ul><li>id 必须与这个正则表达式匹配：<code>^[a-zA-Z][a-zA-Z0-9._-]+$</code> 例如：✓ <code>a_module</code>，✓ <code>a.module</code>，✓ <code>module-101</code>，✗ <code>a module</code>，✗ <code>1_module</code>，✗ <code>-a-module</code>。这是您的模块的唯一标识符，发布后不应更改。</li><li>versionCode 必须是一个整数，用于比较版本。</li><li>其他未在上面提到的内容可以是任何单行字符串。</li><li>请确保使用 UNIX（LF）换行类型，而不是Windows（CR + LF）或 Macintosh（CR）。</li></ul><h3 id="shell-scripts" tabindex="-1">Shell 脚本 <a class="header-anchor" href="#shell-scripts" aria-hidden="true">#</a></h3><p>请阅读 <a href="#boot-scripts">启动脚本</a> 一节，以了解 <code>post-fs-data.sh</code> 和 <code>service.sh</code> 之间的区别。对于大多数模块开发者来说，如果您只需要运行一个启动脚本，<code>service.sh</code> 应该已经足够了。</p><p>在您的模块的所有脚本中，请使用 <code>MODDIR=\${0%/*}</code>来获取您的模块的基本目录路径；请勿在脚本中硬编码您的模块路径。</p><div class="tip custom-block"><p class="custom-block-title">与 Magisk 的差异</p><p>你可以通过环境变量 <code>KSU</code> 来判断脚本是运行在 KernelSU 还是 Magisk 中，如果运行在 KernelSU，这个值会被设置为 <code>true</code>。</p></div><h3 id="system-directories" tabindex="-1"><code>system</code> 目录 <a class="header-anchor" href="#system-directories" aria-hidden="true">#</a></h3><p>这个目录的内容会在系统启动后，以 <code>overlayfs</code> 的方式叠加在系统的 <code>/system</code> 分区之上，这意味着：</p><ol><li>系统中对应目录的同名文件会被此目录的文件覆盖。</li><li>系统中对应目录的同名文件夹会与此目录的文件夹合并。</li></ol><p>如果你想删掉系统原来目录某个文件或者文件夹，你需要在模块目录通过 <code>mknod filename c 0 0</code> 来创建一个 <code>filename</code> 的同名文件；这样 overlayfs 系统会自动 whiteout 等效删除此文件（<code>/system</code> 分区并没有被更改）。</p><p>你也可以在 <code>customize.sh</code> 中声明一个名为 <code>REMOVE</code> 并且包含一系列目录的变量来执行删除操作，KernelSU 会自动为你在模块对应目录执行 <code>mknod &lt;TARGET&gt; c 0 0</code>。例如：</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">REMOVE</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#C3E88D;">/system/app/YouTube</span></span>
<span class="line"><span style="color:#C3E88D;">/system/app/Bloatware</span></span>
<span class="line"><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span></code></pre></div><p>上面的这个列表将会执行： <code>mknod $MODPATH/system/app/YouTuBe c 0 0</code> 和 <code>mknod $MODPATH/system/app/Bloatware c 0 0</code>；并且 <code>/system/app/YouTube</code> 和 <code>/system/app/Bloatware</code> 将会在模块生效后被删除。</p><p>如果你想替换掉系统的某个目录，你需要在模块目录创建一个相同路径的目录，然后为此目录设置此属性：<code>setfattr -n trusted.overlay.opaque -v y &lt;TARGET&gt;</code>；这样 overlayfs 系统会自动将系统内相应目录替换（<code>/system</code> 分区并没有被更改）。</p><p>你可以在 <code>customize.sh</code> 中声明一个名为 <code>REPLACE</code> 并且包含一系列目录的变量来执行替换操作，KernelSU 会自动为你在模块对应目录执行相关操作。例如：</p><div class="language-sh"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">REPLACE</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"><span style="color:#C3E88D;">/system/app/YouTube</span></span>
<span class="line"><span style="color:#C3E88D;">/system/app/Bloatware</span></span>
<span class="line"><span style="color:#89DDFF;">&quot;</span></span>
<span class="line"></span></code></pre></div><p>上面这个列表将会：自动创建目录 <code>$MODPATH/system/app/YouTube</code> 和 <code>$MODPATH//system/app/Bloatware</code>，然后执行 <code>setfattr -n trusted.overlay.opaque -v y $$MODPATH/system/app/YouTube</code> 和 <code>setfattr -n trusted.overlay.opaque -v y $$MODPATH/system/app/Bloatware</code>；并且 <code>/system/app/YouTube</code> 和 <code>/system/app/Bloatware</code> 将会在模块生效后替换为空目录。</p><div class="tip custom-block"><p class="custom-block-title">与 Magisk 的差异</p><p>KernelSU 的 systemless 机制是通过内核的 overlayfs 实现的，而 Magisk 当前则是通过 magic mount (bind mount)，二者实现方式有着巨大的差异，但最终的目标实际上是一致的：不修改物理的 <code>/system</code> 分区但实现修改 <code>/system</code> 文件。</p></div><p>如果你对 overlayfs 感兴趣，建议阅读 Linux Kernel 关于 <a href="https://docs.kernel.org/filesystems/overlayfs.html" target="_blank" rel="noreferrer">overlayfs 的文档</a></p><h3 id="system-prop" tabindex="-1">system.prop <a class="header-anchor" href="#system-prop" aria-hidden="true">#</a></h3><p>这个文件的格式与 <code>build.prop</code> 完全相同：每一行都是 <code>[key]=[value]</code> 的形式。</p><h3 id="sepolicy-rule" tabindex="-1">sepolicy.rule <a class="header-anchor" href="#sepolicy-rule" aria-hidden="true">#</a></h3><p>如果您的模块需要一些额外的 SELinux 策略补丁，请将这些规则添加到此文件中。这个文件中的每一行都将被视为一个策略语句。</p><h2 id="module-installer" tabindex="-1">模块安装包 <a class="header-anchor" href="#module-installer" aria-hidden="true">#</a></h2><p>KernelSU 的模块安装包就是一个可以通过 KernelSU 管理器 APP 刷入的 zip 文件，此 zip 文件的格式如下：</p><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">module.zip</span></span>
<span class="line"><span style="color:#A6ACCD;">│</span></span>
<span class="line"><span style="color:#A6ACCD;">├── customize.sh                       &lt;--- (Optional, more details later)</span></span>
<span class="line"><span style="color:#A6ACCD;">│                                           This script will be sourced by update-binary</span></span>
<span class="line"><span style="color:#A6ACCD;">├── ...</span></span>
<span class="line"><span style="color:#A6ACCD;">├── ...  /* 其他模块文件 */</span></span>
<span class="line"><span style="color:#A6ACCD;">│</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>KernelSU 模块不支持在 Recovery 中安装！！</p></div><h3 id="customizing-installation" tabindex="-1">定制安装过程 <a class="header-anchor" href="#customizing-installation" aria-hidden="true">#</a></h3><p>如果你想控制模块的安装过程，可以在模块的目录下创建一个名为 <code>customize.sh</code> 的文件，这个脚本将会在模块被解压后<strong>导入</strong>到当前 shell 中，如果你的模块需要根据设备的 API 版本或者设备构架做一些额外的操作，那这个脚本将非常有用。</p><p>如果你想完全控制脚本的安装过程，你可以在 <code>customize.sh</code> 中声明 <code>SKIPUNZIP=1</code> 来跳过所有的默认安装步骤；此时，你需要自行处理所有安装过程（如解压模块，设置权限等）</p><p><code>customize.sh</code> 脚本以“独立模式”运行在 KernelSU 的 BusyBox <code>ash</code> shell 中。你可以使用如下变量和函数：</p><h4 id="variables" tabindex="-1">变量 <a class="header-anchor" href="#variables" aria-hidden="true">#</a></h4><ul><li><code>KSU</code> (bool): 标记此脚本运行在 KernelSU 环境下，此变量的值将永远为 <code>true</code>，你可以通过它区分 Magisk。</li><li><code>KSU_VER</code> (string): KernelSU 当前的版本名字 (如： <code>v0.4.0</code>)</li><li><code>KSU_VER_CODE</code> (int): KernelSU 用户空间当前的版本号 (如. <code>10672</code>)</li><li><code>KSU_KERNEL_VER_CODE</code> (int): KernelSU 内核空间当前的版本号 (如. <code>10672</code>)</li><li><code>BOOTMODE</code> (bool): 此变量在 KernelSU 中永远为 <code>true</code></li><li><code>MODPATH</code> (path): 当前模块的安装目录</li><li><code>TMPDIR</code> (path): 可以存放临时文件的目录</li><li><code>ZIPFILE</code> (path): 当前模块的安装包文件</li><li><code>ARCH</code> (string): 设备的 CPU 构架，有如下几种： <code>arm</code>, <code>arm64</code>, <code>x86</code>, or <code>x64</code></li><li><code>IS64BIT</code> (bool): 是否是 64 位设备</li><li><code>API</code> (int): 当前设备的 Android API 版本 (如：Android 6.0 上为 <code>23</code>)</li></ul><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p><code>MAGISK_VER_CODE</code> 在 KernelSU 中永远为 <code>25200</code>，<code>MAGISK_VER</code> 则为 <code>v25.2</code>，请不要通过这两个变量来判断是否是 KernelSU！</p></div><h4 id="functions" tabindex="-1">函数 <a class="header-anchor" href="#functions" aria-hidden="true">#</a></h4><div class="language-txt"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#A6ACCD;">ui_print &lt;msg&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    print &lt;msg&gt; to console</span></span>
<span class="line"><span style="color:#A6ACCD;">    Avoid using &#39;echo&#39; as it will not display in custom recovery&#39;s console</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">abort &lt;msg&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    print error message &lt;msg&gt; to console and terminate the installation</span></span>
<span class="line"><span style="color:#A6ACCD;">    Avoid using &#39;exit&#39; as it will skip the termination cleanup steps</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">set_perm &lt;target&gt; &lt;owner&gt; &lt;group&gt; &lt;permission&gt; [context]</span></span>
<span class="line"><span style="color:#A6ACCD;">    if [context] is not set, the default is &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    this function is a shorthand for the following commands:</span></span>
<span class="line"><span style="color:#A6ACCD;">       chown owner.group target</span></span>
<span class="line"><span style="color:#A6ACCD;">       chmod permission target</span></span>
<span class="line"><span style="color:#A6ACCD;">       chcon context target</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span>
<span class="line"><span style="color:#A6ACCD;">set_perm_recursive &lt;directory&gt; &lt;owner&gt; &lt;group&gt; &lt;dirpermission&gt; &lt;filepermission&gt; [context]</span></span>
<span class="line"><span style="color:#A6ACCD;">    if [context] is not set, the default is &quot;u:object_r:system_file:s0&quot;</span></span>
<span class="line"><span style="color:#A6ACCD;">    for all files in &lt;directory&gt;, it will call:</span></span>
<span class="line"><span style="color:#A6ACCD;">       set_perm file owner group filepermission context</span></span>
<span class="line"><span style="color:#A6ACCD;">    for all directories in &lt;directory&gt; (including itself), it will call:</span></span>
<span class="line"><span style="color:#A6ACCD;">       set_perm dir owner group dirpermission context</span></span>
<span class="line"><span style="color:#A6ACCD;"></span></span></code></pre></div><h2 id="boot-scripts" tabindex="-1">启动脚本 <a class="header-anchor" href="#boot-scripts" aria-hidden="true">#</a></h2><p>在 KernelSU 中，根据脚本运行模式的不同分为两种：post-fs-data 模式和 late_start 服务模式。</p><ul><li><p>post-fs-data 模式</p><ul><li>这个阶段是阻塞的。在执行完成之前或者 10 秒钟之后，启动过程会暂停。</li><li>脚本在任何模块被挂载之前运行。这使得模块开发者可以在模块被挂载之前动态地调整它们的模块。</li><li>这个阶段发生在 Zygote 启动之前。</li><li>使用 setprop 会导致启动过程死锁！请使用 <code>resetprop -n &lt;prop_name&gt; &lt;prop_value&gt;</code> 代替。</li><li><strong>只有在必要时才在此模式下运行脚本</strong>。</li></ul></li><li><p>late_start 服务模式</p><ul><li>这个阶段是非阻塞的。你的脚本会与其余的启动过程<strong>并行</strong>运行。</li><li><strong>大多数脚本都建议在这种模式下运行</strong>。</li></ul></li></ul><p>在 KernelSU 中，启动脚本根据存放位置的不同还分为两种：通用脚本和模块脚本。</p><ul><li><p>通用脚本</p><ul><li>放置在 <code>/data/adb/post-fs-data.d</code> 或 <code>/data/adb/service.d</code> 中。</li><li>只有在脚本被设置为可执行（<code>chmod +x script.sh</code>）时才会被执行。</li><li>在 <code>post-fs-data.d</code> 中的脚本以 post-fs-data 模式运行，在 <code>service.d</code> 中的脚本以 late_start 服务模式运行。</li><li>模块<strong>不应</strong>在安装过程中添加通用脚本。</li></ul></li><li><p>模块脚本</p><ul><li>放置在模块自己的文件夹中。</li><li>只有当模块被启用时才会执行。</li><li><code>post-fs-data.sh</code> 以 post-fs-data 模式运行，而 <code>service.sh</code> 则以 late_start 服务模式运行。</li></ul></li></ul><p>所有启动脚本都将在 KernelSU 的 BusyBox ash shell 中运行，并启用“独立模式”。</p>`,58),p=[o];function t(c,i,r,d,u,A){return e(),l("div",null,p)}const h=s(n,[["render",t]]);export{C as __pageData,h as default};
