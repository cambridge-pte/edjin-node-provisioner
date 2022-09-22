type User = {
  data: {
    userUuid: string,
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    countryCode: string,
    subscriberType: string,
    brandCode: string,
    classCodes: Array<string>,
  }
}

import xlsx from 'node-xlsx';
import { User as UserModel } from 'edjin-node-sdk'
import { readFileSync } from 'fs';
import * as path from 'path';
const userModel = new UserModel()
const FILENAME: string = 'C5_provisioning-735-QA.xlsx';

const UID: number = 0
const EMAIL: number = 1
const FIRST_NAME: number = 3
const LAST_NAME: number = 4
const COUNTRY_CODE: number = 7
const USER_ROLE: number = 8
const CLASS_KEY: number = 9

function parseExcel(): void {
  const file = readFileSync(path.resolve(__dirname, 'docs', FILENAME));
  const workSheetsFromBuffer = xlsx.parse(file);

  let userObj: User[] = [];
  let count: number = 0;

  workSheetsFromBuffer.forEach(element => {
      const elementData: any[] = element.data

      elementData.forEach((el, i) => {
        if (i === 0) return;
        if (el.length == 0) return;

        let userData: User;
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
          data: {
            userUuid: el[UID]?.trim(),
            email: el[EMAIL]?.trim(),
            username: el[EMAIL]?.trim(),
            firstName: el[FIRST_NAME]?.trim(),
            lastName: el[LAST_NAME]?.trim(),
            countryCode: el[COUNTRY_CODE]?.trim().toUpperCase(),
            subscriberType: el[USER_ROLE]?.trim().toUpperCase(),
            brandCode: 'IGCSE',
            classCodes: classKey
          }
        }

        userObj.push(userData);
        count++;
      })
  });

  userObj.forEach(user => {
    //to do: successfully create an account in edjin, last known error: INVALID BRAND CODE
    createEdjinAccount(user.data);

    // return if user is already existing
    // {
    //   "success": false,
    //   "async": false,
    //   "updateCount": 0,
    //   "message": "Username is already used",
    //   "code": "DUPLICATE_USERNAME",
    //   "errors": [
    //       {
    //           "userUuid": "a2e4b96c66654fbda9d02fea4c5ec74b",
    //           "username": "capteacher_loc_shane01@pte-mailbox.cambridgedev.org",
    //           "subscriberType": "TEACHER",
    //           "errorCode": "DUPLICATE_USERNAME",
    //           "message": "Username is already used"
    //       }
    //   ]
    // }

    //addUserToClasses(user.data.classKey, user.data.uuid);
  });
}

async function createEdjinAccount(user: object){
  try {
    const response = await userModel.createUser(user);
    console.log('response >> ', response)
    return response;
  } catch (error) {
    console.log('error >> ', error);
  }
}

async function addUserToClasses(classIds: Array<string>, userId: string){
  try {
    const response = await userModel.addUserToClasses(classIds, userId);
    return response;
  } catch (error) {
    console.log(error)
  }
  }

parseExcel()
