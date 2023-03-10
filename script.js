import * as axios from "https://cdn.skypack.dev/axios@1.3.4";
import * as cheerio from "https://cdn.skypack.dev/cheerio@1.0.0-rc.12";
import $ from "https://cdn.skypack.dev/jquery@3.6.3";

const axios = require('axios');
const cheerio = require('cheerio');
const jquery = require('jquery');

const comparePrices = () => {
  const searchTerm = document.getElementById("search-term").value;
  const resultsDiv = document.getElementById("results");
  const compareBtn = document.getElementById("compare-btn");
compareBtn.addEventListener("click", comparePrices);
  // Clear previous results
  resultsDiv.innerHTML = "";

  // Define search URLs for each site
  const searchUrls = {
    Tayda: `https://www.taydaelectronics.com/catalogsearch/result/?q=${searchTerm}`,
    Amazon: `https://www.amazon.fr/s?k=${searchTerm}`,
    AliExpress: `https://www.aliexpress.com/wholesale?SearchText=${searchTerm}`,
  };

  // Create array to store prices
  const prices = [];

  // Loop through each search URL and extract prices
  for (const [site, url] of Object.entries(searchUrls)) {
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        const $ = cheerio.load(html);

        let name, price;

        if (site === "Tayda") {
          const result = $(".product-item-info");
          if (result.length) {
            name = result.find(".product-item-name a").text();
            price = parseFloat(result.find(".price").text().replace("$", ""));
          }
        } else if (site === "Amazon") {
          const result = $("div[data-asin]");
          if (result.length) {
            name = result.find("h2 a").text();
            price = parseFloat(
              result.find(".a-price-whole").first().text() +
                "." + "&tag=" +
                result.find(".a-price-fraction").first().text()
            );
          }
        } else if (site === "AliExpress") {
          const result = $(".list-item");
          if (result.length) {
            name = result.find(".product-title").text().trim();
            price = parseFloat(
              result.find(".price-current strong").text() +
                result.find(".price-current sup").text()
            );
          }
        }

        // Add price to prices array
        if (name && price) {
          prices.push({
            name,
            site,
            price,
          });
        }

        // Sort prices by ascending price
        prices.sort((a, b) => a.price - b.price);

        // Display top 3 prices
        for (let i = 0; i < Math.min(prices.length, 3); i++) {
          const result = document.createElement("div");
          result.classList.add("result");
          result.innerHTML = `
            <p><strong>${prices[i].name}</strong></p>
            <p>${prices[i].site}</p>
            <p>${prices[i].price.toFixed(2)} €</p>
          `;
          resultsDiv.appendChild(result);
        }
      })
      .catch((error) => {
        console.error(error);
        resultsDiv.innerHTML = "<p>Une erreur est survenue lors de la recherche.</p>";
      });
  }
};

// Add event
//const compareBtn = document.getElementById("compare-btn");
//compareBtn.addEventListener("click", comparePrices);
