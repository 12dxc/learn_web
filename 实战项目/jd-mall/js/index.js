//需要将所有的DOM元素对象以及相关的资源全部都加载完毕后在实现相关函数
window.onload = function () {
  //声明一个全局变量，记录点击的缩略图下标
  var bigimgIndex = 0;

  //路径导航的数据渲染
  navPathDataBind();
  function navPathDataBind() {
    /**
     * 思路：
     * 1、先获取路径导航的页面元素（navPath)
     * 2、再来获取所需要的数据（data.js->goodData.path)
     * 3、由于数据是需要动态产生的，那么相应的DOM元素也应该是动态产生的，含义需要根据数据的数量来进行创建DOM元素
     * 4、在遍历数据创建DOM元素的最后一条，只创建a标签，而不创建i标签
     */
    //1.获取页面导航的元素对象
    var navPath = document.getElementById("navPath");

    //2.获取数据
    var path = goodData.path;

    //3.遍历数据
    for (var i = 0; i < path.length; i++) {
      if (i == path.length - 1) {
        //循环到最后一次，只需要创建a且没有href属性
        var aNode = document.createElement("a");
        aNode.innerText = path[i].title;
        navPath.appendChild(aNode);
      } else {
        //4.创建a标签
        var aNode = document.createElement("a");
        //取出遍历的url赋给href
        aNode.href = path[i].url;
        //取出遍历的title在a标签中追加文本
        aNode.innerText = path[i].title;

        //5.创建i标签
        var iNode = document.createElement("i");
        iNode.innerText = "/";
        //6.让navPath元素来追加a和i
        navPath.appendChild(aNode);
        navPath.appendChild(iNode);
      }
    }
  }
  //放大镜的移入移出效果
  bigClassBind();
  function bigClassBind() {
    /**
     *思路：
     * 1、获取小图框元素对象，并且设置移入事件(onmouseenter)
     * 2、动态的来创建蒙版元素以及大图框和大图片元素
     * 3、移出(onmouseleave)时需移除蒙版元素和大图框
     */

    //1.获取小图框元素
    var smallPic = document.getElementById("smallPic");
    //获取leftTop元素
    var leftTop = document.getElementById("leftTop");
    //获取数据
    var imagessrc = goodData.imagessrc;

    //2.设置移入事件
    smallPic.onmouseenter = function () {
      //3.创建蒙版元素
      var maskDiv = document.createElement("div");
      maskDiv.className = "mask";

      //4.创建大图框元素
      var BigPic = document.createElement("div");
      BigPic.id = "bigPic";

      //5.创建大图片元素
      var BigImg = document.createElement("img");
      BigImg.src = imagessrc[bigimgIndex].b;

      //6.大图框追加大图片
      BigPic.appendChild(BigImg);

      //7.让小图框追加蒙版
      smallPic.appendChild(maskDiv);

      //8.让leftTop追加大图框
      leftTop.appendChild(BigPic);

      //设置移动事件
      smallPic.onmousemove = function (event) {
        //event.clientX：鼠标点击距离浏览器左侧X轴的值
        //getBoundingClientRect().left：小图框元素距离浏览器左侧可是left值
        //offsetWidth：为元素的占位宽度
        var left =
          event.clientX -
          smallPic.getBoundingClientRect().left -
          maskDiv.offsetWidth / 2;
        var top =
          event.clientY -
          smallPic.getBoundingClientRect().top -
          maskDiv.offsetHeight / 2;

        //判断
        if (left < 0) {
          left = 0;
        } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
          left = smallPic.clientWidth - maskDiv.offsetWidth;
        }
        if (top < 0) {
          top = 0;
        } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
          top = smallPic.clientHeight - maskDiv.offsetHeight;
        }

        //设置left和top属性
        maskDiv.style.left = left + "px";
        maskDiv.style.top = top + "px";

        //移动的比例关系 = 蒙版元素移动的距离 / 大图片元素移动的距离
        //蒙版元素移动的距离 = 小图框元素 - 蒙版元素的宽度
        //大图片元素移动的距离 = 大图片宽度 - 大图框元素的宽度
        var scale =
          (smallPic.clientWidth - maskDiv.offsetWidth) /
          (BigImg.offsetWidth - BigPic.clientWidth);

        BigImg.style.left = -left + "px";
        BigImg.style.top = -top + "px";
      };

      //设置移出事件
      smallPic.onmouseleave = function () {
        //让小图框移除蒙版元素
        smallPic.removeChild(maskDiv);

        //leftTop移除大图框
        leftTop.removeChild(BigPic);
      };
    };
  }
  //动态渲染放大镜的缩略图数据
  thumbnaiData();
  function thumbnaiData() {
    /**
     * 思路：
     * 1、先获取piclist的元素下的ul
     * 2、然后获取data.js文件下的goodData->imagessrc
     * 3、遍历数组，根据数组的长度来创建li元素
     * 4、让ul遍历追加li元素
     * */

    //1.获取piclist下的ul
    var ul = document.getElementById("u1");

    //2.获取imagessrc数据
    var imagessrc = goodData.imagessrc;

    //3.遍历数组
    for (var i = 0; i < imagessrc.length; i++) {
      //4.创建li元素
      var newLi = document.createElement("li");

      //5.创建img元素
      var newImg = document.createElement("img");
      newImg.src = imagessrc[i].s;

      //6.让li追加img元素
      newLi.appendChild(newImg);

      //7.让ul追加li元素
      ul.appendChild(newLi);
    }
  }
  //点击缩略图的效果
  thumbnailClick();
  function thumbnailClick() {
    /**
     * 思路：
     * 1、获取所有的li元素，并且循环发生点击事件
     * 2、点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换到现有src的值
     */
    //1.获取所有的li元素
    var liNodes = document.querySelectorAll(
      "#wrapper #content .contentMain #center #left #leftBottom #piclist ul li"
    );

    //获取数据
    var smallPic_img = document.getElementById("img1");
    var imagessrc = goodData.imagessrc;

    //小图路径需要默认和imagessrc的第一个元素小图路径是一致的
    smallPic_img.src = imagessrc[0].s;

    //2.循环点击这些li标签
    for (var i = 0; i < liNodes.length; i++) {
      //在点击事件之前，给每一个元素都添加上自定义的下标
      liNodes[i].index = i; //还可以通过setAttribute('index',i)
      liNodes[i].onclick = function () {
        var idx = this.index; //事件函数中的this永远指向的是实际发生事件的目标源对象
        bigimgIndex = idx;

        //变换小图路径
        smallPic_img.src = imagessrc[bigimgIndex].s;
      };
    }
  }
  //点击左右缩略图箭头实现轮播的效果
  thumbnailLeftRightClick();
  function thumbnailLeftRightClick() {
    /**
     * 思路：
     * 1、先获取左右两端箭头的按钮
     * 2、在获取可视的div和ul元素和所有的li元素
     * 3、计算(发生起点、步长、总体运动距离值)
     * 4、然后在发生点击事件
     */

    //1.获取左边的箭头元素
    var prev = document.getElementById("prev");
    //1.获取右边的箭头元素
    var next = document.getElementById("next");

    //2.获取可视div以及ul元素和所有的li元素
    var piclist = document.getElementById("piclist");
    var ul = document.getElementById("u1");
    var liNodes = document.querySelectorAll(
      "#wrapper #content .contentMain #center #left #leftBottom #piclist ul li"
    );

    //3.计算
    //发生起点
    var start = 0;
    //步长
    var step = (liNodes[0].offsetWidth + 20) * 2;
    //总体运动的距离值 = ul的宽度 - div框的宽度 = (图片的总数 - div中显示的数量) * (li的宽度 + 20)
    var endPostion = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20);

    //4.发生事件
    prev.onclick = function () {
      start -= step;
      if (start < 0) {
        start = 0;
      }
      ul.style.left = -start + "px";
    };
    next.onclick = function () {
      start += step;
      if (start > endPostion) {
        start = endPostion;
      }
      ul.style.left = -start + "px";
    };
  }
  //商品详情数据的动态渲染
  rightTopData();
  function rightTopData() {
    /**
     * 思路：
     * 1、查找rightTop元素
     * 2、查找data。js->goodData->goodDetail
     * 3、建立一个字符串遍历，将原来布局结果装进来，将所对应的数据放在对应得位置上进行重新渲染rightTop
     */

    //1.查找元素
    var rightTop = document.querySelector(
      "#wrapper #content .contentMain #center #right .rightTop"
    );
    //2.查找数据
    var goodsDetail = goodData.goodsDetail;
    //3.创建一个字符串变量
    var s = `<h3>${goodsDetail.title}</h3>
            <p>${goodsDetail.recommend}</p>
            <div class="priceWrap">
            <div class="priceTop">
            <span>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</span>
            <div class="price">
            <span>￥</span>
            <p>${goodsDetail.price}</p>
            <i>降价通知</i>
        </div>
        <p>
            <span>累计评价</span>
            <span>${goodsDetail.evaluateNum}</span>
        </p>
    </div>
    <div class="priceBottom">
        <span>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</span>
        <p>
            <span>${goodsDetail.promoteSales.type}</span>
            <span>${goodsDetail.promoteSales.content}</span>
        </p>
    </div>
</div>
<div class="support">
    <span>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</span>
    <p>${goodsDetail.support}</p>
</div>
<div class="address">
    <span>配&nbsp;送&nbsp;至</span>
    <p>${goodsDetail.address}</p>
</div>`;
    //4.重新渲染rightTop元素
    rightTop.innerHTML = s;
  }
  //商品参数数据的动态渲染
  rightBottomData();
  function rightBottomData() {
    /**
     * 思路：
     * 1、找rightBottom的元素对象
     * 2、查找data.js->goodData.goodsDetail.crumbData数据
     * 3、由于数据是一个数组，需要遍历，有一个元素则需要有一个动态的dl元素对象(dt、dd)
     */

    //1.获取元素
    var chooseWrap = document.querySelector(
      "#wrapper #content .contentMain #center #right .rightBottom .chooseWrap"
    );
    //2.获取数据
    var crumbData = goodData.goodsDetail.crumbData;
    //3.循环数据
    for (i = 0; i < crumbData.length; i++) {
      //4.创建dl元素对象
      var dlNode = document.createElement("dl");
      //5.创建dt元素对象
      var dtNode = document.createElement("dt");
      dtNode.innerText = crumbData[i].title;
      //6.dl追加dt
      dlNode.appendChild(dtNode);
      //7.遍历crumbData->data元素
      for (j = 0; j < crumbData[i].data.length; j++) {
        //创建dd元素
        var ddNode = document.createElement("dd");
        ddNode.innerText = crumbData[i].data[j].type;
        //为每个dd增加一个自定义属性，其值是参数价格
        ddNode.setAttribute("price", crumbData[i].data[j].changePrice);
        //让dl来追加dd
        dlNode.appendChild(ddNode);
      }
      //8.让chooseWrap追加dl
      chooseWrap.appendChild(dlNode);
    }
  }
  //点击商品参数之后的颜色排他效果
  clickddBing();
  function clickddBing() {
    /**
     * 每一行dd文字颜色排他
     * 思路：
     * 1、获取所有的dl元素，取其中第一个dl元素下所有的dd先做测试，
     *    测试完毕之后在对应dl第一行下标的前面再嵌套一个for循环，目的在变换下标
     * 2、循环所有的dd元素并且添加点击事件
     * 3、确定实际发生事件的目标源对象设置其文字颜色为红色，然后给其他所有的元素颜色都充值为基础颜色（#666）
     * =======================================================================================================================
     *
     *
     * 点击dd之后产生的Mark标记
     * 思路：
     * 1、首先先来创建一个可以容纳点击的dd元素容器（数组），确定数组的起始长度
     * 2、然后再将点击的dd元素的值按照对应下标写入到数组的元素身上
     */

    //1.找第一个dl元素下的所有dd元素
    var dlNodes = document.querySelectorAll(
      "#wrapper #content .contentMain #center #right .rightBottom .chooseWrap dl"
    );
    //创建一个构造函数，其长度为dl就是4，但内容为空
    var arr = new Array(dlNodes.length);
    //数组填充值  --fill()方法，利用固定的值填充数组
    arr.fill(0); //输出结果：[0,0,0,0]

    var choose = document.querySelector(
      "#wrapper #content .contentMain #center #right .rightBottom .choose"
    );

    for (i = 0; i < dlNodes.length; i++) {
      (function (i) {
        //2.遍历当前所有的dd元素
        var ddNodes = dlNodes[i].querySelectorAll("dd");
        for (j = 0; j < ddNodes.length; j++) {
          ddNodes[j].onclick = function () {
            //清空choose元素
            choose.innerHTML = "";

            //this：表示哪一个元素真实发生了事件
            for (k = 0; k < ddNodes.length; k++) {
              ddNodes[k].style.color = "#666";
            }
            this.style.color = "red";

            //点击哪一个dd元素动态的产生一个新的Mark元素
            arr[i] = this; //this代替新创建的对象
            changePriceBind(arr); //实参
            //遍历arr数组，将非0元素的值写入到mark标记
            arr.forEach(function (value, index) {
              //--forEach()方法,对数组中每一个元素可以执行一次方法,类似遍历
              //只要是为真的条件
              if (value) {
                //创建div元素，赋予class属性
                var markDiv = document.createElement("div");
                markDiv.className = "mark";
                //设置值
                markDiv.innerText = value.innerText;
                //创建a标签，并且设置值
                var aNode = document.createElement("a");
                aNode.innerText = "X";
                //并且设置下标
                aNode.setAttribute("index", index); //setAttribute(),增加一个自定义的属性，为其赋值
                //让div追加a标签
                markDiv.appendChild(aNode);

                //让choose元素追加div
                choose.appendChild(markDiv);
              }
            });
            //获取所有的a标签元素，循环发生点击事件
            var aNodes = document.querySelectorAll(
              "#wrapper #content .contentMain #center #right .rightBottom .choose .mark a"
            );

            for (n = 0; n < aNodes.length; n++) {
              aNodes[n].onclick = function () {
                //获取点击的a标签的index属性值
                var idx1 = this.getAttribute("index");
                //回复数组中对应下标元素的值
                arr[idx1] = 0;
                //找到对应下标的那个dl行中所有的到的元素
                var ddlist = dlNodes[idx1].querySelectorAll("dd");
                //遍历所有的dd元素
                for (m = 0; m < ddlist.length; m++) {
                  ddlist[m].style.color = "#666";
                }
                //默认的第一个dd元素文字颜色恢复成红色
                ddlist[0].style.color = "red";
                //删除对应下标的mark标记
                choose.removeChild(this.parentNode);

                //调用价格函数
                changePriceBind(arr);
              };
            }
          };
        }
      })(i);
    }
  }
  //价格变动的函数声明
  /**
   * 这个函数是需要在点击dd的时候以及删除mark标记时才需要调用
   */
  function changePriceBind(arr) {
    //这个函数需要在点击dd的时候以及删除mark标记的时候才需要调用
    /**
     * 思路：
     * 1、获取价格的标签元素
     * 2、给每一个dd标签身上都默认设置一个自定义的属性，用来记录变化的价格
     * 3、遍历arr数组，然后将dd元素身上新变化的价格和已有的价格(5299)相加
     * 4、最后将计算之后的结果重新渲染到p标签中
     */

    //1.原价格标签元素
    var oldPrice = document.querySelector(
      "#wrapper #content .contentMain #center #right .rightTop .priceWrap .priceTop .price p"
    );
    var price = goodData.goodsDetail.price;
    //2.遍历arr数组
    for (i = 0; i < arr.length; i++) {
      if (arr[i]) {
        //数据类型强制转换
        var changePrice = Number(arr[i].getAttribute("price"));
        //最终价格
        price += changePrice;
      }
    }
    oldPrice.innerText = price;

    //3.将变化后的价格写入左侧标签
    var leftprice = document.querySelector(
      "#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p"
    );
    leftprice.innerText = "￥" + price;
    //4.遍历选择搭配中所有的复选框元素，看是否有选中的
    var ipts = document.querySelector(
      "#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input"
    );
    var newprice = document.querySelector(
      "#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i"
    );
    for (j = 0; j < ipts.length; j++) {
      if (ipts[j].checked) {
        price += Number(ipts[j].value);
      }
    }
    //5.右侧价格重新渲染
    newprice.innerText = "￥" + price;
  }
  //选择搭配中间区域复选框选中套餐价变动效果
  chooseprice();
  function chooseprice() {
    /**
     * 思路：
     * 1、先获取中间区域复选框所有的元素
     * 2、遍历这些元素取出他们的价格，和左侧的基础价格进行累加，累加之后重新写回套餐标签里面
     */

    //1.先获取复选框元素
    var ipts = document.querySelectorAll(
      "#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input"
    );
    var leftprice = document.querySelector(
      "#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p"
    );
    var newprice = document.querySelector(
      "#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i"
    );
    //2.遍历这些复选框
    for (i = 0; i < ipts.length; i++) {
      ipts[i].onclick = function () {
        var oldprice = Number(leftprice.innerText.slice(1));
        for (j = 0; j < ipts.length; j++) {
          if (ipts[j].checked) {
            //新的价格 = 左侧价格 + 选中复选框附加价
            oldprice = oldprice + Number(ipts[j].value);
          }
        }
        //3.重新写回到套餐价标签中
        newprice.innerText = "￥" + oldprice;
      };
    }
  }
  //封装一个公共选项卡函数
  /**
   * 1、被点击的元素   ->tabBtns
   * 2、被切换显示的元素   ->tabConts
   */
  function Tab(tabBtns, tabConts) {
    for (i = 0; i < tabBtns.length; i++) {
      //为其附上下标
      tabBtns[i].index = i;
      tabBtns[i].onclick = function () {
        for (j = 0; j < tabBtns.length; j++) {
          //先对所有进行重置，让其失去样式
          tabBtns[j].className = "";
          tabConts[j].className = "";
        }
        //然后在为所点击的附上样式
        this.className = "active";
        tabConts[this.index].className = "active";
      };
    }
  }
  //点击左侧选项卡
  leftTab();
  function leftTab() {
    //被点击的元素
    var h4s = document.querySelectorAll(
      "#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideTop h4"
    );
    //被切换的元素
    var divs = document.querySelectorAll(
      "#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideContent>div"
    );
    //调用函数
    Tab(h4s, divs);
  }
  //点击右侧选项卡
  rightTab();
  function rightTab() {
    //被点击的元素
    var lis = document.querySelectorAll(
      "#wrapper #content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .tabBtns li"
    );
    //被切换的元素
    var divs = document.querySelectorAll(
      "#wrapper #content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .tabContents div"
    );
    //调用函数
    Tab(lis, divs);
  }
};
