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
import { 
  User as UserModel, 
  Class as ClassModel,
} from 'edjin-node-sdk'
import { readFileSync } from 'fs';
import * as path from 'path';
const userModel = new UserModel()
const classModel = new ClassModel()
const FILENAME: string = 'auto accounts provisioning - ejdin - stg.xlsx';

const UID: number = 0
const EMAIL: number = 1
const FIRST_NAME: number = 3
const LAST_NAME: number = 4
const COUNTRY_CODE: number = 7
const USER_ROLE: number = 8
const CLASS_KEY: number = 9

let accountExistingOrMade = 0;
let accountSuccessFail = 0;
let classAddSuccess = 0;
let classAddFail = 0;
let totalMissingClasses = 0;

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
            userUuid: el[UID]?.toString().trim(),
            email: el[EMAIL]?.toString().trim(),
            username: el[EMAIL]?.toString().trim(),
            firstName: el[FIRST_NAME]?.toString().trim(),
            lastName: el[LAST_NAME]?.toString().trim(),
            countryCode: el[COUNTRY_CODE]?.toString().trim().toUpperCase(),
            subscriberType: el[USER_ROLE]?.toString().trim().toUpperCase(),
            brandCode: 'IGCSE',
            classCodes: classKey
          }
        }
        console.log(userData)
        userObj.push(userData);
        count++;
      })
  });

  await provisionAccounts(userObj);
  await checkAccountsAndClasses(userObj);

  console.log('\x1b[32m%s\x1b[0m', 'Accounts made or existing: ' + accountExistingOrMade);
  console.log('\x1b[31m%s\x1b[0m', 'No. of account creation failures: ' + accountSuccessFail + '\n');
  console.log('\x1b[32m%s\x1b[0m', 'Class addition to accounts success: ' + classAddSuccess);
  console.log('\x1b[31m%s\x1b[0m', 'Class addition to accounts failures: ' + classAddFail + '\n');
  console.log('\x1b[31m%s\x1b[0m', 'Enrolled accounts failures: ' + totalMissingClasses);
}

async function provisionAccounts(userObj: User[]){
  try {
    console.log('CREATING ACCOUNTS')
    const accountCreation = userObj.map(async (user: any) => {
      const response = await userModel.createUser(user.data);
      if(response.success || response.code === 'DUPLICATE_USERNAME'){
        accountExistingOrMade++
        console.log(user.data.firstName + ' ' + user.data.lastName)
        console.log('\x1b[32m%s\x1b[0m', 'ACCOUNT CREATION: OK')
      }else{
        accountSuccessFail++
        console.log(user.data.firstName + ' ' + user.data.lastName)
        console.log('\x1b[31m%s\x1b[0m', 'ACCOUNT CREATION: ERROR')
        console.log('\x1b[31m%s\x1b[0m', 'Reason: '+ response.message)
      }
      return response 
    })
    await Promise.all(accountCreation);
    console.log('STARTING ENROLLMENT')
    const classEnrollment = userObj.map(async (user: any) => {

      const classCodes = user.data.classCodes.map(async (code: any) => {
        const response = await classModel.getClassByClassKey(code);
        return response.classId 
      })
      const allClassCodes = await Promise.all(classCodes);

      const { userId } = await getUserByGlobalGoID(user.data.userUuid);
      const classesResult = await userModel.addUserToClasses(allClassCodes, userId);
      if(classesResult.data.errors?.length !== undefined || !classesResult.data.success){
        classAddFail++
        console.log(user.data.firstName + ' ' + user.data.lastName)
        console.log('\x1b[31m%s\x1b[0m', 'CLASS ENROLLMENT: ERROR')
        console.log('\x1b[31m%s\x1b[0m', 'Reason: '+ classesResult.message)
      }else{
        classAddSuccess++
        console.log(user.data.firstName + ' ' + user.data.lastName)
        console.log('\x1b[32m%s\x1b[0m', 'CLASS ENROLLMENT: OK')
      }
    })
    await Promise.all(classEnrollment);
  } catch (error) {
    console.log('error at provisionAccounts >> ', error);
  }
}

async function getUserByGlobalGoID(userId: string){
  try {
    return await userModel.getUserByGlobalGoID(userId);
  } catch (error) {
    console.log('error at getUserByGlobalGoID >> ', error);
  }
}

async function checkAccountsAndClasses(userObj: User[]){
  try {
    let missingCodes: string[] = [];

    const AccountAndClassCheck = userObj.map(async (user: any) => {
      const userAccount = await userModel.getUserByUsername(user.data.username);
  
      const classInfo = userAccount.classIds.map(async (code: any) => {
        const response = await classModel.getClassById(code);
        return response.classCode;
      })
      const classData = await Promise.all(classInfo);
  
      const compareCodesResult = classData.map(async (EjdinCodes: any) => {
        if(user.data.classCodes.includes(EjdinCodes) === false){
          missingCodes.push();
          totalMissingClasses++;
        }
      })
      await Promise.all(compareCodesResult);
  
      return {
        fullName: userAccount.fullName as string,
        subscriberType: userAccount.subscriberType as string,
        missingCodes: missingCodes as string[]
      };
    })
    const result = await Promise.all(AccountAndClassCheck);

    result?.forEach(data => {
      console.log('Name: ' + data.fullName);
      console.log('Account Type: ' + data.subscriberType);
      data.missingCodes.length === 0 ? console.log('\x1b[32m%s\x1b[0m', 'EXCEL CLASS CHECK: OK') : console.log('\x1b[31m%s\x1b[0m', 'EXCEL CLASS CHECK: ERROR')
    });
  } catch (error) {
    console.log('error at checkAccountsAndClasses >> ', error);
  }
}

parseExcel()