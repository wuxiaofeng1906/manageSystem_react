import { Redirect } from 'umi';
import { checkLogin } from '@/utils/utils';
export default (props: any) => {
  const { flag, redirect } = checkLogin();
  if (flag) {
    return <div>{props.children}</div>;
  } else {
    return <Redirect to={redirect} />;
  }
};
