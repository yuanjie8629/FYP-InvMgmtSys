import { ArgsProps } from 'antd/lib/message';

export const serverErrMsg: ArgsProps = {
  type: 'error',
  content: 'Something went wrong. Please try again later.',
};

export const actionSuccessMsg: (
  recordType: string,
  action:
    | 'activate'
    | 'delete'
    | 'hide'
    | 'update'
    | 'suspend'
    | 'accept'
    | 'reject'
    | 'invoice',
  length: number
) => ArgsProps = (
  recordType: string,
  action:
    | 'activate'
    | 'delete'
    | 'hide'
    | 'update'
    | 'suspend'
    | 'accept'
    | 'reject'
    | 'invoice',
  length: number
) => {
  return {
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
        : action === 'suspend'
        ? 'Suspended'
        : action === 'accept'
        ? 'Accepted'
        : action === 'reject'
        ? 'Rejected'
        : action === 'invoice'
        ? 'Generated'
        : null
    } Successfully`,
  };
};
