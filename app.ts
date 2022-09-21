// type User is patterned to a provided xlsx file. adjustments needed to match edjin api
type User = {
  data: {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    school: boolean,
    state: string,
    postCode: string,
    userRole: string,
    classKey: Array<string>,
  }
}

import xlsx from 'node-xlsx';
import { User as UserModel } from 'edjin-node-sdk'
import { readFileSync } from 'fs';
import * as path from 'path';
const userModel = new UserModel()
const FILENAME: string = 'C5_provisioning-735-QA.xlsx';

const EMAIL: number = 0
const PASSWORD: number = 1
const FIRST_NAME: number = 2
const LAST_NAME: number = 3
const SCHOOL: number = 4
const STATE: number = 5
const POST_CODE: number = 6
const USER_ROLE: number = 7
const CLASS_KEY: number = 8

function parseExcel(): void {
  const file = readFileSync(path.resolve(__dirname, 'docs', FILENAME));
  const workSheetsFromBuffer = xlsx.parse(file);

  let userObj: User[] = [];
  let count: number = 0;
  workSheetsFromBuffer.forEach(element => {
      const elementData: any[] = element.data
      elementData.forEach((el, i) => {
        if (i === 0) return;
        if (el.length == 0)return;
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
            email: el[EMAIL]?.trim(),
            password: el[PASSWORD]?.toString().trim(),
            firstName: el[FIRST_NAME]?.trim(),
            lastName: el[LAST_NAME]?.trim(),
            school: el[SCHOOL]?.trim(),
            state: el[STATE]?.trim(),
            postCode: el[POST_CODE]?.trim(),
            userRole: el[USER_ROLE]?.trim(),
            classKey: classKey
          }
        }

        userObj.push(userData);
        count++;
      })
  });
  
  userObj.forEach(user => {
    //to do: successfully create an account in edjin, last known error: INVALID BRAND CODE
    //createEdjinAccounts(user.data);
    //to do: modify xlsx file to have uuid for each row and test adding to class
    //addUserToClasses(user.data.classKey, user.data.uuid);
    console.log(user.data);
  });

  //edjin create user test
  const testData = {
    email: 'test@cambridge.org',
    username: 'username1',
    firstName: 'John',
    lastName: 'Doe',
    countryCode: 'AU',
    subscriberType: 'STUDENT',
    brandCode	:	'HOTMATHS',
    userUuid: 'erfgt3e434r2',
  };
  createEdjinAccounts(testData);
}

async function createEdjinAccounts(user: object){
try {
  console.log('making user');
  const response = await userModel.createUser(user);
  console.log(response)
  return response;
} catch (error) {
  console.log(error);
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