


// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.

  function RefreshPageContents(){
    let displayDate = dayjs();
    UpdateHeader(displayDate);
    UpdateScheduleStyles(displayDate);
  };

  function UpdateHeader(displayDate){
    $("#currentDay").text(displayDate.format("dddd MMMM Do, YYYY"));
  };

  function UpdateScheduleStyles(displayDate){
    $('#Schedule-Grid').children().each(function () {

      if (0 < displayDate.diff(dayjs($(this).attr("data-time")), "hour")) {
        $(this).removeClass("future");
        $(this).addClass("past");
      } else {
        $(this).removeClass("past");
        $(this).addClass("future");
      }
    });    
  };

  function GenerateTimeBlocks(date, fromTime, toTime){
    
    $("#Schedule-Grid").empty();
    
    for (let currentHour = fromTime; currentHour <= toTime; currentHour++) {
      $("#Schedule-Grid").append(GenerateTimeBlock(date, currentHour));      
    }
  };

  function GenerateTimeBlock(date, hour) {
    date = date.set("hour", hour);

    let timeBlock = $("<div>");
    
    timeBlock.attr("id", "hour-" + hour);
    timeBlock.addClass("row time-block");
    timeBlock.attr("data-time", date.toISOString());

    let hourBlock = document.createElement("div");

    hourBlock.classList = "col-2 col-md-1 hour text-center py-3";
    hourBlock.textContent = hour;

    timeBlock.append(hourBlock);
    
    let textArea = document.createElement("textarea");

    textArea.classList = "col-8 col-md-10 description";
    textArea.setAttribute("rows", "3");

    timeBlock.append(textArea);

    let button = document.createElement("button");

    button.classList = "btn saveBtn col-2 col-md-1";
    button.setAttribute("aria-label", "save");

    timeBlock.append(button);

    let icon = document.createElement("i");

    icon.classList = "fas fa-save";
    icon.setAttribute("aria-hidden", "true");

    button.append(icon);

    return timeBlock;
  };

  GenerateTimeBlocks(dayjs(), 9, 17);


  RefreshPageContents();

  setInterval(() => {
    RefreshPageContents();
  }, 60000)
});
