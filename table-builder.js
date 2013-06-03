function tableBuilder(container, data_json, options) {

  /*
   *  default options 
   *  could be re-write by options dictionary 
   *
   *  height == line-height == font-size
   */
  var option = {
    'height': 16
  };

  var header_json = data_json.header_json;
  var columns_json = data_json.columns_json;

  /*
   * user define options 
   */
  if (options) {
    option.height = options.height;
  }

  /* get deep of loop  */
  var max_level = maxLevel(header_json);

  /*  start main */
  var header_html = '';
  var columns_html = '';

  // CALL BUILD CHILDREN FUNCTION
  header_html += buildSingleColHtml(header_json);

  var child_html = '';

  function buildSingleColHtml(json) {

    /*
     * BUILDED HTML SAMPLE 
     *
     * <div class="single_col"> HeaderA
     *  <div> HeaderB
     *    <div> HeaderC </div> <div> HeaderC </div>
     *  </div><!--HeaderB-->
     * </div><!--HeaderA-->
     */

    var cached_length = json.length;
    for (var i = 0; i < cached_length; i++) {

      // BUG FIX FOR COULD NOT LOAD CHILD_HTML DEFINED
      child_html === undefined ? child_html = '' : child_html = child_html;

      var height = (max_level - json[i].line + 1) * option.height,
        line_height = height + (max_level - json[i].line) * (option.height + 2);

      if ((json[i].line != max_level) && (!json[i].children)) {
        child_html += '<div style="height:' + height + 'px;line-height:' + line_height + 'px;">' + json[i].header + '<br/>';
      } else {
        child_html += '<div>' + json[i].header + '<br/>';
      }

      // DETECT IF SHOULD BE RELOOP buildSingleColHtml()
      if (json[i].children) {
        // CALL MYSELF ADAIN
        buildSingleColHtml(json[i].children);
      }

      child_html += '</div>';
    } // end for
    return child_html;
  }

  header_html += child_html;


  var a = 0;

  function maxLevel(data) {
    var cached_length = data.length;
    for (var i = 0; i < cached_length; i++) {
      var b = data[i].line;
      a > b ? a = a : a = b;
      if (data[i].children) {
        maxLevel(data[i].children);
      }
    }
    return a;
  }

  /*  insert into page with container */
  jQuery(container).prepend('<div id="tableBuilderHeader" style="font-size:' + option.height + 'px">' + header_html + '</div>');


  /*  end main table header builder */

  /*  start build table columns */

  /* calculate table columns each width */
  var col_arr = [];

  var divs = $('#tableBuilderHeader div');
  jQuery.each(divs, function () {
    var self = $(this);
    if (self.find('div').length <= 0) {
      col_arr.push(self.width());
    }
  });

  // CALL BUILD COLUMNS FUNCTION
  columns_html += buildColumnsHtml(columns_json);

  function buildColumnsHtml(json) {

    columns_html += '<div id="tableBuilderColumns">';

    var cached_length = json.length,
      columns_num = json[0].length;

    for (var i = 0; i < cached_length; i++) {
      columns_html += '<div class="tablebuilder-single-columns">';
      for (var j = 0; j < columns_num; j++) {
        columns_html += '<div style="width:' + col_arr[j] + 'px;font-size:' + option.height + 'px;line-height:' + option.height + 'px">' + json[i][j] + '</div>';
      }
      columns_html += '</div><br/>';
    }

    columns_html += '</div>';
    return columns_html;
  }
  /* end build table columns */


  /*  insert into page with container */
  jQuery(container).append(columns_html);

} // end tableBuilder