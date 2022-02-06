import routeList from '@routes/routeList';
import siderMenuList from '@components/Layout/Sider/siderMenuList';
import { IconType } from 'react-icons';

const findRoutePath = (label: string) => {
  let route = routeList.find((route) => route.label === label);
  return route?.path === undefined ? '404' : route.path;
};

const findIcon = (cat: string) => {
  let selected = siderMenuList.map((siderMenuLevel) =>
    siderMenuLevel.items.find((item) => item.key === cat) 
  );
  let icons = selected.find((selectedItem) => selectedItem !== undefined);
  let MatchedIcon: IconType = icons!.icon;
  return MatchedIcon;
};

export { findRoutePath, findIcon };
