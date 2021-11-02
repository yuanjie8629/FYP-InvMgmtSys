import { Layout } from 'antd'
import './Layout.less'

const CustomHeader = () => {
  const { Header } = Layout
  return (
    <div className="header-fixed">
      <Header className="header"></Header>
    </div>
  )
}

export default CustomHeader
