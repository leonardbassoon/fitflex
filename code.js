// Main function to serve the HTML file
function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate();
}

// Function to include files
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// Function to get unique categories
function fetchCategories() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('categories');
  const data = sheet.getDataRange().getValues();
  // Do not fetch category 'Al'l
  const jsonData = data.map((row) => {
    return {
      categoryId: row[0],
      categoryName: row[1],
    };
  });
  console.log(jsonData);
  return jsonData;
}

// Function to get exercises
function fetchExercises() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('exercises');
  const data = sheet.getDataRange().getValues();
  const jsonData = data.map((row) => {
    return {
      exerciseId: row[0],
      exerciseName: row[1],
      categoryId: row[2],
      imageUrl: row[3],
      instruction: row[4],
      videoUrl: row[5],
    };
  });
  console.log (jsonData);
  return jsonData;
}

// Function to add progress data
function addProgress(progressData) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('progress');
  
  const dateTime = new Date(progressData.dateTime);
  const timeZone = Session.getScriptTimeZone();
  const formattedDate = Utilities.formatDate(dateTime, timeZone, "dd/MM/yyyy HH:mm:ss");

  const newRowData = [formattedDate, progressData.exerciseId];
  sheet.appendRow(newRowData);
}

// Function to get progress data
function fetchProgress() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('progress');
  const data = sheet.getDataRange().getValues();
  const jsonData = data.slice(1).map((row) => {
    return {
      date: new Date(row[0]).toLocaleString("en-GB", { timeZone: "Europe/London" }),
      exerciseId: row[1],
    };
  });
  console.log(jsonData);
  return jsonData;
}

function addExercise(newExercise) {
  // Get the active spreadsheet and the Exercises sheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Exercises");

  // Find the next empty row
  const nextEmptyRow = sheet.getLastRow() + 1;

  // Find the highest existing exercise ID
  const exerciseIdsRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1);
  const exerciseIds = exerciseIdsRange.getValues();
  const highestExerciseId = Math.max.apply(null, exerciseIds.map(row => row[0]));

  // Assign a new unique exercise ID
  newExercise.exerciseId = highestExerciseId + 1;

  // Write the new exercise data to the sheet
  sheet.getRange(nextEmptyRow, 1).setValue(newExercise.exerciseId);
  sheet.getRange(nextEmptyRow, 2).setValue(newExercise.exerciseName);
  sheet.getRange(nextEmptyRow, 3).setValue(newExercise.categoryId);
  sheet.getRange(nextEmptyRow, 4).setValue(newExercise.imageUrl);
  sheet.getRange(nextEmptyRow, 5).setValue(newExercise.instruction);
  sheet.getRange(nextEmptyRow, 6).setValue(newExercise.videoUrl);

  // Return the added exercise object
  return newExercise;
}

function fetchStatistics() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Statistics');
  const data = sheet.getRange(2, 3, sheet.getLastRow() - 1, 3).getValues();
  const jsonData = data.map((row) => {
    return {
      categoryName: row[0],
      exerciseName: row[1],
      total: row[2],
    };
  });
  console.log(jsonData);
  return jsonData;
}

function fetchChartStatistics(category) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Statistics');
  const values = sheet.getRange(2, 3, sheet.getLastRow() - 1, 3).getValues();

  var data = [];
  for (var i = 0; i < values.length; i++) {
    if (!category || values[i][0] === category) {
      data.push({
        label: values[i][1],
        value: values[i][2]
      });
    }
  }

  // sort data in descending order
  data.sort(function(a, b) {
    return b.value - a.value;
  });

  // extract sorted labels and values
  const labelsSorted = data.map(item => item.label);
  const dataSorted = data.map(item => item.value);

  console.log({
    labels: labelsSorted,
    values: dataSorted
  });

  return {
    labels: labelsSorted,
    values: dataSorted
  };
}

function updateExercise(exercise) {
  console.log(exercise);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Exercises');
  const lastRow = sheet.getLastRow();
  const exerciseId = exercise.id;
  console.log(exerciseId);

  for (let i = 1; i <= lastRow; i++) {
    if (sheet.getRange(i, 1).getValue() == exerciseId) {
      sheet.getRange(i, 2).setValue(exercise.exerciseName);
      sheet.getRange(i, 3).setValue(exercise.categoryId);
      sheet.getRange(i, 4).setValue(exercise.imageUrl);
      sheet.getRange(i, 5).setValue(exercise.instruction);
      sheet.getRange(i, 6).setValue(exercise.videoUrl);
      break;
    }
  }
}
