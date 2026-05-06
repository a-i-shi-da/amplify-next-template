'use client'

import { updateUserAttributes,UpdateUserAttributesOutput,deleteUser } from 'aws-amplify/auth';

export async function updateUserName(newUserName:string) {
  const output:UpdateUserAttributesOutput = await updateUserAttributes({
    userAttributes: {
      preferred_username: newUserName
    }
  });
  return output
}

export async function resignUser() {
  await deleteUser();
}