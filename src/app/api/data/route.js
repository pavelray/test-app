import { NextResponse } from "next/server";

export async function GET() {
  const { parse } = require("csv-parse");
  const fs = require("fs");

  const parser = parse({ columns: true, delimiter: "," });

  const value = await new Promise(function (resolve, reject) {
    let fetchData = [];
    fs.createReadStream(process.cwd() + "/src/app/api/data/data.csv")
      .pipe(parser)
      .on("data", (row) => {
        fetchData.push(row);
      })
      .on("end", () => {
        resolve(fetchData);
      })
      .on("error", reject);
  });

  return NextResponse.json({ data: value });
}
