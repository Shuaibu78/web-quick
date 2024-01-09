import { read, utils } from "xlsx";
import { ColumnNamesI } from "./dbColumns";
import * as Buffer from "buffer";

export class ExcelHelper<T> {
  public file: File;

  constructor(file: File) {
    this.file = file;
  }

  private getExcelArray = async () => {
    const arrayBuffer = await this.file.arrayBuffer();
    const arr = new Uint8Array(arrayBuffer);
    const buffer = Buffer.Buffer.from(arr);
    const wb = read(buffer, { type: "buffer" });

    return wb.Sheets[wb.SheetNames[0]];
  };

  public getHeaders = async () => {
    const ws = await this.getExcelArray();
    const headers = utils.sheet_to_json<string[]>(ws, { header: 1 })[0];

    return headers;
  };

  public getJSON = async (mappers: ColumnNamesI[]) => {
    const ws = await this.getExcelArray();
    const range = utils.decode_range(ws["!ref"] as string);

    for (let i = range.s.r; i <= range.e.c; ++i) {
      const address = utils.encode_col(i) + "1";

      mappers.forEach(({ dbColumnName, excelColumnName }) => {
        if (
          ws[address]?.w?.trim() === excelColumnName ||
          ws[address]?.v?.trim() === excelColumnName
        ) {
          ws[address].w = dbColumnName;
          if (excelColumnName !== "EXPIRY DATE") {
            ws[address].v = dbColumnName;
          }
        }
      });
    }

    const data = utils.sheet_to_json<T>(ws);

    return data;
  };

  // TODO
  public exportToExcel = () => {};
}
