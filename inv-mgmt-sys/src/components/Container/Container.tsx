import classNames from 'classnames';
interface ContainerProps {
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end';
  childeren?: React.ReactNode;
}

export default function Container(props: ContainerProps) {
  return <div>{props.childeren}</div>;
}
