'use server';

import * as React from 'react';
import { getGroupsForUser } from '@/lib/data';
import { GroupListClient } from './group-list-client';


export async function GroupList() {
  // Assuming current user is 'user-1'
  const groups = await getGroupsForUser('user-1');

  return <GroupListClient groups={groups} />;
}
