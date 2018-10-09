var config = {
  apiKey: "AIzaSyCQQiOgalBMicg4Noh2tjZ6iU1Yq3VlQ-0",
  authDomain: "train-scheduler-d6984.firebaseapp.com",
  databaseURL: "https://train-scheduler-d6984.firebaseio.com",
  projectId: "train-scheduler-d6984",
  storageBucket: "train-scheduler-d6984.appspot.com",
  messagingSenderId: "308474010268"
};

firebase.initializeApp(config);

var lineData = firebase.database();

$("#add-train-btn").on("click", function() {
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = $("#first-train-input").val().trim();
  var frequency = $("#frequency-input").val().trim();

  var newLine = {

    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  lineData.ref().push(newLine);

  console.log(newLine.name);
  console.log(newLine.destination);
  console.log(newLine.firstTrain);
  console.log(newLine.frequency);

  // Alert
  alert("Train successfully added");

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");

  return false;
});

lineData.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().firstTrain;

  var timeArr = tFirstTrain.split(":");
  var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
  var maxMoment = moment.max(moment(), trainTime);
  var tMinutes;
  var tArrival;

  if (maxMoment === trainTime) {
    tArrival = trainTime.format("hh:mm A");
    tMinutes = trainTime.diff(moment(), "minutes");
  } 
  else
  {
    var differenceTimes = moment().diff(trainTime, "minutes");
    var tRemainder = differenceTimes % tFrequency;
    tMinutes = tFrequency - tRemainder;
    tArrival = moment().add(tMinutes, "m").format("hh:mm A");
  }
  console.log("tMinutes:", tMinutes);
  console.log("tArrival:", tArrival);

  $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
          tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");
});