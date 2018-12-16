# 一、什么是webp
WebP格式，谷歌开发的一种旨在加快图片加载速度的图片格式。图片压缩体积大约只有JPEG的2/3，并能节省大量的服务器宽带资源和数据空间。

# 二、为什么要用webp
1、减小图片加载资源的大小、节省用户流量资源
2、降低服务器流量资源

## 压缩率
图片压缩结果表格
![December活动页图片压缩结果](https://upload-images.jianshu.io/upload_images/330266-f4c7fc90b87b62d0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![图片文件夹大小](https://upload-images.jianshu.io/upload_images/330266-eb920917a322a6f4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


# 三、webp兼容性情况
![webp兼容性](https://upload-images.jianshu.io/upload_images/330266-1bb69445d1ff5405.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

结果：谷歌全面支持、安卓浏览器从4.2开始支持。那么在页面中对于安卓用户中图片资源加载大小会有大幅度下降。

# 四、webp在各大网站的使用
淘宝
![2.png](https://upload-images.jianshu.io/upload_images/330266-1dfc885a80c0cfb3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
cdn
各大cdn也是支持webp图片格式输出

# 五、项目中的实践
实践中对h5活动页采用webp图片加载方案。

## 总体实现流程
![1544769002(1).png](https://upload-images.jianshu.io/upload_images/330266-44689e822da7fea1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 技术细节
### webp兼容性如何检测
1、js在浏览器端判断是否支持webp
``` js
function check_webp_feature(feature, callback) {
    var kTestImages = {
        lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
        lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
        alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
        animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
    };
    var img = new Image();
    img.onload = function () {
        var result = (img.width > 0) && (img.height > 0);
        callback(feature, result);
    };
    img.onerror = function () {
        callback(feature, false);
    };
    img.src = "data:image/webp;base64," + kTestImages[feature];
}
```
2、浏览器向服务端发起请求的时候accept 会带上image/webp 信息，在服务端判断是否支持webp。

``` nginx
map $http_accept $webp_suffix {
        default   "";
        "~*webp"  ".webp";
}
```
通过nginx中map方法，查找是否有webp字段，如果有设置$webp_suffix 为“.webp”值。通过该值就可以来判断是否支持webp。如果支持写入cookie，前端通过检测cookie做判断，是否加载webp图片。
nginx 中设置cookie代码
``` nginx
location / {
  if ($webp_suffix ~* webp) {
    add_header Set-Cookie 'webpAvaile=true; path= /; expires=3153600';
  }
}
```


### 在开发中如何使用
设置根节点webpa类
``` js
(function () {
  function addRootTag() {
    var className = document.documentElement.className;
    var name = className ? ' webpa' : 'webpa';
    document.documentElement.className += name ;
  }
  var headImg = document.getElementById('headImg');
  var srcUrl = headImg.getAttribute('data-image');
  if (/webpAvaile=true/.test(document.cookie)) {
    addRootTag();
     window.webpAvaile = true;
    // headImg.setAttribute('src',  srcUrl + '.webp')
   } else {
    // headImg.setAttribute('src',  srcUrl)
  }
})()
```

#### 1、css中背景如何写
##### lees写法
``` less
.webbg(@url) {
background-image: url(@url);
.webp & {
  background-image: url('@url.webp')
}
```
在使用的时候采用
``` less
.header{
  .webpbg('../image/header.jpg');
}
```
##### sass 写法
``` scss
@mixin webpbg($url) {
    background-image: url($url);
    @at-root .webpa & {
        background-image: url($url);
    }
}
```
在scss文件中使用
``` scss
@include webpbg('../image/header.jpg');
```
#### 2、html中图片如何引入
##### html中首图src中
通过流程可以知道我们在页面上写入了一个cookie webpAvaile = true。在加载页面的时候我们在页面首图后获取页面是否存在webpAvaile,并设置变量，为图片懒加载使用。
``` js
var headImg = docoment.getElementById('#headImg')
var srcUrl = headImg.getAttribute('data-url')
if ( /webpAvaile=availeable/.test(document.cookies)) {
    window.webpAvaile = true
    // 修改首图地址
    headImg.setAttribute('src',  srcUrl + '.webp')
} else {
    headImg.setAttribute('src',  srcUrl)
}
```
这样我们就处理了首图src的图片格式。
有没有其他方法？html5中的picture元素是否可行？
![picture兼容性](https://upload-images.jianshu.io/upload_images/330266-23c0aed6263823c6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

``` html
<picture class="img" >
    <source class="img" srcset="images/banner.jpg.webp" type="image/webp">
    <img class="img" id="headImg" src="images/banner.jpg"/>
</picture>
```
##### 图片懒加载
在懒加载的时候，同样将存储在data-url中的值修改为是否需要加载webp格式的图片。

##### 3、页面模板中使用
页面模板有php、java、node等不同的类型。思路仍旧是一样，后端判断Accept中是否有image/webp,如果有在原图片格式的后缀后加上.webp。
#### velocity 模板
``` js
![]($!{banner.recordMap.get('图片地址').value}.750x448.jpg$!{isWebp})
```
### 项目发布时图片如何生成
方案一、前端打包时node.js生成webp图片格式 
方案二、nginx + lua + imageMagic 创建webp图片

##### node实现：
###### gulp 打包时生成webp图片
通过gulp任务，调用图片转化库生成对应的webp图片。这样在打包上传资源的时候同时把生成的webp图片资源上传到服务器。
```js
var gulp = require('gulp');
var convert = require('webp-batch-convert');
gulp.task('webp', function () {
	var res = convert.cwebp('./images', './images', {
		q: 80,
		quiet: true
	})
	console.log('total is: ' + res)
})
```
##### webpack打包时候利用webpack-loaders生成webp图片资源
略。

##### nginx技术实现：
实现过程，利用nginx检测图片请求是否存在，如果不存在通过lua调用imageMagic创建webp图片并返回。

```
user  root; # nginx 用户权限 执行lua创建图片命令需要读写权限
# ...
http {
    include       mime.types;
    server {
        listen       80;
        listen       [::]:80 default_server;
        server_name  webp.leewr.com;
        root         /usr/share/nginx/html;
        map $http_accept $webp_suffix { # 检测accept中是否支持webp图片格式
            default   "";
            "~*webp"  ".webp";
        }
        location ~* ^(.+\.(jpg|png|jpeg|gif))(.webp)$ { # 正则匹配图片 paht/name.jpg.webp 格式的图片请求
            if (!-f $request_filename) { # 如果图片不存在
                set $request_filepath /home/leewr/mono/app$1; # 图片真实路径变量
                set $ext $3; # 设置图片扩展名$ext变量
                content_by_lua_file lua/webp.lua; # 调用nginx/lua目录下的webp.lua文件
            }
        }
    }
}
```
下面看lua, lua 中代码非常简单。定义command命令，调用系统os.execute(command)执行convert图片转换命令。convert是ImageMagic的命令。```..``` lua 中字符串连接。ngx.var.ext是nginx中定义的变量。
``` lua
local command
command = "convert " ..ngx.var.request_filepath.. " " ..ngx.var.request_filepath..ngx.var.ext
os.execute(command)
ngx.exec(ngx.var.request_uri)
```

详细见另一篇文章。nginx + lua + ImageMagic实现webp图片剪切。


小结：webp图片可以通过webpack、gulp在前端打包的时候生成，也可以通过nginx层自动完成图片的转换。两者都可以达到目的。通过nginx层创建图片是一个更系统的方案。因为在对图片进行处理的时，我们的需求可能不只是简单的图片格式转换。当我们需要在不同的情形调用不同的图片大小、不同图片格式的图片的时候，这时候前端就无能为力了,如需要支持```90x90.jpg.webp```的图片。需要依赖整个系统的能力实现资源的管理，而webp图片格式转换只是静态资源管理中的一个小需求了。

# 最后总结一下：
流程
1、nginx检测webp支持情况。
2、添加cookie
3、前端检测cookie决定是否加载 webp图片。
开发
1、html根节点添加webpa支持class
2、html中img资源可以头图可以采用picture方式加载。懒加载图片手动判断选择加载webp图片格式。
3、css中利用根节点的class编写样式。```.webpbg('url')``` 或者 ```@include webpbg(''url)```

最后附上项目中所有代码地址[github](https://github.com/leewr/webp-example) , h5地址：http://webp.leewr.com





