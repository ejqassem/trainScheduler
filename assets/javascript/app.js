var howFar;
var trainArrival;

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCcH0Wo5nlCdIHDg1Ipq4Sr5e7tMvwrkBE",
  authDomain: "trainscheduler-76919.firebaseapp.com",
  databaseURL: "https://trainscheduler-76919.firebaseio.com",
  projectId: "trainscheduler-76919",
  storageBucket: "trainscheduler-76919.appspot.com",
  messagingSenderId: "647671534030"
};
firebase.initializeApp(config);

var database = firebase.database();

database.ref().orderByChild("timeStamp").on("child_added", function(childSnapshot) {
  var trainName = childSnapshot.val().trainName;
  console.log("firebase trainName: " + trainName);
  var destination = childSnapshot.val().destination;
  console.log("firebase destination: " + destination);
  var frequency = childSnapshot.val().frequency;
  console.log("firebase frequency: " + frequency);
  var firstTrainTime = childSnapshot.val().firstTrainTime;
  console.log("firebase firstTrainTime: " + firstTrainTime);

  var frequencyMS = 60000 * frequency;

  var trainTime = firstTrainTime.split(":");
  console.log(trainTime);
  var trainTime2 = new Date();
  trainTime2 = trainTime2.setHours(trainTime[0], trainTime[1]);
  console.log(trainTime2);


  var currentDate = moment().toDate().getTime();
  console.log(currentDate);


  for (i = 0; i < 1440; i++) {
    trainTime2 = trainTime2 + frequencyMS;
    if(trainTime2 > currentDate) {
      console.log(trainTime2);
      howFar = trainTime2 - currentDate;
      howFar = Math.round(howFar/60000);
      console.log(howFar);
      trainArrival = moment().add(howFar, 'minutes');
      break;
    }
  }

  console.log(trainArrival);

  trainArrival = trainArrival.format("HH:mm");
  console.log(trainArrival);

  var newRow = $("<tr>");
  newRow.html("<td>" + trainName + "</td>" + "<td>" + destination + "</td>" + "<td>" + frequency + "</td>" + "<td>" + trainArrival + "</td>" + "<td>" + howFar + "</td>");
  $("#trainInfo").append(newRow);

});


$("#submitTrain").on("click", function(event) {
  event.preventDefault();

  (function validateForm() {

    var trainNameInput = document.forms.trainInput["train-name"].value;
    var destinationInput = document.forms.trainInput.destination.value;
    var firstTrainTimeInput = document.forms.trainInput.firstTrainTime.value;
    var frequencyInput = document.forms.trainInput.frequency.value;


    var check_trainName = /^[A-Za-z_]{3,20}$/;
    var check_destination = /^[A-Za-z_]{3,20}$/;
    var check_firstTrainTime = /^([01]\d|2[0-3]):([0-5]\d)$/;
    var check_frequency = /^[0-9]{1,3}$/;

    if((!check_trainName.test(trainNameInput)) && (!check_destination.test(destinationInput)) && (!check_firstTrainTime.test(firstTrainTimeInput)) && (!check_frequency.test(frequencyInput))) {
      alert("Please fill in fields before submitting");
    }
    else if(!check_trainName.test(trainNameInput)) {
      alert("please fill out 'train name' field");
    }
    else if(!check_destination.test(destinationInput)) {
      alert("Please fill out 'destination'");
    }
    else if (!check_firstTrainTime.test(firstTrainTimeInput)) {
      alert("Please correct 'First Train Time' field");
    }
    else if (!check_frequency.test(frequencyInput)) {
      alert("Please check 'Frequency' field ");
    }
    else {
      var trainName = $("#trainName").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrainTime = $("#firstTrainTime").val().trim();
      var frequency = $("#frequency").val().trim();

      console.log("trainName " + trainName);
      console.log("destination " + destination);
      console.log("firstTrainTime " + firstTrainTime);
      console.log("frequency " + frequency);

      $("#trainName").val("");
      $("#destination").val("");
      $("#firstTrainTime").val("");
      $("#frequency").val("");


      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: parseInt(frequency),
        // timeStamp: firebase.database.ServerValue.TIMESTAMP
      });
    }
  })();


});
