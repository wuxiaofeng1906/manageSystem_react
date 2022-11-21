import { Redirect } from 'umi';
import React, { Component } from 'react';
import { checkLogin } from '@/utils/utils';
export default (props: any) => {
  const { flag, redirect } = checkLogin();
  if (flag) {
    // return <ErrorBoundary>{props.children}</ErrorBoundary>;
    return <div style={{ height: '100%' }}>{props.children}</div>;
  } else {
    return <Redirect to={redirect} />;
  }
};
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <h1>系统内部错误.</h1>;
    }
    return this.props.children;
  }
}
