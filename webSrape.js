const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// URL of the page you want to scrape
const url = "https://internshala.com/internships";

// Function to fetch data from the Internshala website
async function fetchData(url) {
  const result = await axios.get(url);
  return result.data;
}

// Function to parse HTML content and extract internship information
function parseData(html) {
  const $ = cheerio.load(html);
  const internships = [];

  // Select internship elements and extract relevant information
  $(".individual_internship").each((index, element) => {
    const title = $(element).find(".heading_4_5").text().trim();
    const company = $(element).find(".heading_6").text().trim();
    const location = $(element).find(".location_link").text().trim();
    const stipend = $(element).find(".stipend").text().trim();
    const duration = $(element)
      .find(".internship_other_details")
      .children()
      .last()
      .text()
      .trim();

    // Create an object with the extracted information and push it to the internships array
    const internship = {
      title,
      company,
      location,
      stipend,
      duration,
    };
    internships.push(internship);
  });

  return internships;
}

// Function to write internship data to a CSV file
function writeToCSV(internships) {
  const csvContent = internships
    .map((internship) => Object.values(internship).join(","))
    .join("\n");

  fs.writeFile("internships.csv", csvContent, "utf8", (err) => {
    if (err) {
      console.error("Error writing CSV file:", err);
    } else {
      console.log(
        "Internships data has been successfully written to internships.csv",
      );
    }
  });
}

// Main function to initiate the scraping process
async function main() {
  try {
    const html = await fetchData(url);
    const internships = parseData(html);
    writeToCSV(internships);
  } catch (error) {
    console.error("Error scraping data:", error);
  }
}

// Call the main function to start the scraping process
main();
