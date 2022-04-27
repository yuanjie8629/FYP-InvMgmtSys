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

export const checkURL = (url: string) => {
  let splitURL = url.split('/').filter((url) => url);
  if (splitURL[splitURL.length - 1] === '') splitURL.pop();

  if (
    splitURL.includes('shipment') &&
    splitURL.includes('shipping_fee') &&
    !['shipping_fee', 'add'].includes(splitURL[splitURL.length - 1])
  ) {
    splitURL.pop();
    splitURL.push(':id');
  }

  if (new RegExp(/\d/g).test(splitURL[splitURL.length - 1])) {
    splitURL[splitURL.length - 1] =
      splitURL[splitURL.length - 1].replace(/\d/g, '') + ':id';
  }
  return `/${splitURL.join('/')}`;
};
