import axios from '@api/axiosInstance';
import { ItemType, RankingType } from '@utils/optionUtils';

export const toDoListAPI = () => axios.get(`analysis/to_do_list/`);

export const statisticsAPI = (fromDate: string, toDate: string) =>
  axios.get(`analysis/statistics/?from_date=${fromDate}&to_date=${toDate}`);

export interface ItemRankingAPIProps {
  itemType: ItemType;
  rankingType: RankingType;
  fromDate: string;
  toDate: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export const itemRankingAPI = (props: ItemRankingAPIProps) =>
  axios.get(
    `item/${props.itemType}/ranking/${props.rankingType}/?from_date=${
      props.fromDate
    }&to_date=${props.toDate}${
      props.category ? `&category=${props.category}` : ''
    }${props.limit ? `&limit=${props.limit}` : ''}${
      props.offset ? `&offset=${props.offset}` : ''
    }`
  );

export const keyMetricsSummaryAPI = (fromDate: string, toDate: string) =>
  axios.get(
    `analysis/key_metrics/summary/?from_date=${fromDate}&to_date=${toDate}`
  );

export type KeyMetricsType =
  | 'sales'
  | 'profit'
  | 'orders'
  | 'customers'
  | 'buyers'
  | 'avg_order_value'
  | 'units_sold'
  | 'avg_basket_size';

export type KeyMetricsDateType = 'hour' | 'day' | 'month';

export interface KeyMetricsProps {
  key: KeyMetricsType[];
  dateType: KeyMetricsDateType;
  fromDate: string;
  toDate: string;
}

export const keyMetricsAPI = (props: KeyMetricsProps) =>
  axios.get(
    `analysis/key_metrics/?from_date=${props.fromDate}&to_date=${props.toDate}&key=${props.key}&date_type=${props.dateType}`
  );
