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

async function parseExcel(): Promise<void> {
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

  const result = await provisionAccounts(userObj);
  //await checkAccountsAndClasses(userObj);
  //console.log('Accounts made or existing: ' + result?.accountExistingOrMade);
  //console.log('No. of account creation failures: ' + result?.accountSuccessFail);
  //console.log('Enrolled accounts success: ' + result?.classAddSuccess);
  //console.log('Enrolled accounts failures: ' + result?.classAddFail);
}

async function provisionAccounts(userObj: User[]){
  try {
    let accountExistingOrMade = 0;
    let accountSuccessFail = 0;
    let classAddSuccess = 0;
    let classAddFail = 0;
    let test = 0;
    const accountCreation = userObj.map(async (user: any) => {
      const response = await userModel.createUser(user.data);
      response.success||response.code === 'DUPLICATE_USERNAME' ? accountExistingOrMade++ : accountSuccessFail++
      return response 
    })
    await Promise.all(accountCreation);

    const classEnrollment = userObj.map(async (user: any) => {

      const classCodes = user.data.classCodes.map(async (code: any) => {
        const response = await classModel.getClassByClassKey(code);
        return response.classId 
      })

      const allClassCodes = await Promise.all(classCodes);

      const userId = await getUserByGlobalGoID(user.data.userUuid);
      const classesResult = await userModel.addUserToClasses(allClassCodes, userId);
      if(classesResult.data.errors?.length !== undefined){
        const classErrors = classesResult.data.errors.map(async (error: any) => {
          const response = await classModel.getClassById(error.classId);
          const schoolResponse = await schoolModel.addUsersToSchool(response.schoolUuid, error.userUuid)
          if(schoolResponse.success === true){
            console.log(error.username)
            const classesResult2 = await userModel.addUserToClasses(error.classId, userId);
            console.log(classesResult2.data)
          }
          console.log(test++)
        })

        await Promise.all(classErrors)
      }
      
      classesResult.data.success ? classAddSuccess++ : classAddFail++
    })
    
    await Promise.all(classEnrollment);

    return {
      accountExistingOrMade,
      accountSuccessFail,
      classAddSuccess,
      classAddFail,
    };
  } catch (error) {
    console.log('error >> ', error);
  }
}

async function getUserByGlobalGoID(userId: string){
  try {
    const response = await userModel.getUserByGlobalGoID(userId);
    return response.userId;
  } catch (error) {
    console.log('error >> ', error);
  }
}

async function checkAccountsAndClasses(userObj: User[]){
  const AccountAndClassCheck = userObj.map(async (user: any) => {
    const userAccount = await userModel.getUserByUsername(user.data.username);

    const classInfo = userAccount.classIds.map(async (code: any) => {
      const response = await classModel.getClassById(code);
      return response.classCode;
    })

    const classData = await Promise.all(classInfo);
    
    return {
      fullName: userAccount.fullName,
      subscriberType: userAccount.subscriberType,
      classData: classData
    };
  })
  const result = await Promise.all(AccountAndClassCheck);
  console.log(result);
}

parseExcel()


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
  console.log(userObj)
}