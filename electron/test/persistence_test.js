const fs = require('fs');
const path = require('path');

// Mock electron app
const app = {
    getPath: () => '/tmp/dpo_suite_test'
};

// Ensure test dir exists
if (!fs.existsSync('/tmp/dpo_suite_test')) {
  fs.mkdirSync('/tmp/dpo_suite_test');
}

// Test Data File Path
const DATA_FILE = path.join(app.getPath('userData'), 'dpo_data.json');

// --- Mock Main Process Logic ---
const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    return null;
  }
};

const saveData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// --- RUN TESTS ---
console.log("Running Persistence Tests...");

// Test 1: Save Data
const testData = { test: "value", timestamp: Date.now() };
const saveResult = saveData(testData);

if (saveResult.success) {
  console.log("Test 1 (Save): PASS");
} else {
  console.error("Test 1 (Save): FAIL", saveResult.error);
  process.exit(1);
}

// Test 2: Load Data
const loadedData = loadData();
if (loadedData && loadedData.test === "value" && loadedData.timestamp === testData.timestamp) {
  console.log("Test 2 (Load): PASS");
} else {
  console.error("Test 2 (Load): FAIL", loadedData);
  process.exit(1);
}

console.log("All persistence tests passed.");
