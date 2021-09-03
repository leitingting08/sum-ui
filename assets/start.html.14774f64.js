import{e as s}from"./app.c527a423.js";const n={},a=s('<h2 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="shiki" style="background-color:#ffffff;"><code><span class="line"><span style="color:#24292E;">npm i @sum-ui/layout</span></span>\n<span class="line"><span style="color:#6A737D;"># or</span></span>\n<span class="line"><span style="color:#24292E;">yarn add @sum-ui/layout</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#24292E;">npm i @sum-ui/table</span></span>\n<span class="line"><span style="color:#6A737D;"># or</span></span>\n<span class="line"><span style="color:#24292E;">yarn add @sum-ui/table</span></span>\n<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="使用" tabindex="-1"><a class="header-anchor" href="#使用" aria-hidden="true">#</a> 使用</h2><div class="language-vue ext-vue line-numbers-mode"><pre class="shiki" style="background-color:#ffffff;"><code><span class="line"><span style="color:#24292E;">&lt;</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>\n<span class="line"><span style="color:#24292E;"> &lt;</span><span style="color:#22863A;">sum-layout</span><span style="color:#24292E;">&gt;</span></span>\n<span class="line"><span style="color:#24292E;">   &lt;</span><span style="color:#22863A;">sum-table</span><span style="color:#24292E;">/&gt;</span></span>\n<span class="line"><span style="color:#24292E;"> &lt;/</span><span style="color:#22863A;">sum-layout</span><span style="color:#24292E;">&gt;</span></span>\n<span class="line"><span style="color:#24292E;">&lt;/</span><span style="color:#22863A;">template</span><span style="color:#24292E;">&gt;</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#24292E;">&lt;</span><span style="color:#22863A;">script</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">lang</span><span style="color:#24292E;">=</span><span style="color:#032F62;">&quot;ts&quot;</span><span style="color:#24292E;">&gt;</span></span>\n<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> { defineComponent, toRefs } </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;vue&#39;</span></span>\n<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> SumLayout </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@sum-ui/layout&#39;</span></span>\n<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> SumTable </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@sum-ui/table&#39;</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#D73A49;">export</span><span style="color:#E36209;"> </span><span style="color:#D73A49;">default</span><span style="color:#E36209;"> </span><span style="color:#6F42C1;">defineComponent</span><span style="color:#E36209;">({</span></span>\n<span class="line"><span style="color:#E36209;">  </span><span style="color:#24292E;">name: </span><span style="color:#032F62;">&#39;sum-layout&#39;</span><span style="color:#E36209;">,</span></span>\n<span class="line"><span style="color:#E36209;">  </span><span style="color:#24292E;">components: { SumLayout, SumTable }</span><span style="color:#E36209;">,</span></span>\n<span class="line"><span style="color:#E36209;">  </span><span style="color:#6F42C1;">setup</span><span style="color:#E36209;">() </span><span style="color:#24292E;">{}</span></span>\n<span class="line"><span style="color:#E36209;">})</span></span>\n<span class="line"><span style="color:#24292E;">&lt;/</span><span style="color:#22863A;">script</span><span style="color:#24292E;">&gt;</span></span>\n<span class="line"></span></code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div>',4);n.render=function(s,n){return a};export{n as default};
