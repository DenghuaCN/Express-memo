let Waterfall = (function() {

    function render(selector) {
        let arg1 = arguments[0];

        let $ct = $(selector);
        let $item = $ct.children();
        let nodeWidth = $($item.get(0)).outerWidth(true);
    
        let colLength = parseInt($(window).width() / nodeWidth);        // 获得每行元素个数
        let colHeight = [];                                             // 行高度
        for (let i = 0; i < colLength; i++) {
            colHeight[i] = 0;
        }
    
        let renderArr = [];                                             // 渲染数组
    
    
        let index = 0;
        $item.each(function () {                                        // 遍历保存渲染数据
            let minHeight = Math.min.apply(null, colHeight);
            let minIndex = colHeight.indexOf(minHeight);
    
            let nodeHeight = $(this).outerHeight(true);
            renderArr[index] = {
                top: colHeight[minIndex],
                left: minIndex * nodeWidth
            }
            index++;
    
            colHeight[minIndex] += nodeHeight;
        })
    
        let index2 = 0;                                                 // 根据渲染数组执行渲染
        $item.each(function () {
    
            $(this).css({
                top: renderArr[index2].top,
                left: renderArr[index2].left
            })
            index2++;
        })
    
        // 窗口变化改变布局
        // let isRender;
        // $(window).on('resize', function () {
        //     isRender = setTimeout(() => {
        //         render(arg1);
        //         clearTimeout(isRender);
        //     }, 500);
        // })
        $(window).on('resize', function () {
            render(arg1);
        })
    }

    return {
        init: render
    }

})();

module.exports = Waterfall;

// Waterfall.init('.container');


// ----------------------------------


// var Waterfall = (function(){
//     var $ct;
//     var $items;
  
//     function render($c){
//       $ct = $c;
//       $items = $ct.children();
  
//       var nodeWidth = $items.outerWidth(true),
//         colNum = parseInt($(window).width()/nodeWidth),
//         colSumHeight = [];
  
//       for(var i = 0; i<colNum;i++){
//         colSumHeight.push(0);
//       }
  
//       $items.each(function(){
//         var $cur = $(this);
  
//         //colSumHeight = [100, 250, 80, 200]
  
//         var idx = 0,
//           minSumHeight = colSumHeight[0];
  
//         for(var i=0;i<colSumHeight.length; i++){
//           if(colSumHeight[i] < minSumHeight){
//             idx = i;
//             minSumHeight = colSumHeight[i];
//           }
//         }
  
//         $cur.css({
//           left: nodeWidth*idx,
//           top: minSumHeight
//         });
//         colSumHeight[idx] = $cur.outerHeight(true) + colSumHeight[idx];
//       });
//     }
  
  
//     $(window).on('resize', function(){
//       render($ct);
//     })
  
  
//     return {
//       init: render
//     }
//   })();
  
//   module.exports = Waterfall
