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
    UpdateHeader(GetDisplayDate());
    UpdateScheduleStyles(GetDisplayDate());
    UpdateEvents();
  };

  function UpdateEvents(){
    let events = GetScheduledEvents();

    events.forEach(event => {
      $("#Schedule-Grid [data-time='" + event.EventTime + "'] textarea").text(event.EventText);
    });
  };

  //In future versions will return user selected date vs. current date
  function GetDisplayDate(){
    return dayjs();
  }

  function UpdateHeader(displayDate){
    $("#currentDay").text(displayDate.format("dddd MMMM Do, YYYY"));
  };

  function UpdateScheduleStyles(displayDate){
    $('#Schedule-Grid').children().each(function () {

      //set the times to start off to avoide mid hour calcs
      let hourDiff = displayDate.startOf("hour").diff(dayjs($(this).attr("data-time")).startOf("hour"), "hour")
      
      if (0 < hourDiff) {
        $(this).removeClass("future");
        $(this).removeClass("present");
        $(this).addClass("past");
      } else if (0 === hourDiff){
        $(this).removeClass("past");
        $(this).removeClass("future");
        $(this).addClass("present");
      } else {
        $(this).removeClass("past");
        $(this).removeClass("present");
        $(this).addClass("future");
      }
    });    
  };

  function GenerateTimeBlocks(date, fromTime, toTime){
    
    //clear existing hour blocks
    $("#Schedule-Grid").empty();
    

    for (let currentHour = fromTime; currentHour <= toTime; currentHour++) {
      $("#Schedule-Grid").append(GenerateTimeBlock(date, currentHour));      
    }
  };

  function GenerateTimeBlock(date, hour) {
    date = date.startOf("day").set("hour", hour);

    let timeBlock = $("<div>");
    
    timeBlock.attr("id", "hour-" + hour);
    timeBlock.addClass("row time-block");
    timeBlock.attr("data-time", date.format());

    let hourBlock = $("<div>");

    hourBlock.addClass("col-2 col-md-1 hour text-center py-3");
    hourBlock.text(hour);

    timeBlock.append(hourBlock);
    
    let textArea = $("<textarea>");

    textArea.addClass("col-8 col-md-10 description");
    textArea.attr("rows", "3");

    timeBlock.append(textArea);

    let button = $("<button>");

    button.addClass("btn saveBtn col-2 col-md-1");
    button.attr("aria-label", "save");

    timeBlock.append(button);

    let icon = $("<i>");

    icon.addClass("fas fa-save");
    icon.attr("aria-hidden", "true");

    button.append(icon);

    return timeBlock;
  };

  GenerateTimeBlocks(GetDisplayDate(), 9, 17);

  RefreshPageContents();

  setInterval(() => {
    RefreshPageContents();
  }, 60000)
});

function GetScheduledEvents(){
  let eventsString = localStorage.getItem("Events");

  if (eventsString != null) {
      return JSON.parse(eventsString);
  } else {
      return [];
  }
};

function CreateScheduledEvent(eventTime, eventText) {
  let scheduledEvents = GetScheduledEvents();
  let newEvent = {
    EventTime: eventTime.format(),
    EventText: eventText
  };

  scheduledEvents.push(newEvent);

  localStorage.setItem("Events", JSON.stringify(GetScheduledEvents))
};
function UpdateScheduledEvent(eventTime, eventText) {};