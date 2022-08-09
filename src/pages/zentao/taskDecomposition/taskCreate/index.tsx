import { axiosPost } from '@/publicMethods/axios';

const userLogins: any = localStorage.getItem('userLogins');
const usersLoginInfo = JSON.parse(userLogins);

// 创建禅道分解任务
const createZentaoTaskDecompose = async (gridData: any, executionId: number) => {
  const taskArray: any = [];
  gridData.forEach((row: any) => {
    taskArray.push({
      add_type: row.add_type,
      task_type: row.task_type,
      task_name: row.task_name,
      module: row.module,
      subtask_dev_needs: row.subtask_dev_id,
      assigned_person: row.assigned_person,
      priority: row.priority,
      estimate: row.estimate,
      desc: row.desc,
      belongs: row.belongs,
      tasksource: row.tasksource,
      is_tailoring: row.is_tailoring,
      // "temp_type": "string",
      // "task_id": "string",
      // "parent": "0",
      start_time: row.plan_start,
      end_time: row.plan_end,
      execution_id: executionId,
      edit_user: usersLoginInfo.userid,
      create_user: usersLoginInfo.userid,
      app_server: row.app_server?.join(',') ?? '',
    });
  });
  const createResult = await axiosPost('/api/verify/sprint/task', taskArray);
  return createResult;
};

export { createZentaoTaskDecompose };
