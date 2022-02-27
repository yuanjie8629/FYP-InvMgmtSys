import { Tag as AntdTag, TagProps as AntdTagProps } from 'antd';

export interface TagProps extends AntdTagProps {
  children?: React.ReactNode;
  width?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  height?: number | string;
  justify?: 'start' | 'center' | 'end';
  border?: number;
}

const Tag = ({
  width = 'auto',
  minWidth = 'auto',
  maxWidth = 'auto',
  height = '100%',
  justify = 'center',
  border = 10,
  style,
  ...props
}: TagProps) => {
  return (
    <AntdTag
      style={{
        width: width,
        minWidth: minWidth,
        maxWidth: maxWidth,
        height: height,
        borderRadius: border,
        textAlign: justify,
        margin: 0,
        ...style,
      }}
      {...props}
    />
  );
};

export default Tag;
