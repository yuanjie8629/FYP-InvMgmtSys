import { ArgsProps } from 'antd/lib/message';

export const serverErrMsg: ArgsProps = {
  key: 'serverErr',
  type: 'error',
  content: 'Something went wrong. Please try again later.',
};

export const actionSuccessMsg: (
  recordType: string,
  action: 'activate' | 'delete' | 'hide' | 'update',
  length: number
) => ArgsProps = (
  recordType: string,
  action: 'activate' | 'delete' | 'hide' | 'update',
  length: number
) => {
  return {
    key: action,
    type: 'success',
    content: `${length} ${length === 1 ? recordType : `${recordType}s`} ${
      action === 'activate'
        ? 'Activated'
        : action === 'delete'
        ? 'Deleted'
        : action === 'hide'
        ? 'Hidden'
        : action === 'update'
        ? 'Updated'
        : null
    } Successfully`,
  };
};
