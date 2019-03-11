var addEvent = function(object, type, callback) {
  if (object == null || typeof(object) == 'undefined') return;
  if (object.addEventListener) {
    object.addEventListener(type, callback, false);
  } else if (object.attachEvent) {
    object.attachEvent('on' + type, callback);
  } else {
    object['on' + type] = callback;
  }
};

/**
 * Hack for querySelector
 * @link http://ajaxian.com/archives/creating-a-queryselector-for-ie-that-runs-at-native-speed
 */
if (!document.querySelector) {
  document.querySelector = function (selector) {
    var head = document.documentElement.firstChild;
    var styleTag = document.createElement('STYLE');
    head.appendChild(styleTag);
    document.__qsResult = [];

    styleTag.styleSheet.cssText = selector + '{x:expression(document.__qsResult.push(this))}';
    window.scrollBy(0, 0);
    head.removeChild(styleTag);

    var result = [];
    for (var i in document.__qsResult)
      result.push(document.__qsResult[i]);
    return result;
  }
}

/**
 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
 */
if (!Math.trunc) {
  Math.trunc = function(v) {
    v = +v;
    return (v - v % 1)   ||   (!isFinite(v) || v === 0 ? v : v < 0 ? -0 : 0);
  };
}

var Masonry = function (options) {
  if (!options.container) {
    throw 'Container should not be empty'
  }

  var container = document.querySelector(options.container)

  if (container.style.position !== 'absolute') {
    container.style.position = 'relative';
  }

  var items = container.querySelectorAll(options.itemContainer)
  var loadedItems = []

  items.forEach(function (item) {
    item.onload = function () {
      loadedItems.push(item)

      if (items.length === loadedItems.length) {
        run()
      }
    }
  })

  function run() {
    var widthSum = 0
    var margin = options.margin || 0
    var containerWidth = container.getBoundingClientRect().width
    var maxItemsInRow = Math.trunc(containerWidth / (options.itemWidth + margin))

    for (var index = 0, row = 0; index < loadedItems.length; index += 1) {
      if (index !== 0 && index % maxItemsInRow === 0) {
        row++
        widthSum = 0
      }

      loadedItems[index].style.top = 0
      loadedItems[index].style.left = widthSum
      loadedItems[index].style.position = 'absolute'

      if (row !== 0) {
        loadedItems[index].style.top = (function (r) {
          var sum = 0

          for (var x = 1; x <= r; x += 1) {
            sum = sum + loadedItems[index - maxItemsInRow * x].getBoundingClientRect().height + margin
          }

          return sum
        })(row)
      }

      widthSum = widthSum + options.itemWidth + margin
    }
  }

  addEvent(window, 'resize', run)
}
