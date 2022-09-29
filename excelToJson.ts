type User2Json = {
  username: string,
  firstName: string,
  lastName: string,
  countryCode: string,
  subscriberType: string,
}

import xlsx from 'node-xlsx';
import { 
User as UserModel, 
Class as ClassModel,
School as SchoolModel,
} from 'edjin-node-sdk'
import { readFileSync } from 'fs';
import * as path from 'path';
const userModel = new UserModel()
const classModel = new ClassModel()
const schoolModel = new SchoolModel()
const FILENAME: string = 'C5_provisioning-735-QA.xlsx';

const UID: number = 0
const EMAIL: number = 1
const FIRST_NAME: number = 3
const LAST_NAME: number = 4
const COUNTRY_CODE: number = 7
const USER_ROLE: number = 8
const CLASS_KEY: number = 9

// A custom script meant for simple excel data convertion to JSON

async function parseExcelToJson(): Promise<void> {
  const file = readFileSync(path.resolve(__dirname, 'docs', FILENAME));
  const workSheetsFromBuffer = xlsx.parse(file);

  let userObj: User2Json[] = [];
  let count: number = 0;

  workSheetsFromBuffer.forEach(element => {
      const elementData: any[] = element.data

      elementData.forEach((el, i) => {
        if (i === 0) return;
        if (el.length == 0) return;

        let userData: User2Json;
        let classKey: Array<string> = [];
        if (el[CLASS_KEY]) {
          let CKIndex: number = CLASS_KEY;
          do {
            classKey.push(el[CKIndex]);
            CKIndex = CKIndex +1;
          }
          while (!!el[CKIndex])
        }

        userData = {
            username: el[EMAIL]?.trim(),
            firstName: el[FIRST_NAME]?.trim(),
            lastName: el[LAST_NAME]?.trim(),
            countryCode: el[COUNTRY_CODE]?.trim().toUpperCase(),
            subscriberType: el[USER_ROLE]?.trim().toUpperCase(),
        }

        userObj.push(userData);
        count++;
      })
  });
  console.log(userObj);
}

parseExcelToJson();