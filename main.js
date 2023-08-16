"use strict";

let news = [];
let page = 1;
let total_pages = 0;
const menus = document.querySelectorAll(".menus button");
menus.forEach((menu) => menu.addEventListener("click", getNewsByTopic));
let url;

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", getNewsByKeyword);

// api 호출 함수
const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  getNews();
};

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "czuvX4YVIbF4l6ilgP8hdGzowMzkO5gQ4OYX_q7zfws",
    });
    url.searchParams.set("page", page); // &page=page
    console.log(url);
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다.");
      }
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      console.log(data);
      render();
      pageNation();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`;
  document.querySelector("#news-board").innerHTML = errorHTML;
};

// 기사 출력 함수
const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `<div class="row news">
    <div class="col-lg-4">
      <img class="news-img-size" src="${item.media}" alt="">
    </div>
    <div class="col-lg-8">
      <h2>${item.title}</h2>
      <p>${item.summary}</p>
      <div>${item.rights} * ${item.published_date}</div>
    </div>
  </div>`;
    })
    .join("");
  document.querySelector("#news-board").innerHTML = newsHTML;
};

async function getNewsByTopic(event) {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
}

async function getNewsByKeyword() {
  const keyword = document.querySelector("#search-input").value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=10`
  );
  getNews();
}

function pageNation() {
  let pageNationHTML = "";
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  let first = last - 4;
  for (let i = first; i <= last; i++) {
    pageNationHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }
  document.querySelector(".pagination").innerHTML = pageNationHTML;
}

function moveToPage(pageNum) {
  page = pageNum;
  getNews();
}
