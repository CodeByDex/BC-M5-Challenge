$(function () {
  GenerateTimeBlocks(GetDisplayDate(), 9, 17);

  $("#Schedule-Grid button").click(function () {
    CreateScheduledEvent($(this).parent().attr("data-time"), $(this).parent().children("textArea")[0].value);
  });

  RefreshPageContents();

  setInterval(() => {
    RefreshPageContents();
  }, 60000)
});

function DisplaySavedMessage() {
  $("#Save-Message").css("visibility", "visible");

  setTimeout(() => {
    $("#Save-Message").css("visibility", "hidden")
  }, 1000);
};

function UpdateEvents() {
  let events = GetScheduledEvents();

  events.forEach(event => {
    $("#Schedule-Grid [data-time='" + event.EventTime + "'] textarea").text(event.EventText);
  });
};

//In future versions will return user selected date vs. current date
function GetDisplayDate() {
  return dayjs();
}

function UpdateHeader(displayDate) {
  $("#currentDay").text(displayDate.format("dddd, MMMM Do, YYYY"));
};

function UpdateScheduleStyles(displayDate) {
  $('#Schedule-Grid').children().each(function () {

    //set the times to start off to avoide mid hour calcs
    let hourDiff = displayDate.startOf("hour").diff(dayjs($(this).attr("data-time")).startOf("hour"), "hour")

    if (0 < hourDiff) {
      $(this).removeClass("future");
      $(this).removeClass("present");
      $(this).addClass("past");
    } else if (0 === hourDiff) {
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

function GenerateTimeBlocks(date, fromTime, toTime) {

  //clear existing hour blocks
  $("#Schedule-Grid").empty();

  for (let currentHour = fromTime; currentHour <= toTime; currentHour++) {
    $("#Schedule-Grid").append(GenerateTimeBlock(date, currentHour));
  }
};

function GetScheduledEvents() {
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
    EventTime: eventTime,
    EventText: eventText
  };

  let existingIndex = scheduledEvents.findIndex(x => x.EventTime === newEvent.EventTime);

  if (existingIndex != -1) {
    scheduledEvents[existingIndex] = newEvent
  } else {
    scheduledEvents.push(newEvent);
  }

  localStorage.setItem("Events", JSON.stringify(scheduledEvents))

  DisplaySavedMessage();
};

function RefreshPageContents() {
  UpdateHeader(GetDisplayDate());
  UpdateScheduleStyles(GetDisplayDate());
  UpdateEvents();
};

function GenerateTimeBlock(date, hour) {
  date = date.startOf("day").set("hour", hour);

  let timeBlock = $("<div>");

  timeBlock.attr("id", "hour-" + hour);
  timeBlock.addClass("row time-block");
  timeBlock.attr("data-time", date.utc().format());

  let hourBlock = $("<div>");

  hourBlock.addClass("col-2 col-md-1 hour text-center py-3");
  hourBlock.text(date.format("h A"));

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