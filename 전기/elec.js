const axios = require("axios");
const fs = require("fs");

const startDate = new Date("2020-01-01T00:00:00Z");
const endDate = new Date("2024-07-01T00:00:00Z");
const step = 10;

const currDate = new Date(startDate);

const result = [];

const url = "https://bigdata.kepco.co.kr/cmsajax.do";
const searchParams = new URLSearchParams(
  "scode=S01&pcode=000171&pstate=X3&yyyy=2024&ssEmpNm=N&searchLglSiDoNm=N&searchGuGunNm=N&searchLglSiDo=11&searchGuGun=%EC%A0%84%EC%B2%B4&sdateYear=2020&sdateMonth=01&edateYear=2024&edateMonth=07&listCheck=checkAll&hosuChk=hosuChk&avgKwhChk=avgKwhChk&avgAmtChk=avgAmtChk"
);

(async () => {
  const region = "세종특별자치시";
  searchParams.set("searchLglSiDo", "36");

  while (currDate <= endDate) {
    console.log("start", currDate.toLocaleString());
    searchParams.set("sdateYear", currDate.getFullYear());
    searchParams.set(
      "sdateMonth",
      String(currDate.getMonth() + 1).padStart(2, "0")
    );
    currDate.setMonth(currDate.getMonth() + 5);
    searchParams.set("edateYear", currDate.getFullYear());
    searchParams.set(
      "edateMonth",
      String(currDate.getMonth() + 1).padStart(2, "0")
    );

    if (
      searchParams.get("edateYear") == "2024" &&
      searchParams.get("edateMonth") == "12"
    ) {
      searchParams.set("edateMonth", "07");
    }

    await axios
      .get(url, {
        params: searchParams,
      })
      .then((response) => {
        const data = response.data.rows.map((item, i) => {
          return {
            대상가구수: item.hosu,
            평균사용량: item.kwh,
            평균금액: item.amt,
            연: searchParams.get("sdateYear"),
            월: Number(searchParams.get("sdateMonth")) + i,
          };
        });
        console.log(data.length);
        result.push(...data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    currDate.setMonth(currDate.getMonth() + 1);
  }

  fs.writeFileSync(`./전기/${region}.json`, JSON.stringify(result, null, 2));
})();
