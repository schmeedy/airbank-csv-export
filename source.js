var separator = ',';
var total = parseInt($('#grid-paging .cmpInline').text().trim().replace('\/ ', ''));
var lines = [
    [
        "Provedení",
        "Účet",
        "Popis",
        "Typ",
        "Částka",
        "Poplatek"
    ].join(separator)
];

function format_num(input) {
    return Number(input.trim().replace(/(CZK|\s)/g, "").replace(',', '.'));
}

function rows_to_lines() {
  $('.mhtTable.mhtTableLinks tr').each(function(k, row) {
    var tds = $(row).find('td');
    lines.push([
      $(tds[1]).text().trim().replace(/(\d\d)\.(\d\d)\.(\d\d\d\d)/, '$2/$1/$3'),
      $.map($(tds[2]).find('strong'), function(val) {return $(val).text().trim();}).join(" - "),
      $(tds[2]).find('.uiEllipsis').text().replace(/,/g, ' ').trim(),
      $(tds[3]).text().replace(/,/g, ' ').trim(),
      format_num($(tds[4]).text()),
      format_num($(tds[5]).text())
    ].join(separator));
  });
}

function check_next(to_check, finished) {
  if (!$('body.mhtLoaderBodySync').length) {
      var curr = parseInt($('#grid-paging input[type=text]').val());
      rows_to_lines();
      if (curr != total) {
        var next = $('.cmpLinkNext a');
        if(next) {
            next.click();
        }
        check_next(curr + 1, finished);
      } else {
        finished();
      }
      return;
  }
  setTimeout(function() {
      check_next(to_check, finished);
  }, 1000);
}

$('#grid-paging input[type=text]').val(1).blur();
setTimeout(function() {
  check_next(1, function() {
      $('<div class="cmpDialogInner"><div class="cmpDialogCont"><div class="cmpDialogPad clearfix"><p><a href="" download="export.csv" class="csv"><span class="m2-icon-file"><span class="ui-button-icon"></span></span>Stáhnout soubor</a></p><div class="mhtDialogCloseCallback"></div></div>').dialog(
      {
          'title': 'Export','modal': true,
      });
      $('.csv').off('click').attr('href', 'data:application/csv;charset=utf-8,' + encodeURIComponent(lines.join("\n")));

  });
}, 1000);
