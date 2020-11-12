jQuery(function () {
  $.getJSON("/search_index.json", (data, err) => {
    window.idx = data;
  });

  $.getJSON("/corpus.json", (data, err) => {
    window.documents = [];
    Object.entries(data).forEach((key, value) => {
      var doc = {
        id: key[1].id,
        content: key[1].content,
        name: key[1].name,
        url: key[1].url,
      };
      window.documents.push(doc);
    });
  });
  // Event when the form is submitted
  $("#site_search").submit((event) => {
    event.preventDefault();
    var query = $("#search_box").val(); // Get the value for the text field
    window.index = lunr.Index.load(window.idx);
    var results = window.index.search(query); // Get lunr to perform a search
    display_search_results(results); // Hand the results off to be displayed
  });

  var buildSearchResult = (doc) => {
    var li = document.createElement("li"),
      article = document.createElement("article"),
      header = document.createElement("header"),
      section = document.createElement("section"),
      h2 = document.createElement("h2"),
      a = document.createElement("a"),
      p1 = document.createElement("p");

    a.dataset.field = "url";
    a.href += "/blog/" + doc.url;
    a.textContent = doc.name;

    p1.dataset.field = "content";
    p1.textContent = doc.content;
    p1.style.textOverflow = "ellipsis";
    p1.style.overflow = "hidden";
    p1.style.whiteSpace = "nowrap";

    li.appendChild(article);
    article.appendChild(header);
    article.appendChild(section);
    header.appendChild(h2);
    h2.appendChild(a);
    section.appendChild(p1);

    return li;
  };

  function display_search_results(results) {
    var search_results = $("#search_results");
    if (results.length) {
      search_results.empty(); // Clear any old results

      results.forEach(function (result) {
        var item = window.documents.filter((doc) => doc.id === result.ref);
        var li = buildSearchResult(item[0]); // Build a snippet of HTML for this result
        Object.keys(result.matchData.metadata).forEach(function (term) {
          Object.keys(result.matchData.metadata[term]).forEach(function (
            fieldName
          ) {
            var field = li.querySelector("[data-field=" + fieldName + "]"),
              positions = result.matchData.metadata[term][fieldName].position;
            wrapTerms(field, positions);
          });
        });
        search_results.append(li);
      });
    } else {
      // If there are no results, let the user know.
      search_results.html(
        "<li>No results found.<br/>Please check spelling, spacing, yada...</li>"
      );
    }
  }

  function wrapTerms(element, matches) {
    var nodeFilter = {
      acceptNode: function (node) {
        if (/^[\t\n\r ]*$/.test(node.nodeValue)) {
          return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    };
    var index = 0,
      matches = matches
        .sort(function (a, b) {
          return a[0] - b[0];
        })
        .slice(),
      previousMatch = [-1, -1],
      match = matches.shift(),
      walker;
    if (element instanceof Element) {
      walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        nodeFilter,
        false
      );
    } else {
      return "not an element";
    }
    while ((node = walker.nextNode())) {
      if (match == undefined) break;
      if (match[0] == previousMatch[0]) continue;

      var text = node.textContent,
        nodeEndIndex = index + node.length;

      if (match[0] < nodeEndIndex) {
        var range = document.createRange(),
          tag = document.createElement("mark"),
          rangeStart = match[0] - index,
          rangeEnd = rangeStart + match[1];

        tag.dataset.rangeStart = rangeStart;
        tag.dataset.rangeEnd = rangeEnd;

        range.setStart(node, rangeStart);
        range.setEnd(node, rangeEnd);
        range.surroundContents(tag);

        index = match[0] + match[1];

        // the next node will now actually be the text we just wrapped, so
        // we need to skip it
        walker.nextNode();
        previousMatch = match;
        match = matches.shift();
      } else {
        index = nodeEndIndex;
      }
    }
  }
});
