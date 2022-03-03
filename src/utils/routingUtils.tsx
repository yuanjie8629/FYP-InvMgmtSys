import routeList from '@routes/routeList';
import siderMenuList from '@components/Layout/Sider/siderMenuList';
import { IconType } from 'react-icons';

export const findRoutePath = (label: string) => {
  let route = routeList.find((route) => route.label === label);
  return route?.path === undefined ? '404' : route.path;
};

export const findRouteLabel = (path: string) => {
  let route = routeList.find((route) => route.path === path);
  return route?.label === undefined ? '404' : route.label;
};

export const findIcon = (cat: string) => {
  let selected = siderMenuList.map((siderMenuLevel) =>
    siderMenuLevel.items.find((item) => item.key === cat)
  );
  let icons = selected.find((selectedItem) => selectedItem !== undefined);
  let MatchedIcon: IconType = icons!.icon;
  return MatchedIcon;
};


